/**
 * @contentScript
 * @match *://steamcommunity.com/(id|profiles)/*\/inventory
 */

import CommunityPage from "../../CommunityPage";
import CInventory from "./CInventory";

(new CommunityPage()).run(() => new CInventory());
