import { ASFeature } from "../../ASFeature.js";
import { HTML, LocalStorage } from "../../../core.js";

export class FReviewToggleButton extends ASFeature {

    checkPrerequisites() {
        return document.querySelector("#review_create h1");
    }

    apply() {
        let head = document.querySelector("#review_create h1");

        HTML.beforeEnd(head, `<div style="float: right;"><a class="btnv6_lightblue_blue btn_mdium" id="es_review_toggle"><span>▲</span></a></div>`);

        let reviewSectionNode = document.createElement("div");
        reviewSectionNode.setAttribute("id", "es_review_section");

        let nodes = document.querySelector("#review_container").querySelectorAll("p, .avatar_block, .content");
        for (let node of nodes) {
            reviewSectionNode.append(node);
        }

        head.insertAdjacentElement("afterend", reviewSectionNode);

        this._toggleReviews(LocalStorage.get("show_review_section", true));

        let node = document.querySelector("#review_create");
        if (node) {
            node.addEventListener("click", ({ target }) => {
                if (!target.closest("#es_review_toggle")) { return; }
                this._toggleReviews();
            });
        }
    }

    _toggleReviews(state) {
        if (typeof state === "undefined") {
            state = !LocalStorage.get("show_review_section", true);
            LocalStorage.set("show_review_section", state);
        }
        if (state) {
            document.querySelector("#es_review_toggle span").textContent = "▲";
            document.querySelector("#es_review_section").style.maxHeight = null;
        } else {
            document.querySelector("#es_review_toggle span").textContent = "▼";
            document.querySelector("#es_review_section").style.maxHeight = 0;
        }
    }
}
