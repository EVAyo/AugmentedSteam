import {__inviteToGroup} from "../../../../../localization/compiled/_strings";
import {L} from "../../../../Core/Localization/Localization";
import {HTML} from "../../../../modulesCore";
import {CallbackFeature} from "../../../modulesContent";
import {Page} from "../../Page";

export default class FInviteButton extends CallbackFeature {

    checkPrerequisites() {
        return this.context.myProfile;
    }

    setup() {
        this.callback();
    }

    callback() {
        if (!document.getElementById("friends_list")) { return; }

        HTML.beforeEnd(".manage_friend_actions_ctn",
            `<span class="manage_action btnv6_lightblue_blue btn_small" id="es_invite_to_group">
                <span>${L(__inviteToGroup)}</span>
            </span>`);

        const params = new URLSearchParams(window.location.search);

        if (params.has("invitegid")) {
            // Invite initiated from group homepage
            Page.runInPageContext(groupId => {
                const f = window.SteamFacade;
                f.toggleManageFriends();
                f.jqOnClick("#es_invite_to_group", () => {
                    const friends = f.getCheckedAccounts("#search_results > .selectable.selected:visible");
                    f.inviteUserToGroup(null, groupId, friends);
                });
            }, [params.get("invitegid")]);
        } else {
            document.getElementById("es_invite_to_group").addEventListener("click", () => {
                Page.runInPageContext(() => { window.SteamFacade.execFriendAction("group_invite", "friends/all"); });
            });
        }
    }
}
