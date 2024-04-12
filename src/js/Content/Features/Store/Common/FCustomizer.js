import {L} from "@Core/Localization/Localization";
import {
    __apppageEabanner,
    __apppageEaheader,
    __apppageFranchise,
    __apppageGreenlight,
    __apppageLegal,
    __apppageMorefromfranchise,
    __apppageRecentupdates,
    __apppageSections,
    __apppageWorkshop,
    __customize,
    __homepageCurators,
    __homepageSidebar,
    __homepageTabs,
    __homepageTopnewreleases,
} from "@Strings/_strings";
import {HTML, SyncedStorage} from "../../../../modulesCore";
import {ContextType, Feature, Messenger} from "../../../modulesContent";
import {Page} from "../../Page";

export default class FCustomizer extends Feature {

    apply() {

        HTML.afterBegin("#cart_status_data",
            `<div class="store_header_btn_gray store_header_btn" id="es_customize_btn">
                <div class="es_customize_title">${L(__customize)}<img src="//store.cloudflare.steamstatic.com/public/images/v6/btn_arrow_down_padded_white.png"></div>
                <div class="home_viewsettings_popup">
                    <div class="home_viewsettings_instructions">${L(__apppageSections)}</div>
                </div>
            </div>`);

        const customizeBtn = document.getElementById("es_customize_btn");

        customizeBtn.addEventListener("click", () => {
            customizeBtn.classList.toggle("active");
        });

        customizeBtn.querySelector(".home_viewsettings_popup").addEventListener("click", e => {
            e.stopPropagation();
        });

        customizeBtn.addEventListener("mouseleave", () => {
            customizeBtn.classList.remove("active");
        });

        if (this.context.type === ContextType.APP) {
            this._customizeAppPage();
        } else if (this.context.type === ContextType.STORE_FRONT) {

            Messenger.onMessage("renderComplete").then(() => { this._customizeFrontPage(); });

            /*
             * Run our customizer when GHomepage.bInitialRenderComplete is set to `true`
             * https://github.com/SteamDatabase/SteamTracking/blob/d22d8df5db80e844f7ae1157dbb8b59532dfe4f8/store.steampowered.com/public/javascript/home.js#L432
             */
            Page.runInPageContext(() => {

                // eslint-disable-next-line no-undef
                if (GHomepage.bInitialRenderComplete) {
                    window.Messenger.postMessage("renderComplete");
                    return;
                }

                // eslint-disable-next-line no-undef
                GHomepage = new Proxy(GHomepage, {
                    set(target, prop, value, ...args) {
                        if (prop === "bInitialRenderComplete" && value === true) {
                            window.Messenger.postMessage("renderComplete");
                        }

                        return Reflect.set(target, prop, value, ...args);
                    }
                });
            });
        }
    }

    _customizeAppPage() {

        function getParentEl(selector) {
            const el = document.querySelector(selector);
            return el && el.closest(".game_page_autocollapse_ctn");
        }

        const customizer = new FCustomizer.Customizer("customize_apppage", this.context);
        customizer
            .add("franchisenotice", ".franchise_notice", L(__apppageFranchise))
            .add("eaheader", ".early_access_header:not(.es_coupon_info)", L(__apppageEaheader))
            .add("eabanner", ".early_access_banner", L(__apppageEabanner))
            .add("recentupdates", "[data-featuretarget=events-row]", L(__apppageRecentupdates))
            .add("reviews", "#game_area_reviews")
            .add("about", getParentEl("#game_area_description"))
            .add("contentwarning", getParentEl("#game_area_content_descriptors"))
            .add("sysreq", getParentEl(".sys_req"))
            .add("legal", getParentEl("#game_area_legal"), L(__apppageLegal))
            .add("moredlcfrombasegame", "#moredlcfrombasegame_block")
            .add("franchise", "#franchise_block", L(__apppageMorefromfranchise))
            .add("morelikethis", "#recommended_block")
            .add("recommendedbycurators", ".steam_curators_block")
            .add("customerreviews", "#app_reviews_hash")
            .add("workshop", getParentEl("[href^='https://steamcommunity.com/workshop/browse']"), L(__apppageWorkshop))
            .add("greenlight", getParentEl("[href^='https://steamcommunity.com/greenlight']"), L(__apppageGreenlight));

        customizer.build();
    }

    _customizeFrontPage() {

        function getParentEl(selector) {
            const el = document.querySelector(selector);
            return el && el.closest(".home_ctn");
        }

        const customizer = new FCustomizer.Customizer("customize_frontpage", this.context);
        customizer
            .add("featuredrecommended", ".home_cluster_ctn")
            .add("trendingamongfriends", ".friends_recently_purchased", "", true)
            .add("discoveryqueue", ".discovery_queue_ctn")
            .add("curators", ".steam_curators_ctn", L(__homepageCurators))
            .add("morecuratorrecommendations", ".apps_recommended_by_curators_ctn", L(__homepageCurators))
            .add("fromdevelopersandpublishersthatyouknow", ".recommended_creators_ctn")
            .add("popularvrgames", ".best_selling_vr_ctn")
            .add("homepagetabs", ".tab_container", L(__homepageTabs))
            .add("gamesstreamingnow", ".live_streams_ctn", "", true)
            .add("updatesandoffers", ".marketingmessage_area", "", true)
            .add("topnewreleases", ".top_new_releases", L(__homepageTopnewreleases))
            .add("homepagesidebar", "body:not(.no_home_gutter) .home_page_gutter", L(__homepageSidebar))
            .add("specialoffers", getParentEl(".special_offers"))
            .add("browsesteam", getParentEl(".big_buttons.home_page_content"))
            .add("recentlyupdated", getParentEl(".recently_updated_block"))
            .add("under", getParentEl("[class*='specials_under']"));

        for (const node of document.querySelectorAll(
            ".home_page_body_ctn .home_ctn:not(.esi-customizer), .home_pagecontent_ctn"
        )) {
            if (node.closest(".esi-customizer")
                || node.querySelector(".esi-customizer")
                || node.style.display === "none") { continue; }

            customizer.addDynamic(node);
        }

        customizer.build();
    }
}

FCustomizer.Customizer = class {

    constructor(settingsName, context) {
        this.settingsName = settingsName;
        this.settings = SyncedStorage.get(settingsName);
        this.context = context;
    }

    _textValue(node) {
        const textNode = node.querySelector("h1, h2, .home_title, .home_section_title");
        if (!textNode) { return ""; }
        let str = "";
        for (const node of textNode.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                str += node.textContent.trim();
            }
        }
        return str;
    }

    _setEnabled(name, enabled) {
        this.settings[name] = enabled;
        return SyncedStorage.set(this.settingsName, this.settings);
    }

    _isEnabled(name) {
        const enabled = this.settings[name];
        return (typeof enabled === "undefined") || enabled;
    }

    add(name, targets, text, forceShow = false) {

        let _text = text;
        let elements;

        if (typeof targets === "string") {
            elements = document.querySelectorAll(targets);
        } else if (targets instanceof Element) {
            elements = [targets];
        } else if (targets instanceof NodeList) {
            elements = targets;
        } else {
            return this;
        }

        const enabled = this._isEnabled(name);

        for (const element of elements) {

            if (getComputedStyle(element).display === "none" && !forceShow) {
                continue;
            }

            if (typeof _text !== "string" || _text === "") {
                _text = this._textValue(element).toLowerCase();
                if (_text === "") { continue; }
            }

            element.classList.toggle("esi-shown", enabled);
            element.classList.toggle("esi-hidden", !enabled);
            element.classList.add("esi-customizer");
            element.dataset.esName = name;
            element.dataset.esText = _text;
        }

        return this;
    }

    addDynamic(node) {
        const text = this._textValue(node).toLowerCase();
        if (text === "") { return; }

        this.add(`dynamic_${text}`, node, text);
    }

    build() {

        const customizerEntries = new Map();

        for (const element of document.querySelectorAll(".esi-customizer")) {

            const name = element.dataset.esName;

            if (customizerEntries.has(name)) {
                customizerEntries.get(name).push(element);
            } else {

                const enabled = element.classList.contains("esi-shown");
                const text = element.dataset.esText;

                HTML.beforeEnd("#es_customize_btn .home_viewsettings_popup",
                    `<div class="home_viewsettings_checkboxrow ellipsis" id="${name}">
                        <div class="home_viewsettings_checkbox ${enabled ? "checked" : ""}"></div>
                        <div class="home_viewsettings_label">${text}</div>
                    </div>`);

                customizerEntries.set(name, [element]);
            }
        }

        for (const [name, elements] of customizerEntries) {
            const checkboxrow = document.getElementById(name);
            checkboxrow.addEventListener("click", e => {
                const enabled = !checkboxrow.querySelector(".checked");

                for (const element of elements) {
                    element.classList.toggle("esi-shown", enabled);
                    element.classList.toggle("esi-hidden", !enabled);
                }

                e.target.closest(".home_viewsettings_checkboxrow")
                    .querySelector(".home_viewsettings_checkbox").classList.toggle("checked", enabled);

                this._setEnabled(name, enabled);
            });
        }
    }
};

