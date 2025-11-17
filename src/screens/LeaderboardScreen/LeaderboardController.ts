import { LeaderboardView } from "./LeaderboardView.ts";
import { Controller } from "../../types.ts";
import type { ScreenSwitch } from "../../types.ts";
import type{ LeaderboardEntry } from "../../types.ts";

export class LeaderboardController extends Controller {
    private view: LeaderboardView;

    constructor(screenSwitch: ScreenSwitch) {
        super(screenSwitch);

        this.view = new LeaderboardView(screenSwitch);
    }

    getView(): LeaderboardView { return this.view; }

    public showLeaderboard(entries: LeaderboardEntry[]) : void {
        this.view.setEntries(entries);
    }
}
