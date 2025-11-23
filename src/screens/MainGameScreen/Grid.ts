import Konva from "konva";

import { Container } from "../../components.ts";
import { CELL_HEIGHT, CELL_WIDTH } from "../../constants.ts";
import { Color } from "../../types.ts";
import type { Point } from "../../types.ts";

export class Grid extends Container {
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
