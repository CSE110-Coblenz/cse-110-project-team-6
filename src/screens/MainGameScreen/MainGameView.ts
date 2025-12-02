import Konva from "konva";

import { Container, MenuBar, Tooltip } from "../../components.ts";
import { NAME, ICON_SIZE } from "../../constants.ts";
import { Building, BuildingMenu } from "./Buildings.ts";
import { ConstructionDialog } from "./Construction.ts";
import { Grid } from "./Grid.ts";
import { Inventory, InventoryItem } from "./Inventory.ts";
import { Color, MenuItem, View } from "../../types.ts";

export class MainGameView extends View {
    private tooltip: Tooltip;

    private title: TitleContainer;
    private inventory: Inventory;
    private grid: Grid;
    private buildingMenu: BuildingMenu;
    private constructionDialog: ConstructionDialog;

    constructor(tooltip: Tooltip) {
        super();

        this.tooltip = tooltip;
        this.group.add(this.tooltip.getLabel());

        this.title = new TitleContainer(
            this.group.x(),
            this.group.y(),
            this.group.width(),
            this.group.height() * 0.2
        );
        this.group.add(this.title.getGroup());

        this.inventory = new Inventory(
            this.group.x(),
            this.group.y() + this.group.height() * 0.2,
            this.group.width() * 0.2,
            this.group.height() * 0.8
        );
        this.group.add(this.inventory.getGroup());

        this.grid = new Grid(
            this.group.x() + this.group.width() * 0.2,
            this.group.y() + this.group.height() * 0.2,
            this.group.width() * 0.6,
            this.group.height() * 0.8
        );
        this.group.add(this.grid.getGroup());

        this.buildingMenu = new BuildingMenu(
            this.group.x() + this.group.width() * 0.8,
            this.group.y() + this.group.height() * 0.2,
            this.group.width() * 0.2,
            this.group.height() * 0.8
        );
        this.group.add(this.buildingMenu.getGroup());

        this.constructionDialog = new ConstructionDialog(
            this.group.x() + this.group.width() * 0.2,
            this.group.y() + this.group.height() * 0.2,
            this.group.width() * 0.6,
            this.group.height() * 0.8
        );
        this.group.add(this.constructionDialog.getGroup());
    }

    getMenuBar(): MenuBar { return this.title.getMenuBar(); }
    getGrid(): Grid { return this.grid; }
    getInventoryWood(): InventoryItem { return this.inventory.getWood(); }
    getInventoryStone(): InventoryItem { return this.inventory.getStone(); }
    getBuildings(): Building[] { return this.buildingMenu.getBuildings(); }
    getConstructionDialog(): ConstructionDialog { return this.constructionDialog; }
}

class TitleContainer extends Container {
    private text: Konva.Text;
    private menuBar: MenuBar;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        this.container.stroke(Color.Black);

        this.text = new Konva.Text({ fontSize: 48, text: NAME });
        this.text.x(this.group.width() / 2 - this.text.width() / 2);
        this.text.y(this.group.height() / 2 - this.text.height() / 2);
        this.group.add(this.text);

        this.menuBar = new MenuBar(this.group.width() - Object.keys(MenuItem).length * ICON_SIZE, 0);
        this.group.add(this.menuBar.getGroup());
    }

    getMenuBar(): MenuBar { return this.menuBar; }
}
