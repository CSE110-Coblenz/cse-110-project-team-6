import { TitleView } from "./TitleView.ts";
import { Tooltip } from "../../components.ts";
import { Controller } from "../../types.ts";
import type { ScreenSwitch } from "../../types.ts";

export class TitleController extends Controller {
    private view: TitleView;

    constructor(screenSwitch: ScreenSwitch, tooltip: Tooltip) {
        super(screenSwitch, tooltip);

        this.view = new TitleView();
    }

    getView(): TitleView { return this.view; }
}
