/**
 * @contentScript
 * @match *://*.steampowered.com/app/*
 */

import {StorePage} from "../../StorePage";
import {CApp} from "./CApp";

(new StorePage()).run(CApp);
