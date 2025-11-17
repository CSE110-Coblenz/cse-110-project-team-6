import Konva from "konva";

import { Container, Icon } from "../../components.ts";
import { NAME, CELL_WIDTH, CELL_HEIGHT, ICON_SIZE } from "../../constants.ts";
import type { Point } from "../../types.ts";
import {
    BuildingType, Color, InventoryItemType, MenuItemType, View
} from "../../types.ts";

export class MainGameView extends View {
    private titleContainer: TitleContainer;
    private inventoryContainer: InventoryContainer;
    private gridContainer: GridContainer;
    private buildingsContainer: BuildingsContainer;
    private constructionDialog: ConstructionDialog;

    constructor() {
        super();

        this.titleContainer = new TitleContainer(
            this.group.x(),
            this.group.y(),
            this.group.width(),
            this.group.height() * 0.2
        );
        this.inventoryContainer = new InventoryContainer(
            this.group.x(),
            this.group.y() + this.group.height() * 0.2,
            this.group.width() * 0.2,
            this.group.height() * 0.8
        );
        this.gridContainer = new GridContainer(
            this.group.x() + this.group.width() * 0.2,
            this.group.y() + this.group.height() * 0.2,
            this.group.width() * 0.6,
            this.group.height() * 0.8
        );
        this.buildingsContainer = new BuildingsContainer(
            this.group.x() + this.group.width() * 0.8,
            this.group.y() + this.group.height() * 0.2,
            this.group.width() * 0.2,
            this.group.height() * 0.8
        );
        this.constructionDialog = new ConstructionDialog(
            this.group.x() + this.group.width() * 0.15,
            this.group.y() + this.group.height() * 0.2,
            this.group.width() * 0.65,
            this.group.height() * 0.8
        );

        this.group.add(this.titleContainer.getGroup());
        this.group.add(this.inventoryContainer.getGroup());
        this.group.add(this.gridContainer.getGroup());
        this.group.add(this.buildingsContainer.getGroup());
        this.group.add(this.constructionDialog.getGroup());
    }

    getMenuItems(): MenuIcon[] { return this.titleContainer.getMenuItems(); }
    getInventoryItems(): InventoryItem[] { return this.inventoryContainer.getInventoryItems(); }
    getBuildingItems(): BuildingItem[] { return this.buildingsContainer.getBuildingItems(); }
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

        this.menuBar = new MenuBar(this.group.width() - Object.keys(MenuItemType).length * ICON_SIZE, 0);
        this.group.add(this.menuBar.getGroup());
    }

    getMenuItems(): MenuIcon[] { return this.menuBar.getIcons(); }
}

class MenuBar extends Container {
    private icons: MenuIcon[];

    constructor(x: number, y: number) {
        super(x, y, Object.keys(MenuItemType).length * ICON_SIZE, ICON_SIZE);

        this.icons = [
            new MenuIcon(MenuItemType.Information),
            new MenuIcon(MenuItemType.Settings),
            new MenuIcon(MenuItemType.Exit)
        ];
        this.icons.forEach(
            (value, index, array) => {
                const iconGroup = value.getGroup();
                iconGroup.x(index * ICON_SIZE);
                iconGroup.y(0);

                this.group.add(iconGroup);
            }
        );
    }

    getIcons(): MenuIcon[] { return this.icons; }
}

class MenuIcon extends Icon {
    private item: MenuItemType;

    constructor(item: MenuItemType) {
        super(`../../assets/icons/${item}.png`);

        this.item = item;
    }

    getItem(): MenuItemType { return this.item; }
}

class InventoryContainer extends Container {
    private inventoryWood: InventoryItem;
    private inventoryStone: InventoryItem;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        this.container.stroke(Color.Black);

        this.inventoryWood = new InventoryItem(
            InventoryItemType.Wood, 0, 0, width, this.group.height() / 2
        );
        this.group.add(this.inventoryWood.getGroup());

        this.inventoryStone = new InventoryItem(
            InventoryItemType.Stone, 0, this.group.height() / 2, width, this.group.height() / 2
        );
        this.group.add(this.inventoryStone.getGroup());
    }

    getInventoryItems(): InventoryItem[] { return [this.inventoryWood, this.inventoryStone]; }
}

class InventoryItem extends Container {
    private type: InventoryItemType;
    private path: string;

    private iconItem?: Konva.Image;
    private iconPlus: Icon;
    private quantity: Konva.Text;

    constructor(type: InventoryItemType, x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        this.container.stroke(Color.Black);

        this.type = type
        this.path = `../../assets/inventory/${type}.png`;

        const iconSize = width * 0.8;
        Konva.Image.fromURL(
            this.path, (img) => {
                this.iconItem = img;
                this.iconItem.width(iconSize);
                this.iconItem.height(iconSize);
                this.iconItem.x(width / 2 - this.iconItem.width() / 2);
                this.iconItem.y(height / 2 - this.iconItem.height() / 2);
                this.group.add(this.iconItem);
            }
        );

        this.iconPlus = new Icon("../../assets/icons/plus.png");
        const iconGroupPlus = this.iconPlus.getGroup();
        iconGroupPlus.x(width - iconGroupPlus.width());
        iconGroupPlus.y(height - iconGroupPlus.height());
        this.group.add(iconGroupPlus);

        this.quantity = new Konva.Text(
            { fontSize: 18, padding: 10, text: "Quantity:\t" }
        );
        this.quantity.y(height - this.quantity.height());
        this.group.add(this.quantity);
    }

    getType(): InventoryItemType { return this.type; }
    getIconPlus(): Icon { return this.iconPlus; }
}

class GridContainer extends Container {
    private grid: GridCell[][];

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        this.container.stroke(Color.Black);

        this.grid = [];
        for (let i = 0; i < 2 * height / CELL_HEIGHT; ++i) {
            let row: GridCell[] = [];
            for (let j = 0; j < width / CELL_WIDTH - (i % 2); ++j) {
                let cell = new GridCell(
                    j * CELL_WIDTH + (i % 2) * CELL_WIDTH / 2,
                    i * CELL_HEIGHT / 2,
                    CELL_WIDTH,
                    CELL_HEIGHT
                );
                this.group.add(cell.getGroup());
                row.push(cell);
            }
            this.grid.push(row);
        }
    }

    getGrid(): GridCell[][] { return this.grid; }
}

class GridCell {
    private group: Konva.Group;

    private points: Point[];
    private cell: Konva.Line;

    constructor(x: number, y: number, width: number, height: number) {
        this.group = new Konva.Group(
            { x: x, y: y, width: width, height: height }
        );

        this.points = [
            { x: width / 2, y: 0 },
            { x: width, y: height / 2 },
            { x: width / 2, y: height },
            { x: 0, y: height / 2 }
        ];
        this.cell = new Konva.Line(
            {
                points: this.points.flatMap(p => [p.x, p.y]),
                stroke: Color.LightBlue,
                strokeWidth: 2,
                closed: true
            }
        );
        this.group.add(this.cell);
    }

    getGroup(): Konva.Group { return this.group; }
    getPoints(): Point[] { return this.points; }
    getCell(): Konva.Line { return this.cell; }
}

class BuildingsContainer extends Container {
    private buildings: BuildingItem[];

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        this.container.stroke(Color.Black);

        this.buildings = [];
        const iconWidth = this.group.width() / 2;
        const iconHeight = this.group.height() / 4;
        let index = 0;
        for (const building in BuildingType) {
            let row = Math.floor(index / 2);
            let col = index % 2;

            let name = BuildingType[building as keyof typeof BuildingType];
            let buildingIcon = new BuildingItem(
                name, `../../assets/buildings/${name}.png`,
                col * iconWidth, row * iconHeight,
                iconWidth, iconHeight
            );
            this.buildings.push(buildingIcon);
            this.group.add(buildingIcon.getGroup());
            ++index;
        }
    }

    getBuildingItems(): BuildingItem[] { return this.buildings; }
}

class BuildingItem extends Container{
    private type: BuildingType;
    private path: string;

    private icon?: Konva.Image;

    constructor(type: BuildingType, path: string, x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        this.type = type;
        this.path = path;

        Konva.Image.fromURL(
            this.path, (img) => {
                this.icon = img;
                this.icon.width(this.group.width() * 0.80);
                this.icon.height(this.group.width() * 0.80);
                this.icon.x(this.group.width() / 2 - this.icon.width() / 2);
                this.icon.y(this.group.height() / 2 - this.icon.height() / 2);
                this.group.add(this.icon);
            }
        );
    }

    getType(): BuildingType { return this.type; }
}

class ConstructionDialog extends Container {
    private iconCancel: Icon;

    private title: Konva.Text;
    private details: Konva.Group;
    private proposal: Konva.Group;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        this.group.visible(false);
        this.container.cornerRadius(12);
        this.container.fill(Color.White);

        this.iconCancel = new Icon("../../assets/icons/cancel.png");
        const groupCancel = this.iconCancel.getGroup();
        groupCancel.x(this.group.width() - groupCancel.width());
        this.group.add(groupCancel);

        this.title = new Konva.Text({ fontSize: 24, padding: 12 });
        this.group.add(this.title);

        this.details = new Konva.Group(
            {
                x: 0,
                y: this.title.y() + this.title.height(),
                width: this.group.width() / 2,
                height: this.group.height() - this.title.height()
            }
        );
        this.details.add(
            new Konva.Rect(
                {
                    stroke: Color.Black,
                    width: this.details.width(),
                    height: this.details.height()
                }
            )
        );
        this.details.add(
            new Konva.Text(
                {
                    fontSize: 18,
                    padding: 6,
                    text: "Project Details"
                }
            )
        );
        this.group.add(this.details);

        this.proposal = new Konva.Group(
            {
                x: this.group.width() / 2,
                y: this.title.y() + this.title.height(),
                width: this.group.width() / 2,
                height: this.group.height() - this.title.height(),
            }
        );
        this.proposal.add(
            new Konva.Rect(
                {
                    stroke: Color.Black,
                    width: this.proposal.width(),
                    height: this.proposal.height()
                }
            )
        );
        this.proposal.add(
            new Konva.Text(
                {
                    fontSize: 18,
                    padding: 6,
                    text: "Project Proposal"
                }
            )
        );
        this.group.add(this.proposal);
    }

    show(): void { this.group.visible(true); }
    hide(): void { this.group.visible(false); }

    getIconCancel(): Icon { return this.iconCancel; }

    setBuildingType(type: BuildingType) {
        this.title.text(`Current Project: ${type}`);
        this.title.x((this.group.width() - this.title.width()) / 2);
    }
}
