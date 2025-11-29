export class MainGameModel {
    private wood: InventoryItem;
    private stone: InventoryItem;

    constructor(initial: number) {
        this.wood = new InventoryItem(initial);
        this.stone = new InventoryItem(initial);
    }

    getWood(): InventoryItem { return this.wood; }
    getStone(): InventoryItem { return this.stone; }
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
