import User from "@Content/Modules/User";
import RequestData from "@Content/Modules/RequestData";

interface TAchievementProgress {
    appid: number,
    unlocked: number,
    total: number,
    percentage: number,
    all_unlocked: boolean,
    cache_time: number
}

export default class SteamApi {

    static async getAchievementsProgress(appid: number): Promise<TAchievementProgress> {
        let responseData: {
            response?: {
                achievement_progress: Array<TAchievementProgress>
            }
        };

        try {
            const token = await User.getWebApiToken();
            const steamId = User.steamId;

            const response = await RequestData.post(
                `https://api.steampowered.com/IPlayerService/GetAchievementsProgress/v1/?access_token=${token}`,
                {"steamid": steamId, "appids[0]": String(appid)},
                {"credentials": "omit"}
            );
            responseData = await response.json();
        } catch (err) {
            throw new Error("Failed to fetch achievements");
        }

        let data = responseData?.response?.achievement_progress?.[0];

        if (!data) {
            throw new Error("Failed to find achievements data");
        }

        return data;
    }

}
