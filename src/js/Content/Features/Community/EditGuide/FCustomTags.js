import {__addTag, __customTags, __enterTag} from "../../../../../localization/compiled/_strings";
import {L} from "../../../../Core/Localization/Localization";
import {HTML, LocalStorage} from "../../../../modulesCore";
import {Feature, Messenger} from "../../../modulesContent";
import {Page} from "../../Page";

export default class FCustomTags extends Feature {

    apply() {
        this._addTags();
        this._rememberTags();
    }

    _addTags() {

        const langSection = document.querySelector("#checkboxgroup_1");
        if (!langSection) { return; }

        Messenger.addMessageListener("addtag", name => {
            this._addTag(name, true);
        });

        HTML.afterEnd(langSection,
            `<div class="tag_category_container" id="checkboxgroup_2">
                <div class="tag_category_desc">${L(__customTags)}</div>
                <div><a style="margin-top: 8px;" class="btn_blue_white_innerfade btn_small_thin" id="es_add_tag">
                    <span>${L(__addTag)}</span>
                </a></div>
            </div>`);

        Page.runInPageContext((customTags, enterTag) => {
            const jq = window.SteamFacade.jq;
            jq("#es_add_tag").on("click", () => {
                const modal = window.SteamFacade.showConfirmDialog(customTags,
                    `<div class="commentthread_entry_quotebox">
                        <textarea placeholder="${enterTag}" class="commentthread_textarea es_tag" rows="1"></textarea>
                    </div>`);

                const elem = jq(".es_tag");
                let tag = elem.val();

                function done() {
                    if (tag.trim().length === 0) { return; }
                    tag = tag[0].toUpperCase() + tag.slice(1);
                    window.Messenger.postMessage("addtag", tag);
                }

                elem.on("keydown paste input", e => {
                    tag = elem.val();
                    if (e.key === "Enter") {
                        modal.Dismiss(); // eslint-disable-line new-cap
                        done();
                    }
                });

                modal.done(done);
            });
        }, [L(__customTags), L(__enterTag)]);
    }

    _rememberTags() {

        const submitBtn = document.querySelector("[href*=SubmitGuide]");
        if (!submitBtn) { return; }

        const params = new URLSearchParams(window.location.search);
        const curId = params.get("id") || "recent";
        const savedTags = LocalStorage.get("es_guide_tags");
        if (!savedTags[curId]) {
            savedTags[curId] = savedTags.recent || [];
        }

        for (const id in savedTags) {
            for (const tag of savedTags[id]) {
                const node = document.querySelector(`[name="tags[]"][value="${tag.replace(/"/g, '\\"')}"]`);
                if (node && curId === id) {
                    node.checked = true;
                } else if (!node) {
                    this._addTag(tag, curId === id);
                }
            }
        }

        submitBtn.removeAttribute("href");
        submitBtn.addEventListener("click", () => {
            savedTags.recent = [];
            savedTags[curId] = Array.from(document.querySelectorAll("[name='tags[]']:checked")).map(node => node.value);
            LocalStorage.set("es_guide_tags", savedTags);
            Page.runInPageContext(() => { window.SteamFacade.submitGuide(); });
        });
    }

    _addTag(name, checked = true) {
        const _name = HTML.escape(name);
        const attr = checked ? " checked" : "";
        const tag = `<div><input type="checkbox" name="tags[]" value="${_name}" class="inputTagsFilter"${attr}>${_name}</div>`;
        HTML.beforeBegin("#es_add_tag", tag);
    }
}
