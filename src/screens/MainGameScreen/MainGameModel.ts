import { BuildingType } from "../../types.ts";

export class MainGameModel {
    private score: number = 0;

    private wood: InventoryItem;
    private stone: InventoryItem;
    private grid: Grid;
    private construction: Construction;

    static logisticScore(
        d: number, min: number = 0, max: number = 100, k: number = 25, d0: number = 0.25
    ): number { return (d === 0) ? max : (min + (max - min) / (1 + Math.exp(k * (d - d0)))) }

    constructor(initialQuantity: number, gridRows: number, gridCols: number) {
        this.wood = new InventoryItem(initialQuantity);
        this.stone = new InventoryItem(initialQuantity);
        this.grid = new Grid(gridRows, gridCols);
        this.construction = new Construction();
    }

    getWood(): InventoryItem { return this.wood; }

    getStone(): InventoryItem { return this.stone; }

    getGrid(): Grid { return this.grid; }

    getConstruction(): Construction { return this.construction; }

    getScore(): number { return this.score; }

    incrementScore(score: number) { this.score += score; }

    scoreInput(area: number, perimeter: number): number {
        const targetArea = this.construction.getTargetArea();
        const scoreArea = MainGameModel.logisticScore((area - targetArea) / targetArea);

        const targetPerimeter = this.construction.getTargetPerimeter();
        const scorePerimeter = MainGameModel.logisticScore(
            (perimeter - targetPerimeter) / targetPerimeter
        );

        return Math.sqrt(scoreArea * scorePerimeter);
    }
}

class InventoryItem {
    private quantity;

    constructor(initial: number = 0) {
        this.quantity = initial;
    }

    get(): number { return this.quantity; }

    add(quantity: number): void { this.quantity += quantity; }

    subtract(quantity: number): boolean {
        if (quantity > this.quantity) {
            return false;
        }
        this.quantity -= quantity;

        return true;
    }
}

type MatrixEntry = { i: number, j: number };

class MatrixSlice {
    private entries: MatrixEntry[];

    constructor(
        public n: MatrixEntry, public w: MatrixEntry, public e: MatrixEntry, public s: MatrixEntry
    ) {
        this.entries = [this.n, this.w, this.e, this.s];
    }

    getEntries(): MatrixEntry[] { return this.entries; }

    contains(entry: MatrixEntry): boolean {
        let res = false;
        this.entries.forEach(
            (value) => {
                if (entry.i === value.i && entry.j === value.j) {
                    res = true;
                }
            }
        );
        return res;
    }

    intersects(other: MatrixSlice): boolean {
        let res = false;
        this.entries.forEach(
            (value) => {
                if (other.contains(value)) {
                    res = true;
                }
            }
        );
        return res;
    }
}

type Building = {
    type: BuildingType,
    slice: MatrixSlice
};

class Grid {
    private buildings: Building[] = [];

    constructor(private nrows: number, private ncols: number) {}

    contains(entry: MatrixEntry): boolean {
        if (entry.i < 0 || entry.j < 0) {
            return false;
        }
        if (entry.i >= this.nrows || entry.j >= this.ncols - (entry.i % 2)) {
            return false;
        }
        return true;
    }

    cellVacant(entry: MatrixEntry): boolean {
        let res: boolean = true;
        this.buildings.forEach(
            (value) => {
                if (value.slice.contains(entry)) {
                    res = false;
                }
            }
        );
        return res;
    }

    cellValid(entry: MatrixEntry): boolean {
        return this.contains(entry) && this.cellVacant(entry);
    }

    sliceValid(slice: MatrixSlice): boolean {
        let res: boolean = true;
        slice.getEntries().forEach(
            (value) => {
                if (!this.cellValid(value)) {
                    res = false;
                }
            }
        );
        return res;
    }

    getSlice(entry: MatrixEntry): MatrixSlice {
        let slice: MatrixSlice | null;
        if (entry.i % 2 === 0) {
            slice = new MatrixSlice(
                { i: entry.i, j: entry.j },
                { i: entry.i + 1, j: entry.j - 1 },
                { i: entry.i + 1, j: entry.j },
                { i: entry.i + 2, j: entry.j }
            );
        } else {
            slice = new MatrixSlice(
                { i: entry.i, j: entry.j },
                { i: entry.i + 1, j: entry.j },
                { i: entry.i + 1, j: entry.j + 1 },
                { i: entry.i + 2, j: entry.j }
            );
        }

        return slice;
    }

    getBuildings(): Building[] { return this.buildings; }

    addBuilding(type: BuildingType, i: number, j: number): boolean {
        const entry = { i: i, j: j };
        const slice = this.getSlice(entry);

        let valid: boolean = true;
        slice.getEntries().forEach(
            (value) => {
                if (!this.cellValid(value)) {
                    valid = false;
                }
            }
        );

        if (valid) {
            this.buildings.push({ type: type, slice: slice });
        }

        return valid;
    }
}

class Construction {
    private type?: BuildingType;
    private targetLength: number = 0;
    private targetWidth: number = 0;

    static randomizeParameter(min: number = 1, max: number = 100): number {
        return Math.ceil(Math.random() * (max - min) + min);
    }

    getType(): BuildingType | undefined { return this.type; }

    setType(type: BuildingType) { this.type = type; }

    generateTargets(): void {
        this.targetLength = Construction.randomizeParameter();
        this.targetWidth = Construction.randomizeParameter();
    }

    getTargetLength(): number { return this.targetLength; }

    getTargetWidth(): number { return this.targetWidth; }

    getTargetArea(): number { return this.targetLength * this.targetWidth; }

    getTargetPerimeter(): number { return 2 * (this.targetLength + this.targetWidth); }
}
