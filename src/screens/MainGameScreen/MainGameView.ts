import Konva from "konva";

import { NAME, CELL_WIDTH, CELL_HEIGHT, ICON_SIZE } from "../../constants.ts";
import type { Point } from "../../types.ts";
import {
    BuildingType, Color, Container, Icon, InventoryItemType, MenuItemType, View
} from "../../types.ts";

export class MainGameView extends View {
    private titleContainer: TitleContainer;
    private inventoryContainer: InventoryContainer;
    private gridContainer: GridContainer;
    private buildingsContainer: BuildingsContainer;

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
            this.group.width() * 0.15,
            this.group.height() * 0.8
        );
        this.gridContainer = new GridContainer(
            this.group.x() + this.group.width() * 0.15,
            this.group.y() + this.group.height() * 0.2,
            this.group.width() * 0.65,
            this.group.height() * 0.8
        );
        this.buildingsContainer = new BuildingsContainer(
            this.group.x() + this.group.width() * 0.8,
            this.group.y() + this.group.height() * 0.2,
            this.group.width() * 0.2,
            this.group.height() * 0.8
        );

        this.group.add(this.titleContainer.getGroup());
        this.group.add(this.inventoryContainer.getGroup());
        this.group.add(this.gridContainer.getGroup());
        this.group.add(this.buildingsContainer.getGroup());
    }

    getMenuItems(): MenuIcon[] { return this.titleContainer.getMenuItems(); }
    getInventoryItems(): InventoryItem[] { return this.inventoryContainer.getInventoryItems(); }
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

        this.container.stroke(Color.Black);

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
    private text: Konva.Text;
    private inventoryWood: InventoryItem;
    private inventoryStone: InventoryItem;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        this.container.stroke(Color.Black);

        this.text = new Konva.Text({ fontSize: 36, text: "Inventory" });
        this.text.x(this.group.width() / 2 - this.text.width() / 2);
        this.group.add(this.text);

        const itemHeight = (height - this.text.height()) / 2;

        this.inventoryWood = new InventoryItem(
            InventoryItemType.Wood, 0, this.text.height(), width, itemHeight
        );
        this.group.add(this.inventoryWood.getGroup());

        this.inventoryStone = new InventoryItem(
            InventoryItemType.Stone, 0, height - itemHeight, width, itemHeight
        );
        this.group.add(this.inventoryStone.getGroup());
    }

    getInventoryItems(): InventoryItem[] { return [this.inventoryWood, this.inventoryStone]; }
}

class InventoryItem extends Container {
    private type: InventoryItemType;
    private path: string;

    private text: Konva.Text;
    private iconItem?: Konva.Image;
    private iconPlus: Icon;
    private quantityLabel: Konva.Text;
    private quantityValue: Konva.Text;

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

        this.text = new Konva.Text({ fontSize: 24, text: this.type });
        this.text.x(width / 2 - this.text.width() / 2);
        this.text.y((height / 2 - iconSize / 2 - this.text.height()) / 2);
        this.group.add(this.text);

        this.quantityLabel = new Konva.Text({ fontSize: 18, text: "Quantity:\t" });
        this.quantityLabel.y(height - this.quantityLabel.height());
        this.group.add(this.quantityLabel);

        this.quantityValue = new Konva.Text({ fontSize: 18, text: "0" });
        this.quantityValue.x(this.quantityLabel.x() + this.quantityLabel.width());
        this.quantityValue.y(height - this.quantityValue.height());
        this.group.add(this.quantityValue);
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
    private text: Konva.Text;

    private buildings: BuildingItem[];

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        this.container.stroke(Color.Black);

        this.text = new Konva.Text({ fontSize: 36, text: "Buildings" });
        this.text.x(this.group.width() / 2 - this.text.width() / 2);
        this.text.y(0);
        this.group.add(this.text);

        this.buildings = [];
        const iconWidth = width / 2;
        const iconHeight = (height - this.text.height()) / 4;
        let index = 0;
        for (const building in BuildingType) {
            let row = Math.floor(index / 2);
            let col = index % 2;

            let name = BuildingType[building as keyof typeof BuildingType];
            let buildingIcon = new BuildingItem(
                name, `../../assets/buildings/${name}.png`,
                col * iconWidth, row * iconHeight + (this.text.y() + this.text.height()),
                iconWidth, iconHeight
            );
            this.buildings.push(buildingIcon);
            this.group.add(buildingIcon.getGroup());
            ++index;
        }
    }
}

class BuildingItem extends Container{
    private name: string;
    private path: string;

    private icon?: Konva.Image;
    private text: Konva.Text;

    constructor(name: string, path: string, x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        this.container.stroke(Color.Black);

        this.name = name;
        this.path = path;

        Konva.Image.fromURL(
            this.path, (img) => {
                this.icon = img;
                this.icon.width(this.group.width() * 0.80);
                this.icon.height(this.group.width() * 0.80);
                this.icon.x(this.group.width() / 2 - this.icon.width() / 2);
                this.icon.y(0);
                this.group.add(this.icon);
            }
        );

        this.text = new Konva.Text({ fontSize: 18, text: this.name });
        this.text.x(this.group.width() / 2 - this.text.width() / 2);
        this.text.y(this.group.height() - this.text.height());
        this.group.add(this.text);
    }
}
