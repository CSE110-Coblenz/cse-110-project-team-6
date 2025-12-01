import { RulesView } from "./RulesView.ts";
import { Controller, ScreenType } from "../../types.ts";
import type { ScreenSwitch } from "../../types.ts";

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
        this.screenSwitch.switchScreen({ type: ScreenType.Title });
      });

      // Also handle tap events for mobile devices
      this.view.backBtn.on("tap", () => {
        this.screenSwitch.switchScreen({ type: ScreenType.Title });
      });
    }
  }