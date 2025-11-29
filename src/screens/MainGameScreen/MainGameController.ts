import Konva from "konva";

import { MainGameModel } from "./MainGameModel.ts";
import { MainGameView } from "./MainGameView.ts";
import { Tooltip } from "../../components.ts";
import { BuildingType, Controller, MenuItem, ScreenType } from "../../types.ts";
import type { ScreenSwitch } from "../../types.ts";

export class MainGameController extends Controller {
    private tooltip: Tooltip;

    private view: MainGameView;
    private model: MainGameModel;

    constructor(screenSwitch: ScreenSwitch) {
        super(screenSwitch);

        const stage = this.screenSwitch.getStage();
        const container = stage.container();

        this.tooltip = new Tooltip(stage);
        this.view = new MainGameView(this.tooltip);

        this.model = new MainGameModel(100);
        this.updateWoodQuantity();
        this.updateStoneQuantity();

        const menuItems = this.view.getMenuBar().getIcons();
        menuItems.forEach(
            (value) => {
                const group = value.getGroup();
                switch (value.getItem()) {
                    case MenuItem.Information:
                        group.on("click", () => { this.openInformation(); });
                        break;
                    case MenuItem.Settings:
                        group.on("click", () => { this.openSettings(); });
                        break;
                    case MenuItem.Exit:
                        group.on("click", () => { this.exitMainGame(); });
                        break;
                    default:
                        throw new TypeError(value.getItem());
                }
            }
        );

        const inventoryWood = this.view.getInventoryWood();
        this.tooltip.bindListeners(inventoryWood.getGroup(), inventoryWood.getType());
        inventoryWood.getIconPlus().getGroup().on("click", () => { this.enterWoodMiniGame(); });

        const inventoryStone = this.view.getInventoryStone();
        this.tooltip.bindListeners(inventoryStone.getGroup(), inventoryStone.getType());
        inventoryStone.getIconPlus().getGroup().on("click", () => { this.enterStoneMiniGame(); });

        const buildingItems = this.view.getBuildings();
        buildingItems.forEach(
            (value) => {
                this.tooltip.bindListeners(value.getGroup(), value.getType());
                value.getGroup().on(
                    "click", () => { this.enterConstructionDialog(value.getType()); }
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
        // this.screenSwitch.switchScreen({ type: ScreenType.WoodMinigame });
        this.addWood(50);
    }

    updateWoodQuantity(): void {
        this.view.getInventoryWood().setQuantity(this.model.getWood().get());
    }

    addWood(quantity: number): void {
        this.model.getWood().add(quantity);
        this.updateWoodQuantity();
    }

    subtractWood(quantity: number): boolean {
        const success = this.model.getWood().subtract(quantity);
        this.updateWoodQuantity();
        return success;
    }

    enterStoneMiniGame(): void {
        // this.screenSwitch.switchScreen({ type: ScreenType.StoneMinigame });
        this.addStone(50);
    }

    updateStoneQuantity(): void {
        this.view.getInventoryStone().setQuantity(this.model.getStone().get());
    }

    addStone(quantity: number): void {
        this.model.getStone().add(quantity);
        this.updateStoneQuantity();
    }

    subtractStone(quantity: number): boolean {
        const success = this.model.getStone().subtract(quantity);
        this.updateStoneQuantity();
        return success;
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
        this.view.getInventoryWood().getGroup().hide();
        this.view.getInventoryStone().getGroup().hide();

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
        this.view.getInventoryWood().getGroup().show();
        this.view.getInventoryStone().getGroup().show();

        // Show buildings
        this.view.getBuildings().forEach(
            (value) => { value.getGroup().show(); }
        )
    }
}
