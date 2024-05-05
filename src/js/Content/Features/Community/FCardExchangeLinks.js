import AppId from "@Core/GameId/AppId";
import {ExtensionResources, GameId, HTML, SyncedStorage} from "../../../modulesCore";
import {CallbackFeature} from "../../Modules/Feature/CallbackFeature";

export default class FCardExchangeLinks extends CallbackFeature {

    checkPrerequisites() {
        return SyncedStorage.get("steamcardexchange");
    }

    setup() {
        this.callback();
    }

    callback() {

        const ceImg = ExtensionResources.getURL("img/ico/steamcardexchange.png");

        for (const node of document.querySelectorAll(".badge_row:not(.es-has-ce-link")) {
            const appid = this.context.appid || AppId.fromGameCardUrl(node.querySelector(".badge_row_overlay").href);
            if (!appid) { continue; }

            HTML.afterBegin(node,
                `<div class="es_steamcardexchange_link">
                    <a href="https://www.steamcardexchange.net/index.php?gamepage-appid-${appid}/" target="_blank" title="Steam Card Exchange">
                        <img src="${ceImg}" alt="Steam Card Exchange">
                    </a>
                </div>`);

            node.classList.add("es-has-ce-link");
        }
    }
}
