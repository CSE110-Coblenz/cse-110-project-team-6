import { MainGameView } from "./MainGameView.ts";
import { Controller, MenuItem, ScreenType } from "../../types.ts";
import type { ScreenSwitch } from "../../types.ts";

export class MainGameController extends Controller {
    private view: MainGameView;

    constructor(screenSwitch: ScreenSwitch) {
        super(screenSwitch);

        this.view = new MainGameView();

        const menuItems = this.view.getMenuItems();
        menuItems.forEach(
            (value, index, array) => {
                const group = value.getGroup();
                switch (value.getItem()) {
                    case MenuItem.Information:
                        group.addEventListener(
                            "click", (e: Event) => { this.handleInformationClick(); }
                        )
                        break;
                    case MenuItem.Settings:
                        group.addEventListener(
                            "click", (e: Event) => { this.handleSettingsClick(); }
                        )
                        break;
                    case MenuItem.Exit:
                        group.addEventListener(
                            "click", (e: Event) => { this.handleExitClick(); }
                        );
                        break;
                    default:
                        throw new TypeError(value.getItem());
                }
            }
        );
    }

    getView(): MainGameView { return this.view; }

    handleInformationClick(): void {
        const screenSwitch = this.getScreenSwitch();
        // TODO: Switch to information screen
    }

    handleSettingsClick(): void {
        const screenSwitch = this.getScreenSwitch();
        screenSwitch.switchScreen({ type: ScreenType.Settings });
    }

    handleExitClick(): void {
        const screenSwitch = this.getScreenSwitch();
        screenSwitch.switchScreen({ type: ScreenType.Title });
    }
}
