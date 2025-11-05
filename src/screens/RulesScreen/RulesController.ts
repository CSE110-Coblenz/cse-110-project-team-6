import { RulesView } from "./RulesView.ts";
import { Controller, ScreenType } from "../../types.ts";
import type { ScreenSwitch } from "../../types.ts";

export class RulesController extends Controller {
    private view: RulesView;
  
    constructor(screenSwitch: ScreenSwitch) {
      super(screenSwitch);
      this.view = new RulesView();
    }
  
    getView(): RulesView {
      return this.view;
    }
  }
