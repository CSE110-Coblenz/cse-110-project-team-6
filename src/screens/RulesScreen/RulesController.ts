import { RulesView } from "./RulesView.ts";
import { Controller, ScreenType } from "../../types.ts";
import type { ScreenSwitch, Screen } from "../../types.ts";

export class RulesController extends Controller {
    private view: RulesView;
  
    constructor(screenSwitch: ScreenSwitch) {
      super(screenSwitch);
      this.view = new RulesView();
      this.setupButtonHandlers();
    }
  
    getView(): RulesView {
      return this.view;
    }

    private setupButtonHandlers(): void {
      // Set up cursor change on hover
      this.view.backBtn.on("mouseenter", () => {
        document.body.style.cursor = "pointer";
      });
      this.view.backBtn.on("mouseleave", () => {
        document.body.style.cursor = "default";
      });

      // Set up back button click handler
      this.view.backBtn.on("click", () => {
        const previousScreen = this.screenSwitch.getPreviousScreen();
        // If there's a previous screen, go back to it; otherwise go to Title
        const targetScreen: Screen = previousScreen || { type: ScreenType.Title };
        this.screenSwitch.switchScreen(targetScreen);
      });

      // Also handle tap events for mobile devices
      this.view.backBtn.on("tap", () => {
        const previousScreen = this.screenSwitch.getPreviousScreen();
        const targetScreen: Screen = previousScreen || { type: ScreenType.Title };
        this.screenSwitch.switchScreen(targetScreen);
      });
    }
  }
