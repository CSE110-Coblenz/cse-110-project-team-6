import Konva from "konva";

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
        const container = stage.container();

        this.tooltip = new Tooltip(stage);
        this.view = new MainGameView(this.tooltip);

        const menuItems = this.view.getMenuBar().getIcons();
        menuItems.forEach(
            (value) => {
                const group = value.getGroup();
                switch (value.getItem()) {
                    case MenuItem.Information:
                        group.on(
                            "click", () => { this.openInformation(); }
                        )
                        break;
                    case MenuItem.Settings:
                        group.on(
                            "click", () => { this.openSettings(); }
                        )
                        break;
                    case MenuItem.Exit:
                        group.on(
                            "click", () => { this.exitMainGame(); }
                        );
                        break;
                    default:
                        throw new TypeError(value.getItem());
                }
            }
        );

        const inventoryItems = this.view.getInventoryItems();
        inventoryItems.forEach(
            (value) => {
                const group = value.getGroup();
                group.on(
                    "mouseover", () => { this.tooltip.show(value.getType()); }
                );
                group.on(
                    "mouseout", () => { this.tooltip.hide(); }
                );
                group.on(
                    "mousemove", () => { this.tooltip.move(); }
                );

                const iconPlus = value.getIconPlus();
                const groupPlus = iconPlus.getGroup();
                switch (value.getType()) {
                    case InventoryType.Stone:
                        groupPlus.on(
                            "click", () => { this.enterStoneMiniGame(); }
                        );
                        break;
                    case InventoryType.Wood:
                        groupPlus.on(
                            "click", () => { this.enterWoodMiniGame(); }
                        );
                        break;
                    default:
                        throw new TypeError(value.getType());
                }
            }
        );

        const buildingItems = this.view.getBuildings();
        buildingItems.forEach(
            (value) => {
                const group = value.getGroup();
                group.on(
                    "mouseover", () => { this.tooltip.show(value.getType()); }
                );
                group.on(
                    "mouseout", () => { this.tooltip.hide(); }
                );
                group.on(
                    "mousemove", () => { this.tooltip.move(); }
                );
                group.on(
                    "click", () => {
                        this.enterConstructionDialog(value.getType());
                    }
                );
            }
        );

        const constructionDialog = this.view.getConstructionDialog();
        const proposal = constructionDialog.getProposal();
        proposal.getGroup().on(
            "click", (e: Konva.KonvaEventObject<MouseEvent>) => {
                this.clickProjectProposal(e);
            }
        );

        // Construction dialog length/width numeric inputs
        const length = proposal.getLength();
        const width = proposal.getWidth();
        length.bindListeners(container);
        width.bindListeners(container);
        container.addEventListener(
            "keydown", () => {
                proposal.updateArea();
                proposal.updatePerimeter();
            }
        );

        // Consturction dialog cancel button
        const cancel = proposal.getCancel();
        cancel.getGroup().addEventListener(
            "click", () => { this.exitConstructionDialog(); }
        );

        // Construction dialog confirm button
        const confirm = proposal.getConfirm();
        confirm.getGroup().addEventListener(
            "click", () => {
                this.exitConstructionDialog();
                this.openConstructionOverlay();
            }
        );
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
        constructionDialog.updateBuildingType(building);
        constructionDialog.show();
    }

    clickProjectProposal(e: Konva.KonvaEventObject<MouseEvent>): void {
        const constructionDialog = this.view.getConstructionDialog();
        const proposal = constructionDialog.getProposal();
        const length = proposal.getLength();
        const width = proposal.getWidth();

        if (!length.getGroup().children.includes(e.target)) {
            length.unfocus();
        }
        if (!width.getGroup().children.includes(e.target)) {
            width.unfocus();
        }
    }

    exitConstructionDialog(): void {
        const constructionDialog = this.view.getConstructionDialog();
        const proposal = constructionDialog.getProposal();
        const length = proposal.getLength();
        const width = proposal.getWidth();

        length.clear();
        width.clear();

        proposal.updateArea();
        proposal.updatePerimeter();

        constructionDialog.hide();
    }

    openConstructionOverlay(): void {
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
