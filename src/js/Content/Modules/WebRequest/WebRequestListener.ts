import Background from "@Core/Background";
import {EAction} from "@Background/EAction";
import browser from "webextension-polyfill";

export default class WebRequestListener {

    static async onComplete(urls: string[], callback: (url: string) => void): Promise<void> {
        await Background.send<number>(EAction.Listener_Register, {urls});

        browser.runtime.onMessage.addListener((message: any) => {
            if (message.url) {
                callback(message.url);
            }
        });
    }
}
