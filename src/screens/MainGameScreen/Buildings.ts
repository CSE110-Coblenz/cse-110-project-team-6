import Konva from "konva";

import { Container } from "../../components.ts";
import { BuildingType, Color } from "../../types.ts";

export class BuildingMenu extends Container {
    private buildings: Building[];

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
            let buildingIcon = new Building(
                name, `../../assets/buildings/${name}.png`,
                col * iconWidth, row * iconHeight,
                iconWidth, iconHeight
            );
            this.buildings.push(buildingIcon);
            this.group.add(buildingIcon.getGroup());
            ++index;
        }
    }

    getBuildings(): Building[] { return this.buildings; }
}

export class Building extends Container {
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