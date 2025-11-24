import { MainGameView } from "./MainGameView.ts";
import { Tooltip } from "../../components.ts";
import {
    BuildingType, Controller, InventoryType, MenuItem, ScreenType
} from "../../types.ts";
import type { ScreenSwitch } from "../../types.ts";

export class MainGameController extends Controller {
    private view: MainGameView;

    constructor(screenSwitch: ScreenSwitch, tooltip: Tooltip) {
        super(screenSwitch, tooltip);

        this.view = new MainGameView();

        const menuItems = this.view.getMenuBar().getIcons();
        menuItems.forEach(
            (value, index, array) => {
                const group = value.getGroup();
                switch (value.getItem()) {
                    case MenuItem.Information:
                        group.addEventListener(
                            "click", (e: Event) => { this.openInformation(); }
                        )
                        break;
                    case MenuItem.Settings:
                        group.addEventListener(
                            "click", (e: Event) => { this.openSettings(); }
                        )
                        break;
                    case MenuItem.Exit:
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
                const group = value.getGroup();
                group.addEventListener(
                    "mouseover", (e: Event) => { this.tooltip.show(value.getType()); }
                );
                group.addEventListener(
                    "mouseout", (e: Event) => { this.tooltip.hide(); }
                );
                group.addEventListener(
                    "mousemove", (e: Event) => { this.tooltip.move(); }
                );

                const iconPlus = value.getIconPlus();
                const groupPlus = iconPlus.getGroup();
                switch (value.getType()) {
                    case InventoryType.Stone:
                        groupPlus.addEventListener(
                            "click", (e: Event) => { this.enterStoneMiniGame(); }
                        );
                        break;
                    case InventoryType.Wood:
                        groupPlus.addEventListener(
                            "click", (e: Event) => { this.enterWoodMiniGame(); }
                        );
                        break;
                    default:
                        throw new TypeError(value.getType());
                }
            }
        );

        const buildingItems = this.view.getBuildings();
        buildingItems.forEach(
            (value, index, array) => {
                const group = value.getGroup();
                group.addEventListener(
                    "mouseover", (e: Event) => { this.tooltip.show(value.getType()); }
                );
                group.addEventListener(
                    "mouseout", (e: Event) => { this.tooltip.hide(); }
                );
                group.addEventListener(
                    "mousemove", (e: Event) => { this.tooltip.move(); }
                );
                group.addEventListener(
                    "click", (e: Event) => {
                        this.enterConstructionDialog(value.getType());
                    }
                );
            }
        );

        const constructionDialog = this.view.getConstructionDialog();
        const projectProposal = constructionDialog.getProposal();
        const buttonCancel = projectProposal.getCancel();
        buttonCancel.getGroup().addEventListener(
            "click", () => { this.exitConstructionDialog(); }
        );
        const buttonConfirm = projectProposal.getConfirm();
        buttonConfirm.getGroup().addEventListener(
            "click", () => { this.openConstructionOverlay(); }
        )
    }

    getView(): MainGameView { return this.view; }

    openInformation(): void {
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

    enterConstructionDialog(building: BuildingType): void {
        const constructionDialog = this.view.getConstructionDialog();
        constructionDialog.setBuildingType(building);
        constructionDialog.show();
    }

    exitConstructionDialog(): void {
        const constructionDialog = this.view.getConstructionDialog();
        constructionDialog.hide();
    }

    openConstructionOverlay(): void {
        const constructionDialog = this.view.getConstructionDialog();
        constructionDialog.hide();

        // TODO: Hide inventory
        // TODO: Hide buildings
        // TODO: Show overlay
    }

    closeConstructionOverlay(): void {
        // TODO: Hide overlay
        // TODO: Show inventory
        // TODO: Show buildings
    }
}
