import { WoodMinigameView } from "./WoodMinigameView.ts";
import { Tooltip } from "../../components.ts";
import { Controller } from "../../types.ts";
import type { ScreenSwitch } from "../../types.ts";

export class WoodMinigameController extends Controller {
    private view: WoodMinigameView;

    constructor(screenSwitch: ScreenSwitch, tooltip: Tooltip) {
        super(screenSwitch, tooltip);

        this.view = new WoodMinigameView();
    }

    getView(): WoodMinigameView { return this.view; }
}
