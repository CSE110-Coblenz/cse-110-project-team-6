import Konva from "konva";

import { ICON_SIZE } from "./constants.ts";
import { Color } from "./types.ts";

export class Container {
    protected group: Konva.Group;
    protected container: Konva.Rect;

    constructor(x: number, y: number, width: number, height: number) {
        this.group = new Konva.Group(
            { x: x, y: y, width: width, height: height }
        );

        this.container = new Konva.Rect(
            {
                cornerRadius: 15,
                x: 0,
                y: 0,
                width: this.group.width(),
                height: this.group.height()
            }
        );
        this.group.add(this.container);
    }

    getGroup(): Konva.Group { return this.group; }
    getContainer(): Konva.Rect { return this.container; }
}

export class Tooltip {
    private stage: Konva.Stage;

    private label: Konva.Label;
    private tag: Konva.Tag;
    private text: Konva.Text;

    constructor(stage: Konva.Stage) {
        this.stage = stage;

        this.label = new Konva.Label(
            {
                listening: false,
                opacity: 0.9,
                visible: false
            }
        );

        this.tag = new Konva.Tag(
            {
                cornerRadius: 5,
                fill: Color.Black,
                lineJoin: "round",
                pointerDirection: "down",
                pointerHeight: 10,
                pointerWidth: 10,
            }
        );
        this.label.add(this.tag);

        this.text = new Konva.Text(
            {
                fill: "white",
                fontFamily: "calibri",
                fontSize: 16,
                padding: 10
            }
        );
        this.label.add(this.text);
    }

    getLabel() { return this.label; }
    getText() { return this.text; }
    show(text: string) {
        this.label.show();
        this.text.text(text);
        this.label.moveToTop();
    }
    hide() { this.label.hide(); }
    move() {
        const mousePos = this.stage.getPointerPosition();
        if (mousePos !== null) {
            this.label.position({ x: mousePos.x, y: mousePos.y });
        }
        this.label.moveToTop();
    }
}

export class Icon {
    protected path: string;

    protected group: Konva.Group;
    protected icon?: Konva.Image;

    constructor(path: string) {
        this.path = path;
        this.group = new Konva.Group({ width: ICON_SIZE, height: ICON_SIZE });

        Konva.Image.fromURL(
            this.path, (img) => {
                this.icon = img;
                this.icon.width(ICON_SIZE);
                this.icon.height(ICON_SIZE);

                this.group.add(this.icon);
            }
        );
    }

    getGroup(): Konva.Group { return this.group; }
}
