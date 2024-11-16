
export enum EAction {
    Prices = "prices",
    DlcInfo = "dlcinfo",
    StorePageData = "storepagedata",
    StorePageData_Expire = "storepagedata.expiry",
    Rates = "rates",
    Rates_Clear = "clearrates",
    IsEA = "isea",
    ProfileBackground = "profile.background",
    ProfileBackgroundGames = "profile.background.games",
    TwitchStream = "twitch.stream",
    Market_CardPrices = "market.cardprices",
    Market_AverageCardPrices = "market.averagecardprices",
    SteamPeek = "steampeek",
    Profile = "profile",
    Profile_Clear = "clearownprofile",

    CacheClear = "cache.clear",

    Login = "community.login",
    Logout = "community.logout",
    BadgeInfo = "community.badgeinfo",
    WorkshopFileSize = "community.workshopFileSize",
    Reviews = "community.reviews",
    StoreCountry_Set = "community.storecountry.set",
    StoreCountry_Get = "community.storecountry.get",
    Cards = "community.cards",

    Inventory_GetCoupon = "inventory.coupon",
    Inventory_GetCouponsAppids = "inventory.getCouponAppids",
    Inventory_GetGiftsAppids = "inventory.getGiftsAppids",
    Inventory_GetPassesAppids = "inventory.getPassesAppids",
    Inventory_HasItem = "inventory.hasItem",

    Wishlist_Add = "wishlist.add",
    Wishlist_Remove = "wishlist.remove",
    AppDetails = "appdetails",
    Currency = "currency",
    SessionId = "sessionid",
    Purchases = "purchases",
    Purchases_Clear = "clearpurchases",
    DynamicStore_Clear = "dynamicstore.clear",
    DynamicStore_Status = "dynamicstore.status",
    DynamicStore_RandomApp = "dynamicstore.randomapp",

    StoreList = "itad.storelist",
    Authorize = "itad.authorize",
    Disconnect = "itad.disconnect",
    IsConnected = "itad.isconnected",
    Export = "itad.export",
    Sync = "itad.sync",
    LastImport = "itad.lastimport",
    SyncEvents = "itad.syncevents",
    InWaitlist = "itad.inwaitlist",
    AddToWaitlist = "itad.addtowaitlist",
    RemoveFromWaitlist = "itad.removefromwaitlist",
    InCollection = "itad.incollection",
    GetFromCollection = "itad.getfromcollection",
    ITAD_Notes_Pull = "itad.notes.pull",
    ITAD_Notes_Push = "itad.notes.push",
    ITAD_Notes_Delete = "itad.notes.delete",

    Notes_Get = "notes.get",
    Notes_Set = "notes.set",
    Notes_Delete = "notes.delete",
    Notes_GetAll = "notes.getall",
    Notes_SetAll = "notes.setall",
    Notes_Clear = "notes.clear",
}
