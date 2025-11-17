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
                            "click", (e: Event) => { this.openSettings(); }
                        )
                        break;
                    case MenuItemType.Exit:
                        group.addEventListener(
                            "click", (e: Event) => { this.exitMainGame(); }
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
                            "click", (e: Event) => { this.enterStoneMiniGame(); }
                        );
                        break;
                    case InventoryItemType.Wood:
                        group.addEventListener(
                            "click", (e: Event) => { this.enterWoodMiniGame(); }
                        );
                        break;
                    default:
                        throw new TypeError(value.getType());
                }
            }
        );

        const buildingItems = this.view.getBuildingItems();
        buildingItems.forEach(
            (value, index, array) => {
                const group = value.getGroup();
                group.addEventListener(
                    "click", (e: Event) => { this.enterConstructionDialog(); }
                );
            }
        );

        const constructionDialog = this.view.getConstructionDialog();
        constructionDialog.getIconCancel().getGroup().addEventListener(
            "click", (e: Event) => { this.exitConstructionDialog(); }
        )
    }

    getView(): MainGameView { return this.view; }

    handleInformationClick(): void {
        // TODO: Switch to information screen
    }

    openSettings(): void {
        this.screenSwitch.switchScreen({ type: ScreenType.Settings });
    }

    exitMainGame(): void {
        this.screenSwitch.switchScreen({ type: ScreenType.Title });
    }

    enterWoodMiniGame(): void {
        this.screenSwitch.switchScreen({ type: ScreenType.WoodMinigame });
    }

    enterStoneMiniGame(): void {
        this.screenSwitch.switchScreen({ type: ScreenType.StoneMinigame });
    }

    enterConstructionDialog(): void {
        const constructionDialog = this.view.getConstructionDialog();
        constructionDialog.show();
    }

    exitConstructionDialog(): void {
        const constructionDialog = this.view.getConstructionDialog();
        constructionDialog.hide();
    }
}
