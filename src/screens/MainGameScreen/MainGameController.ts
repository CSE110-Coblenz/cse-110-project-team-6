import { MainGameView } from "./MainGameView.ts";
import { Tooltip } from "../../components.ts";
import {
    BuildingType, Controller, InventoryType, MenuItem, ScreenType
} from "../../types.ts";
import type { ScreenSwitch } from "../../types.ts";

export class MainGameController extends Controller {
    private tooltip: Tooltip;

    private view: MainGameView;

    constructor(screenSwitch: ScreenSwitch) {
        super(screenSwitch);

        const stage = this.screenSwitch.getStage();

        this.tooltip = new Tooltip(stage);
        this.view = new MainGameView(this.tooltip);

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
        const inputLength = projectProposal.getLength();
        const inputWidth = projectProposal.getWidth();
        inputLength.getGroup().addEventListener(
            "click", () => {
                if (inputLength.isFocused()) {
                    inputLength.unfocus();
                } else {
                    inputLength.focus();
                }
                inputWidth.unfocus();
            }
        );
        inputWidth.getGroup().addEventListener(
            "click", () => {
                inputLength.unfocus();
                if (inputWidth.isFocused()) {
                    inputWidth.unfocus();
                } else {
                    inputWidth.focus();
                }
            }
        );
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
        // Hide construction dialog
        const constructionDialog = this.view.getConstructionDialog();
        constructionDialog.hide();

        // Hide inventory
        this.view.getInventoryItems().forEach(
            (value) => { value.getGroup().hide(); }
        );

        // Hide buildings
        this.view.getBuildings().forEach(
            (value) => { value.getGroup().hide(); }
        )

        // Show overlay
        const grid = this.view.getGrid();
        Array(...grid.getCells()).forEach(
            (row, i) => {
                Array(...row).forEach(
                    (cell, j) => {
                        cell.getGroup().addEventListener(
                            "mouseover", () => { this.gridHover(i, j); }
                        );
                        cell.getGroup().addEventListener(
                            "mouseout", () => { this.gridUnhover(i, j); }
                        );
                        cell.getGroup().addEventListener(
                            "click", () => { this.gridClick(i, j); }
                        );
                    }
                );
            }
        );
    }

    gridHover(i: number, j: number): void {
        const grid = this.view.getGrid();
        const cells = grid.getNeighbors(i, j);
        if (cells.includes(undefined)) {
            cells.forEach(
                (cell) => { cell?.flag(); }
            );
        } else {
            cells.forEach(
                (cell) => { cell?.highlight(); }
            );
        }
    }

    gridUnhover(i: number, j: number): void {
        const grid = this.view.getGrid();
        grid.getNeighbors(i, j).forEach(
            (cell) => { cell?.unhighlight(); }
        );
    }

    gridClick(i: number, j: number): void {
        const grid = this.view.getGrid();
        const cells = grid.getNeighbors(i, j);
        if (!cells.includes(undefined)) {
            grid.getNeighbors(i, j).forEach(
                (cell) => { cell?.unhighlight(); }
            );

            this.closeConstructionOverlay();
        }
    }

    closeConstructionOverlay(): void {
        // Hide overlay
        const grid = this.view.getGrid();
        Array(...grid.getCells()).forEach(
            (row) => {
                Array(...row).forEach(
                    (cell) => {
                        cell.getGroup().removeEventListener("mouseover");
                        cell.getGroup().removeEventListener("mouseout");
                        cell.getGroup().removeEventListener("click");
                    }
                );
            }
        );

        // Show inventory
        this.view.getInventoryItems().forEach(
            (value) => { value.getGroup().show(); }
        );

        // Show buildings
        this.view.getBuildings().forEach(
            (value) => { value.getGroup().show(); }
        )
    }
}
