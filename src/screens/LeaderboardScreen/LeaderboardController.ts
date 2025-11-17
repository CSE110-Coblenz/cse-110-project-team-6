import { LeaderboardView } from "./LeaderboardView.ts";
import { Color } from "../../types.ts";
import { Controller } from "../../types.ts";
import type { ScreenSwitch } from "../../types.ts";
import { ScreenType } from "../../types.ts";
import type { LeaderboardEntry } from "../../types.ts";

export class LeaderboardController extends Controller {
    private view: LeaderboardView;

    constructor(screenSwitch: ScreenSwitch) {
        super(screenSwitch);

        this.view = new LeaderboardView();

        this.attachEventHandlers();
    }

    getView(): LeaderboardView { return this.view; }

    private attachEventHandlers(): void {

        // Mouse Hover IN effect
        this.view.backButton.on("mouseenter", () => {
            this.view.backButtonRect.fill(Color.LightBlue);
            this.view.backButton.getLayer()?.draw();
        });

        // Mouse Hover OUT effect
        this.view.backButton.on("mouseleave", () => {
            this.view.backButtonRect.fill(Color.GreyBlue);
            this.view.backButton.getLayer()?.draw();
        });

        // Click event to go back to Title screen
        this.view.backButton.on("click", () => {
            this.screenSwitch.switchScreen({ type: ScreenType.Title });
        });
    }   

    public showLeaderboard(entries: LeaderboardEntry[]) : void {
        this.view.setEntries(entries);
    }
}
