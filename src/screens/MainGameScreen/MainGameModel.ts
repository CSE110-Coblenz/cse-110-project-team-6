export class MainGameModel {
    private score: number = 0;

    private wood: InventoryItem;
    private stone: InventoryItem;

    private targetLength: number = 0;
    private targetWidth: number = 0;

    static randomizeParameter(min: number = 1, max: number = 100): number {
        return Math.ceil(Math.random() * (max - min) + min);
    }

    static logisticScore(
        d: number, min: number = 0, max: number = 100, k: number = 25, d0: number = 0.25
    ): number { return (d === 0) ? max : (min + (max - min) / (1 + Math.exp(k * (d - d0)))) }

    constructor(initial: number) {
        this.wood = new InventoryItem(initial);
        this.stone = new InventoryItem(initial);
    }

    getWood(): InventoryItem { return this.wood; }

    getStone(): InventoryItem { return this.stone; }

    generateTargets(): void {
        this.targetLength = MainGameModel.randomizeParameter();
        this.targetWidth = MainGameModel.randomizeParameter();
    }

    getTargetLength(): number { return this.targetLength; }

    getTargetWidth(): number { return this.targetWidth; }

    getTargetArea(): number { return this.targetLength * this.targetWidth; }

    getTargetPerimeter(): number { return 2 * (this.targetLength + this.targetWidth); }

    getScore(): number { return this.score; }

    incrementScore(score: number) { this.score += score; }

    scoreInput(area: number, perimeter: number): number {
        const targetArea = this.getTargetArea();
        const scoreArea = MainGameModel.logisticScore((area - targetArea) / targetArea);

        const targetPerimeter = this.getTargetPerimeter();
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
