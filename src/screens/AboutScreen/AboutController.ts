import { AboutView } from "./AboutView.ts";
import { Tooltip } from "../../components.ts";
import { Controller } from "../../types.ts";
import type { ScreenSwitch } from "../../types.ts";

export class AboutController extends Controller {
    private view: AboutView;

    constructor(screenSwitch: ScreenSwitch, tooltip: Tooltip) {
        super(screenSwitch, tooltip);

        this.view = new AboutView();
    }

    getView(): AboutView { return this.view; }
}
