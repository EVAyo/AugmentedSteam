import {__viewAstats} from "../../../../../localization/compiled/_strings";
import {L} from "../../../../Core/Localization/Localization";
import {ExtensionResources, HTML, SyncedStorage} from "../../../../modulesCore";
import {Feature} from "../../../Modules/Feature/Feature";

// todo maybe integrate with other useful links?
export default class FAStatsLink extends Feature {

    checkPrerequisites() {
        return SyncedStorage.get("showastatslink") && this.context.hasAchievements;
    }

    apply() {
        const imgUrl = ExtensionResources.getURL("img/ico/astatsnl.png");
        const url = `https://astats.astats.nl/astats/Steam_Game_Info.php?AppID=${this.context.communityAppid}`;

        HTML.beforeEnd("#achievement_block",
            `<div class="game_area_details_specs">
                <div class="icon"><img class="astats_icon" src="${imgUrl}"></div>
                <a class="name es_external_icon" href="${url}" target="_blank">${L(__viewAstats)}</a>
            </div>`);
    }
}
