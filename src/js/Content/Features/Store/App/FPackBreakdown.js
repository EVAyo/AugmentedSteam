import {__each} from "@Strings/_strings";
import {L} from "../../../../Core/Localization/Localization";
import {HTML} from "../../../../modulesCore";
import {CurrencyManager, Feature, Price} from "../../../modulesContent";

export default class FPackBreakdown extends Feature {

    apply() {

        for (const node of document.querySelectorAll(".game_area_purchase_game_wrapper:not(.bundle_hidden_by_preferences)")) {

            // prevent false positives on packages e.g. Doom 3
            if (node.querySelector(".btn_packageinfo")) { continue; }

            let title = node.querySelector("h1").textContent;
            title = title.toLowerCase().replace(/-/g, " ");

            let text = "";
            if (node.querySelector("p")) {
                text = node.querySelector("p").textContent;
            }

            if (title.includes("2 pack")
                || title.includes("two pack")
                || title.includes("tower wars friend pack")
                || text.includes("gift copy")
                || text.includes("extra copy")) {

                this._splitPack(node, 2);

            } else if (title.includes("3 pack")
                || title.includes("three pack")
                || title.includes("tower wars team pack")) {

                this._splitPack(node, 3);

            } else if (title.includes("4 pack")
                || title.includes("four pack")
                || title.includes("clan pack")) {

                this._splitPack(node, 4);

            } else if (title.includes("5 pack")
                || title.includes("five pack")) {

                this._splitPack(node, 5);

            } else if (title.includes("6 pack")
                || title.includes("six pack")) {

                this._splitPack(node, 6);
            }
        }
    }

    _splitPack(node, ways) {
        const priceNode = node.querySelector("[data-price-final]");
        if (!priceNode) { return; }

        const currency = CurrencyManager.fromType(CurrencyManager.storeCurrency);
        const scaleFactor = 10 ** currency.format.decimalPlaces;

        let unitPrice = Number(priceNode.dataset.priceFinal) / 100 / ways;
        unitPrice = Math.ceil(unitPrice * scaleFactor) / scaleFactor;

        HTML.afterBegin(node.querySelector(".game_purchase_action_bg"),
            `<div class="es_each_box">
                <div class="es_each_price">${new Price(unitPrice)}</div>
                <div class="es_each">${L(__each)}</div>
            </div>`);
    }
}
