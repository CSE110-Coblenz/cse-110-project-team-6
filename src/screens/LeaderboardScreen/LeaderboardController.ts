import { LeaderboardView } from "./LeaderboardView.ts";
import { Tooltip } from "../../components.ts";
import { Controller } from "../../types.ts";
import type { ScreenSwitch } from "../../types.ts";

export class LeaderboardController extends Controller {
    private view: LeaderboardView;

    constructor(screenSwitch: ScreenSwitch, tooltip: Tooltip) {
        super(screenSwitch, tooltip);

        this.view = new LeaderboardView();
    }

    getView(): LeaderboardView { return this.view; }
}
