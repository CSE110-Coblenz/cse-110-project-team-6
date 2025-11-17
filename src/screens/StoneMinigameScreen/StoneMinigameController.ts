import { StoneMinigameView } from "./StoneMinigameView.ts";
import { Tooltip } from "../../components.ts";
import { Controller } from "../../types.ts";
import type { ScreenSwitch } from "../../types.ts";

export class StoneMinigameController extends Controller {
    private view: StoneMinigameView;

    constructor(screenSwitch: ScreenSwitch, tooltip: Tooltip) {
        super(screenSwitch, tooltip);

        this.view = new StoneMinigameView();
    }

    getView(): StoneMinigameView { return this.view; }
}
