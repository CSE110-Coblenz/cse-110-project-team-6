import Konva from "konva";

import { Container, Icon } from "../../components.ts";
import { Color, InventoryType } from "../../types.ts";

export class Inventory extends Container {
    private inventoryWood: InventoryItem;
    private inventoryStone: InventoryItem;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        this.container.stroke(Color.Black);

        this.inventoryWood = new InventoryItem(
            InventoryType.Wood, 0, 0, width, this.group.height() / 2
        );
        this.group.add(this.inventoryWood.getGroup());

        this.inventoryStone = new InventoryItem(
            InventoryType.Stone, 0, this.group.height() / 2, width, this.group.height() / 2
        );
        this.group.add(this.inventoryStone.getGroup());
    }

    getWood(): InventoryItem { return this.inventoryWood; }
    getStone(): InventoryItem { return this.inventoryStone; }
}

export class InventoryItem extends Container {
    private type: InventoryType;
    private path: string;

    private iconItem?: Konva.Image;
    private iconPlus: Icon;
    private quantity: Konva.Text;

    constructor(type: InventoryType, x: number, y: number, width: number, height: number) {
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

        this.quantity = new Konva.Text({ fontSize: 18, padding: 10 });
        this.quantity.y(height - this.quantity.height());
        this.group.add(this.quantity);
    }

    getType(): InventoryType { return this.type; }
    getIconPlus(): Icon { return this.iconPlus; }
    setQuantity(quantity: number): void { this.quantity.text(`Quantity:\t${quantity}`); }
}