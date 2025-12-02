import { TitleView } from "./TitleView.ts";
import { Controller } from "../../types.ts";
import type { ScreenSwitch } from "../../types.ts";
import { ScreenType } from "../../types.ts";

export class TitleController extends Controller {
    private view: TitleView;

    constructor(screenSwitch: ScreenSwitch) {
        super(screenSwitch);

        this.view = new TitleView();

        // Bind click event to About button using callback to handle async loading
        this.view.setOnAboutButtonReady((button) => {
            button.on("click tap", () => {
                this.screenSwitch.switchScreen({ type: ScreenType.About });
            });
        });
    }

    getView(): TitleView { return this.view; }
}
