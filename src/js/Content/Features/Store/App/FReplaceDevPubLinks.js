import {L} from "@Core/Localization/Localization";
import {__options_homepage} from "@Strings/_strings";
import {HTML} from "../../../../modulesCore";
import {Feature} from "../../../modulesContent";
import {Page} from "../../Page";

export default class FReplaceDevPubLinks extends Feature {

    apply() {

        const devs = [...document.querySelectorAll("#genresAndManufacturer > .dev_row:first-of-type > a")];

        // We need to use this element to locate the row that contains developer info, see #1346
        const glanceDevRow = document.getElementById("developers_list")?.parentElement;
        if (glanceDevRow) {
            devs.push(...glanceDevRow.querySelectorAll("a"));
        }

        const pubs = [...document.querySelectorAll("#genresAndManufacturer > .dev_row:nth-of-type(2) > a")];

        const glancePubRow = glanceDevRow?.nextElementSibling;
        if (glancePubRow) {
            pubs.push(...glancePubRow.querySelectorAll("a"));
        }

        let franchise = document.querySelector(".details_block > .dev_row:nth-of-type(3) > a");
        franchise = franchise ? [franchise] : [];

        for (const node of [...devs, ...pubs, ...franchise]) {
            const homepageLink = new URL(node.href);
            if (homepageLink.pathname.startsWith("/search/")) { continue; }

            let type;
            if (devs.includes(node)) {
                type = "developer";
            } else if (pubs.includes(node)) {
                type = "publisher";
            } else if (franchise === node) {
                type = "franchise";
            }
            if (!type) { continue; }

            node.href = `https://store.steampowered.com/search/?${type}=${encodeURIComponent(node.textContent)}`;
            HTML.afterEnd(node, ` (<a href="${homepageLink.href}">${L(__options_homepage)}</a>)`);
        }

        for (const moreBtn of document.querySelectorAll(".dev_row > .more_btn")) {
            moreBtn.remove();
        }

        Page.runInPageContext(() => {
            window.SteamFacade.collapseLongStrings(".dev_row .summary.column");
        });
    }
}
