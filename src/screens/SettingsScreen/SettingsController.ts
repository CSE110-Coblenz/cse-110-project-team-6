import { SettingsView } from "./SettingsView.ts";
import { Controller } from "../../types.ts";
import type { ScreenSwitch } from "../../types.ts";

export class SettingsController extends Controller {
    private view: SettingsView;

    constructor(screenSwitch: ScreenSwitch) {
        super(screenSwitch);

        this.view = new SettingsView();
    }

    getView(): SettingsView { return this.view; }
}
