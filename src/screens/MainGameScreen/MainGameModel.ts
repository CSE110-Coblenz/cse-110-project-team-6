export class MainGameModel {
    private wood: InventoryItem;
    private stone: InventoryItem;

    private targetLength: number = 0;
    private targetWidth: number = 0;

    constructor(initial: number) {
        this.wood = new InventoryItem(initial);
        this.stone = new InventoryItem(initial);
    }

    getWood(): InventoryItem { return this.wood; }

    getStone(): InventoryItem { return this.stone; }

    randomizeParameter(min: number = 1, max: number = 100): number {
        return Math.ceil(Math.random() * (max - min) + min);
    }

    generateTargets(): void {
        this.targetLength = this.randomizeParameter();
        this.targetWidth = this.randomizeParameter();
    }

    getTargetLength(): number { return this.targetLength; }

    getTargetWidth(): number { return this.targetWidth; }

    getTargetArea(): number { return this.targetLength * this.targetWidth; }

    getTargetPerimeter(): number { return 2 * (this.targetLength + this.targetWidth); }
}

class InventoryItem {
    private quantity;

    constructor(initial: number = 0) {
        this.quantity = initial;
    }

    get(): number { return this.quantity; }

    add(quantity: number): void {
        this.quantity += quantity;
    }

    subtract(quantity: number): boolean {
        if (quantity > this.quantity) {
            return false;
        }
        this.quantity -= quantity;

        return true;
    }
}
