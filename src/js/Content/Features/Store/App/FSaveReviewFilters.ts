import Feature from "@Content/Modules/Context/Feature";
import type CApp from "@Content/Features/Store/App/CApp";
import LocalStorage from "@Core/Storage/LocalStorage";
import DOMHelper from "@Content/Modules/DOMHelper";

export default class FSaveReviewFilters extends Feature<CApp> {

    override checkPrerequisites(): boolean {
        return !document.querySelector("#noReviewsWriteOne");
    }

    override async apply(): Promise<void> {

        document.addEventListener("as_filtersChanged", async () => {
            const context = document.querySelector<HTMLInputElement>("input[name=review_context]:checked")?.id;
            const language = document.querySelector<HTMLInputElement>("input[name=review_language]:checked")?.id;
            const minPlaytime = document.querySelector<HTMLInputElement>("#app_reviews_playtime_range_min")?.value;
            const maxPlaytime = document.querySelector<HTMLInputElement>("#app_reviews_playtime_range_max")?.value;

            LocalStorage.set("review_filters", {
                ...((await LocalStorage.get("review_filters")) ?? {}),
                context,
                language,
                ...(minPlaytime && {minPlaytime}),
                ...(maxPlaytime && {maxPlaytime})
            });
        });

        DOMHelper.insertScript("scriptlets/Store/App/saveReviewFilters.js",
            (await LocalStorage.get("review_filters")) ?? {}
        );
    }
}
