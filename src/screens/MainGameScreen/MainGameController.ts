import { MainGameView } from "./MainGameView.ts";
import { Controller } from "../../types.ts";
import type { ScreenSwitch } from "../../types.ts";

export class MainGameController extends Controller {
    private view: MainGameView;

    constructor(screenSwitch: ScreenSwitch) {
        super(screenSwitch);

        this.view = new MainGameView();
    }

    getView(): MainGameView { return this.view; }
}
