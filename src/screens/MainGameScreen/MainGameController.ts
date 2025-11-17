import { MainGameView } from "./MainGameView.ts";
import { Controller, InventoryItemType, MenuItemType, ScreenType } from "../../types.ts";
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
                    case MenuItemType.Information:
                        group.addEventListener(
                            "click", (e: Event) => { this.handleInformationClick(); }
                        )
                        break;
                    case MenuItemType.Settings:
                        group.addEventListener(
                            "click", (e: Event) => { this.handleSettingsClick(); }
                        )
                        break;
                    case MenuItemType.Exit:
                        group.addEventListener(
                            "click", (e: Event) => { this.handleExitClick(); }
                        );
                        break;
                    default:
                        throw new TypeError(value.getItem());
                }
            }
        );

        const inventoryItems = this.view.getInventoryItems();
        inventoryItems.forEach(
            (value, index, array) => {
                const iconPlus = value.getIconPlus();
                const group = iconPlus.getGroup();
                switch (value.getType()) {
                    case InventoryItemType.Stone:
                        group.addEventListener(
                            "click", (e: Event) => { this.handleAddStoneClick(); }
                        );
                        break;
                    case InventoryItemType.Wood:
                        group.addEventListener(
                            "click", (e: Event) => { this.handleAddWoodClick(); }
                        );
                        break;
                    default:
                        throw new TypeError(value.getType());
                }
            }
        );
    }

    getView(): MainGameView { return this.view; }

    handleInformationClick(): void {
        // TODO: Switch to information screen
    }

    handleSettingsClick(): void {
        this.screenSwitch.switchScreen({ type: ScreenType.Settings });
    }

    handleExitClick(): void {
        this.screenSwitch.switchScreen({ type: ScreenType.Title });
    }

    handleAddWoodClick(): void {
        this.screenSwitch.switchScreen({ type: ScreenType.WoodMinigame });
    }

    handleAddStoneClick(): void {
        this.screenSwitch.switchScreen({ type: ScreenType.StoneMinigame });
    }
}
