import setup from "../setup";
import {LocalStorage, Permissions, SyncedStorage} from "../modulesCore";
import {ContextMenu} from "./Modules/ContextMenu";
import IndexedDB from "./Modules/IndexedDB";
import {SteamCommunityApi} from "./Modules/Community/SteamCommunityApi";
import {SteamStoreApi} from "./Modules/SteamStoreApi";
import {StaticResources} from "./Modules/StaticResources";
import {ITADApi} from "./Modules/IsThereAnyDeal/ITADApi";
import AugmentedSteamApi from "./Modules/AugmentedSteam/AugmentedSteamApi";
import {ExtensionData} from "./Modules/ExtensionData";
import CacheStorage from "./Modules/CacheStorage";
import browser, {type Runtime} from "webextension-polyfill";
import type {TGetStoreListMessage} from "./Modules/IsThereAnyDeal/_types";
import type {TFetchBadgeInfoMessage} from "./Modules/Community/_types";
import type ApiHandlerInterface from "@Background/ApiHandlerInterface";

type MessageSender = Runtime.MessageSender;

// Functions that are called when an object store (or one of its entries) has expired
IndexedDB.objStoreFetchFns = new Map([
    ["coupons", SteamCommunityApi.coupons],
    ["giftsAndPasses", SteamCommunityApi.giftsAndPasses],
    ["items", SteamCommunityApi.items],
    ["workshopFileSizes", SteamCommunityApi.fetchWorkshopFileSize],
    ["reviews", SteamCommunityApi.fetchReviews],

    ["purchases", SteamStoreApi.purchaseDate],
    ["dynamicStore", SteamStoreApi.dynamicStore],
    ["packages", SteamStoreApi.fetchPackage],

    ["collection", async () => {
        const data = await ITADApi.fetchCollection();
        await IndexedDB.put("collection", data);
        return data;
    }],
    ["waitlist", async () => {
        const data = await ITADApi.fetchWaitlist();
        await IndexedDB.put("waitlist", data);
        return data;
    }],
    ["storeList", ITADApi.fetchStoreList],
]);

const actionCallbacks = new Map([
    ["wishlist.add", SteamStoreApi.wishlistAdd],
    ["wishlist.remove", SteamStoreApi.wishlistRemove],
    ["dynamicstore.clear", SteamStoreApi.clearDynamicStore],

    ["steam.currencies", StaticResources.currencies],

    ["migrate.cachestorage", CacheStorage.migrate],

    ["notes.get", ExtensionData.getNote],
    ["notes.set", ExtensionData.setNote],
    ["notes.delete", ExtensionData.deleteNote],
    ["notes.getall", ExtensionData.getAllNotes],
    ["notes.setall", ExtensionData.setAllNotes],
    ["notes.clear", ExtensionData.clearNotes],
    ["cache.clear", ExtensionData.clearCache],

    ["appdetails", SteamStoreApi.appDetails],
    ["currency", SteamStoreApi.currency],
    ["sessionid", SteamStoreApi.sessionId],
    ["wishlists", SteamStoreApi.wishlists],
    ["purchases", SteamStoreApi.purchases],
    ["clearpurchases", SteamStoreApi.clearPurchases],
    ["dynamicstore.status", SteamStoreApi.dsStatus],
    ["dynamicstore.randomapp", SteamStoreApi.dynamicStoreRandomApp],

    ["login", SteamCommunityApi.login],
    ["logout", SteamCommunityApi.logout],
    ["storecountry", SteamCommunityApi.storeCountry],
    ["cards", SteamCommunityApi.fetchBadgeInfo],
    ["coupon", SteamCommunityApi.getCoupon],
    ["hasgiftsandpasses", SteamCommunityApi.hasGiftsAndPasses],
    ["hascoupon", SteamCommunityApi.hasCoupon],
    ["hasitem", SteamCommunityApi.hasItem],
    ["profile", SteamCommunityApi.getProfile],
    ["clearownprofile", SteamCommunityApi.clearOwn],
    ["workshopfilesize", SteamCommunityApi.getWorkshopFileSize],
    ["reviews", SteamCommunityApi.getReviews],

    ["itad.authorize", ITADApi.authorize],
    ["itad.disconnect", ITADApi.disconnect],
    ["itad.isconnected", ITADApi.isConnected],
    ["itad.import", ITADApi.import],
    ["itad.sync", ITADApi.sync],
    ["itad.lastimport", ITADApi.lastImport],
    ["itad.inwaitlist", ITADApi.inWaitlist],
    ["itad.addtowaitlist", ITADApi.addToWaitlist],
    ["itad.removefromwaitlist", ITADApi.removeFromWaitlist],
    ["itad.incollection", ITADApi.inCollection],
    ["itad.getfromcollection", ITADApi.getFromCollection],

    ["error.test", () => { return Promise.reject(new Error("This is a TEST Error. Please ignore.")); }],
]);


/** @deprecated */
type GenericMessage = {
    action: string,
    params?: any
};

type Message =
    // ITADApi
    | TGetStoreListMessage
    // SteamCommunityApi
    | TFetchBadgeInfoMessage
    // old
    | GenericMessage;

browser.runtime.onMessage.addListener((
    message: Message,
    sender: MessageSender,
    sendResponse: (...params: any) => void
): true|undefined => {

    if (!sender || !sender.tab) { // not from a tab, ignore
        return;
    }
    if (!message || !message.action) {
        return;
    }

    (async function(): Promise<void> {
        try {
            await Promise.all([IndexedDB, CacheStorage, LocalStorage, SyncedStorage.then(() => { setup(); })]);

            let response: any;

            /*
             * TODO: (<>message.)params typecast should be needed only until we allow GenericMessage, once we get rid of it,
             *   remove type cast, which should also ensure better checks
             */

            let handlers: ApiHandlerInterface[] = [
                new AugmentedSteamApi()
            ];

            for (let handler of handlers) {
                response = handler.handle(message);
                if (response !== undefined) {
                    break;
                }
            }


            switch (message.action) { // TODO rename to "api"?

                case "itad.storelist":
                    response = await ITADApi.getStoreList();
                    break;

                case "community.badgeinfo":
                    const {steamId, appid} = (<TFetchBadgeInfoMessage>message).params;
                    response = await SteamCommunityApi.fetchBadgeInfo(steamId, appid);
                    break;


                default: {
                    /*
                     * TODO deprecated
                     * Old handling, remove once we rewrite all handlers to explicit style above
                     */
                    const callback = actionCallbacks.get(message.action);
                    if (!callback) {

                        // requested action not recognized, reply with error immediately
                        throw new Error(`Did not recognize "${message.action}" as an action.`);
                    }

                    const params = (<GenericMessage>message).params || [];
                    response = await callback(...params);
                }
            }

            sendResponse(response);
        } catch (err) {
            console.group(`Callback: "${message.action}"`);
            console.error("Failed to execute %o", message);
            console.error(err);
            console.groupEnd();

            throw new Error((<Error>err).toString());
        }
    })();
    return true;
});

browser.runtime.onStartup.addListener(ContextMenu.update);
browser.runtime.onInstalled.addListener(ContextMenu.update);

Permissions.when("contextMenus", () => {
    browser.contextMenus.onClicked.addListener(ContextMenu.onClick);
}, () => {
    browser.contextMenus.onClicked.removeListener(ContextMenu.onClick);
});
