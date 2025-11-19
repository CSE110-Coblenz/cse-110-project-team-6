import { AboutView } from "./AboutView.ts";
import { Controller } from "../../types.ts";
import type { ScreenSwitch } from "../../types.ts";

export class AboutController extends Controller {
    private view: AboutView;

    constructor(screenSwitch: ScreenSwitch) {
        super(screenSwitch);

        this.view = new AboutView();
        
        // Bind click event to close button
        this.view.getCloseGroup().on("click tap", () => {
            this.hide();
        });
    }

    getView(): AboutView { return this.view; }
}
