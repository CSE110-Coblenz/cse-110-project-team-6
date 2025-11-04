import Konva from "konva";

import { NAME, CELL_WIDTH, CELL_HEIGHT, ICON_SIZE } from "../../constants.ts";
import type { Point } from "../../types.ts";
import { Building, Color, View } from "../../types.ts";

export class MainGameView extends View {
    private titleContainer: TitleContainer;
    private inventoryContainer: InventoryContainer;
    private gridContainer: GridContainer;
    private buildingsContainer: BuildingsContainer;

    constructor() {
        super();

        const group = this.getGroup();

        this.titleContainer = new TitleContainer(
            group.x(),
            group.y(),
            group.width(),
            group.height() * 0.2
        );
        this.inventoryContainer = new InventoryContainer(
            group.x(),
            group.y() + group.height() * 0.2,
            group.width() * 0.15,
            group.height() * 0.8
        );
        this.gridContainer = new GridContainer(
            group.x() + group.width() * 0.15,
            group.y() + group.height() * 0.2,
            group.width() * 0.65,
            group.height() * 0.8
        );
        this.buildingsContainer = new BuildingsContainer(
            group.x() + group.width() * 0.8,
            group.y() + group.height() * 0.2,
            group.width() * 0.2,
            group.height() * 0.8
        );

        group.add(this.titleContainer.getGroup());
        group.add(this.inventoryContainer.getGroup());
        group.add(this.gridContainer.getGroup());
        group.add(this.buildingsContainer.getGroup());
    }
}

class Container {
    private group: Konva.Group;
    private container: Konva.Rect;

    constructor(x: number, y: number, width: number, height: number) {
        this.group = new Konva.Group(
            { x: x, y: y, width: width, height: height }
        );

        this.container = new Konva.Rect(
            {
                stroke: Color.Black,
                x: 0,
                y: 0,
                width: this.group.width(),
                height: this.group.height()
            }
        );
        this.group.add(this.container);
    }

    getGroup(): Konva.Group { return this.group }
}

class TitleContainer extends Container {
    private text: Konva.Text;
    private iconInformation: Konva.Image | null = null;
    private iconSettings: Konva.Image | null = null;
    private iconExit: Konva.Image | null = null;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        const group = this.getGroup();

        this.text = new Konva.Text({ fontSize: 48, text: NAME });
        this.text.x(group.width() / 2 - this.text.width() / 2);
        this.text.y(group.height() / 2 - this.text.height() / 2);
        group.add(this.text);

        Konva.Image.fromURL(
            "../../assets/icons/information.png", (img) => {
                img.x(group.width() * 0.94);
                img.y(0);
                img.width(0.02 * group.width());
                img.height(0.02 * group.width());

                this.iconInformation = img;
                group.add(this.iconInformation);
            }
        );
        Konva.Image.fromURL(
            "../../assets/icons/setting.png", (img) => {
                img.x(group.width() * 0.96);
                img.y(0);
                img.width(0.02 * group.width());
                img.height(0.02 * group.width());

                this.iconSettings = img;
                group.add(this.iconSettings);
            }
        );
        Konva.Image.fromURL(
            "../../assets/icons/exit.png", (img) => {
                img.x(group.width() * 0.98);
                img.y(0);
                img.width(0.02 * group.width());
                img.height(0.02 * group.width());

                this.iconExit = img;
                group.add(this.iconExit);
            }
        );
    }
}

class InventoryContainer extends Container {
    private text: Konva.Text;
    private inventoryWood: InventoryItem;
    private inventoryStone: InventoryItem;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        const group = this.getGroup();

        this.text = new Konva.Text({ fontSize: 36, text: "Inventory" });
        this.text.x(group.width() / 2 - this.text.width() / 2);
        group.add(this.text);

        const itemHeight = (height - this.text.height()) / 2;

        this.inventoryWood = new InventoryItem(
            "WOOD", 0, this.text.height(), width, itemHeight
        );
        group.add(this.inventoryWood.getGroup());

        this.inventoryStone = new InventoryItem(
            "STONE", 0, height - itemHeight, width, itemHeight
        );
        group.add(this.inventoryStone.getGroup());
    }
}

class InventoryItem extends Container {
    private name: string;
    private path: string;

    private text: Konva.Text;
    private iconItem?: Konva.Image;
    private iconPlus?: Konva.Image;
    private quantityLabel: Konva.Text;
    private quantityValue: Konva.Text;

    constructor(name: string, x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        const group = this.getGroup();

        this.name = name;
        this.path = `../../assets/inventory/${name}.png`;

        const iconSize = width * 0.8;
        Konva.Image.fromURL(
            this.path, (img) => {
                this.iconItem = img;
                this.iconItem.width(iconSize);
                this.iconItem.height(iconSize);
                this.iconItem.x(width / 2 - this.iconItem.width() / 2);
                this.iconItem.y(height / 2 - this.iconItem.height() / 2);
                group.add(this.iconItem);
            }
        );

        Konva.Image.fromURL(
            "../../assets/icons/plus.png", (img) => {
                this.iconPlus = img;
                this.iconPlus.width(ICON_SIZE);
                this.iconPlus.height(ICON_SIZE);
                this.iconPlus.x(width - this.iconPlus.width());
                this.iconPlus.y(height - this.iconPlus.height());
                group.add(this.iconPlus);
            }
        )

        this.text = new Konva.Text({ fontSize: 24, text: this.name });
        this.text.x(width / 2 - this.text.width() / 2);
        this.text.y((height / 2 - iconSize / 2 - this.text.height()) / 2);
        group.add(this.text);

        this.quantityLabel = new Konva.Text({ fontSize: 18, text: "Quantity:\t" });
        this.quantityLabel.y(height - this.quantityLabel.height());
        group.add(this.quantityLabel);

        this.quantityValue = new Konva.Text({ fontSize: 18, text: "0" });
        this.quantityValue.x(this.quantityLabel.x() + this.quantityLabel.width());
        this.quantityValue.y(height - this.quantityValue.height());
        group.add(this.quantityValue);
    }
}

class GridContainer extends Container {
    private grid: GridCell[][];

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        const group = this.getGroup();

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
                group.add(cell.getGroup());
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

    private buildings: BuildingIcon[];

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        const group = this.getGroup();

        this.text = new Konva.Text({ fontSize: 24, text: "Available Buildings" });
        this.text.x(group.width() / 2 - this.text.width() / 2);
        this.text.y(0);
        group.add(this.text);

        this.buildings = [];
        const iconWidth = width / 2;
        const iconHeight = (height - this.text.height()) / 4;
        let index = 0;
        for (const building in Building) {
            let row = Math.floor(index / 2);
            let col = index % 2;

            let name = Building[building as keyof typeof Building];
            let buildingIcon = new BuildingIcon(
                name, `../../assets/buildings/${name}.png`,
                col * iconWidth, row * iconHeight + (this.text.y() + this.text.height()),
                iconWidth, iconHeight
            );
            this.buildings.push(buildingIcon);
            group.add(buildingIcon.getGroup());
            ++index;
        }
    }
}

class BuildingIcon {
    private name: string;
    private path: string;

    private group: Konva.Group;

    private container: Konva.Rect;
    private icon?: Konva.Image;
    private text: Konva.Text;

    constructor(name: string, path: string, x: number, y: number, width: number, height: number) {
        this.name = name;
        this.path = path;

        this.group = new Konva.Group({ x: x, y: y, width: width, height: height });

        this.container = new Konva.Rect(
            {
                stroke: Color.Black,
                x: 0,
                y: 0,
                width: width,
                height: height
            }
        );
        this.group.add(this.container);

        const iconSize = width * 0.80;
        Konva.Image.fromURL(
            this.path, (img) => {
                this.icon = img;
                this.icon.width(iconSize);
                this.icon.height(iconSize);
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

    getGroup(): Konva.Group { return this.group; }
}