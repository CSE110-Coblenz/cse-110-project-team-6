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

        this.model = new MainGameModel(
            100, this.view.getGrid().nrows(), this.view.getGrid().ncols()
        );
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
                if (this.validateConstructionDialog()) {
                    this.exitConstructionDialog();
                    this.openConstructionOverlay();
                }
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
        this.model.generateTargets();

        const constructionDialog = this.view.getConstructionDialog();
        constructionDialog.setBuildingType(building);

        const details = constructionDialog.getDetails();
        details.setParameters(
            building, this.model.getTargetArea(), this.model.getTargetPerimeter()
        );

        constructionDialog.show();
    }

    clickProjectProposal(e: Konva.KonvaEventObject<MouseEvent>): void {
        const constructionDialog = this.view.getConstructionDialog();
        const proposal = constructionDialog.getProposal();

        const confirm = proposal.getConfirm();
        if (confirm.getGroup().children.includes(e.target)) {
            return;
        }

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

    validateConstructionDialog(): boolean {
        const constructionDialog = this.view.getConstructionDialog();
        const proposal = constructionDialog.getProposal();

        const length = proposal.getLength();
        const width = proposal.getWidth();
        const area = proposal.getArea();
        const perimeter = proposal.getPerimeter();

        let valid: boolean = true;

        // Inputted length must a nonzero positive integer
        length.unfocus();
        if (length.getValue() <= 0) {
            valid = false;
            length.flag();
        } else {
            length.unflag();
        }

        // Inputted width must be a nonzero positive integer
        width.unfocus();
        if (width.getValue() <= 0) {
            valid = false;
            width.flag();
        } else {
            width.unflag();
        }

        // Calculated area must be greater than or equal to target area
        // Calculated area must be less than or equal to available stone
        if (
            area.getValue() < this.model.getTargetArea()
            || area.getValue() > this.model.getStone().get()
        ) {
            valid = false;
            area.flag();
        } else {
            area.unflag();
        }

        // Calculated perimeter must be greater than or equal to target perimeter
        // Calculated perimeter must be less than or equal to available wood
        if (
            perimeter.getValue() < this.model.getTargetPerimeter()
            || perimeter.getValue() > this.model.getWood().get()
        ) {
            valid = false;
            perimeter.flag();
        } else {
            perimeter.unflag();
        }

        if (valid) {
            this.subtractWood(perimeter.getValue());
            this.updateWoodQuantity();

            this.subtractStone(area.getValue());
            this.updateStoneQuantity();

            this.model.incrementScore(
                this.model.scoreInput(area.getValue(), perimeter.getValue())
            );
        }

        return valid;
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
        const cells = this.view.getGrid().getCells();
        const entries = this.model.getGrid().getSlice({ i: i, j: j });
        if (this.model.getGrid().sliceValid(entries)) {
            entries.getEntries().forEach(
                (value) => { cells[value.i]?.[value.j]?.highlight(); }
            );
        } else {
            entries.getEntries().forEach(
                (value) => { cells[value.i]?.[value.j]?.flag(); }
            );
        }
    }

    gridUnhover(i: number, j: number): void {
        const cells = this.view.getGrid().getCells();
        const entries = this.model.getGrid().getSlice({ i: i, j: j });
        entries.getEntries().forEach(
            (value) => { cells[value.i]?.[value.j]?.unhighlight(); }
        );
    }

    gridClick(i: number, j: number): void {
        const cells = this.view.getGrid().getCells();
        const entries = this.model.getGrid().getSlice({ i: i, j: j });
        if (this.model.getGrid().sliceValid(entries)) {
            entries.getEntries().forEach(
                (value) => { cells[value.i]?.[value.j]?.unhighlight(); }
            );

            // TODO: Add building to grid model
            // TODO: Add building to grid veiw
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
