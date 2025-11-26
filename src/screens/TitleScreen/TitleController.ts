import { TitleView } from "./TitleView.ts";
import { Controller } from "../../types.ts";
import type { ScreenSwitch } from "../../types.ts";

export class TitleController extends Controller {
    private view: TitleView;

    constructor(screenSwitch: ScreenSwitch) {
        super(screenSwitch);

        this.view = new TitleView();
    }

    getView(): TitleView { return this.view; }
}
