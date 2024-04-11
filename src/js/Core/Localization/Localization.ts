import {BackgroundSimple, ExtensionResources, Language, SyncedStorage} from "../../modulesCore";


class Localization {

    static loadLocalization(code) {
        return ExtensionResources.getJSON(`/localization/${code}.json`);
    }

    static init() {
        if (Localization._promise) { return Localization._promise; }

        let currentSteamLanguage = Language.getCurrentSteamLanguage();
        const storedSteamLanguage = SyncedStorage.get("language");
        if (currentSteamLanguage === null) {
            currentSteamLanguage = storedSteamLanguage;
        } else if (currentSteamLanguage !== storedSteamLanguage) {
            SyncedStorage.set("language", currentSteamLanguage);
            BackgroundSimple.action("clearpurchases");
        }

        function deepAssign(target, source) {

            // Object.assign() but deep-assigning objects recursively
            for (const [key, val] of Object.entries(source)) {
                if (typeof val === "object") {
                    target[key] ??= {};
                    deepAssign(target[key], val);
                } else if (val === "" || typeof val !== "string") {
                    console.warn("Unknown value for term", key);
                    continue;
                } else {
                    target[key] = val;
                }
            }
            return target;
        }

        const local = Language.getLanguageCode(currentSteamLanguage);
        const codes = ["en"];
        if (local !== null && local !== "en") {
            codes.push(local);
        }
        Localization._promise = Promise.all(
            codes.map(lc => Localization.loadLocalization(lc))
        ).then(([english, local]) => {
            Localization.str = english;
            if (local) {
                deepAssign(Localization.str, local);
            }
            return Localization.str;
        });
        return Localization._promise;
    }

    static then(onDone, onCatch) {
        return Localization.init().then(onDone, onCatch);
    }

    static getString(key) {

        // Source: http://stackoverflow.com/a/24221895
        const path = key.split(".").reverse();
        let current = Localization.str;

        while (path.length) {
            if (typeof current !== "object") {
                return null;
            }
            current = current[path.pop()];
        }
        return current;
    }
}

Localization._promise = null;


export {Localization};
