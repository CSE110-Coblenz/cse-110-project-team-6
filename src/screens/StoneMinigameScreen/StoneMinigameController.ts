import { StoneMinigameView } from "./StoneMinigameView.ts";
import { Controller } from "../../types.ts";
import type { ScreenSwitch } from "../../types.ts";

export class StoneMinigameController extends Controller {
    private view: StoneMinigameView;

    constructor(screenSwitch: ScreenSwitch) {
        super(screenSwitch);

        this.view = new StoneMinigameView();
    }

    getView(): StoneMinigameView { return this.view; }
}
