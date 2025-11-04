import Konva from "konva";

import { NAME, CELL_WIDTH, CELL_HEIGHT } from "../../constants.ts";
import type { Point } from "../../types.ts";
import { Color, View } from "../../types.ts";

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
            group.width() * 0.2,
            group.height() * 0.8
        );
        this.gridContainer = new GridContainer(
            group.x() + group.width() * 0.2,
            group.y() + group.height() * 0.2,
            group.width() * 0.6,
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
    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
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
    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
    }
}