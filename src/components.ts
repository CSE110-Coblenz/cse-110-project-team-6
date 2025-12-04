import Konva from "konva";

import { ICON_SIZE } from "./constants.ts";
import { Color, MenuItem } from "./types.ts";

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

export class MenuBar extends Container {
    private icons: MenuIcon[];

    constructor(x: number, y: number) {
        super(x, y, Object.keys(MenuItem).length * ICON_SIZE, ICON_SIZE);

        this.icons = [
            new MenuIcon(MenuItem.Information),
            new MenuIcon(MenuItem.Settings),
            new MenuIcon(MenuItem.Exit)
        ];
        this.icons.forEach(
            (value, index) => {
                const iconGroup = value.getGroup();
                iconGroup.x(index * ICON_SIZE);
                iconGroup.y(0);

                this.group.add(iconGroup);
            }
        );
    }

    getIcons(): MenuIcon[] { return this.icons; }
}

class MenuIcon extends Icon {
    private item: MenuItem;

    constructor(item: MenuItem) {
        super(`../../assets/icons/${item}.png`);

        this.item = item;
    }

    getItem(): MenuItem { return this.item; }
}

export class NumericInput extends Container {
    private value: number;
    private text: Konva.Text;

    private focused: boolean;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        this.container.stroke(Color.Black);

        this.value = 0;
        this.text = new Konva.Text(
            {
                fontSize: 18,
                padding: 10,
                text: this.value.toString()
            }
        );
        this.text.y((this.group.height() - this.text.height()) / 2);
        this.group.add(this.text);

        this.focused = false;
    }

    bindListeners(container: HTMLElement): void {
        this.group.on(
            "click", () => {
                if (this.focused) {
                    this.unfocus();
                } else {
                    this.focus();
                }
            }
        )
        container.addEventListener(
            "keydown", (e: KeyboardEvent) => {
                switch (e.key) {
                    case "Backspace":
                        this.handleBackspace();
                        break;
                    case "Delete":
                        this.handleDelete();
                        break;
                    case "Escape":
                        this.handleEscape();
                        break;
                    default:
                        if (/^[0-9]$/.test(e.key)) {
                            try {
                                this.handleNumeric(e.key);
                            } catch (err: unknown) {
                                console.error(err);
                            }
                        }
                }
            }
        )
    }

    isFocused(): boolean { return this.focused; }

    focus(): void {
        this.container.stroke(Color.LightBlue);
        this.focused = true;
    }

    unfocus(): void {
        this.container.stroke(Color.Black);
        this.focused = false;
    }

    flag(): void { this.container.stroke(Color.DarkRed); }

    unflag(): void { this.container.stroke(Color.Black); }

    getValue(): number { return this.value; }

    setValue(value: number) {
        this.value = value;
        this.text.text(this.value.toString());
    }

    push(digit: number) { this.setValue(10 * this.value + digit); }
    pop() { this.setValue(Math.floor(this.value / 10)); }
    clear() { this.setValue(0); }

    handleBackspace(): void {
        if (this.focused) {
            this.pop();
        }
    }

    handleDelete(): void {
        if (this.focused) {
            this.clear();
        }
    }

    handleEscape(): void {
        if (this.focused) {
            this.unfocus();
        }
    }

    handleNumeric(char: string) {
        if (!/^[0-9]$/.test(char)) {
            throw new TypeError(char);
        }
        if (this.focused) {
            this.push(parseInt(char));
        }
    }
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

    bindListeners(group: Konva.Group, hoverText: string) {
        group.on("mouseover", () => { this.show(hoverText); });
        group.on("mouseout", () => { this.hide() });
        group.on("mousemove", () => { this.move() });
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

export function addCenterHoverScale(
  node: Konva.Image,
  baseScale: number,
  hoverScale: number,
  sound: HTMLAudioElement
) {
  const origX = node.x();
  const origY = node.y();

  node.on("mouseover", () => {
    document.body.style.cursor = "pointer";

    const w = node.width();
    const h = node.height();

    const dx = (w * hoverScale - w * baseScale) / 2;
    const dy = (h * hoverScale - h * baseScale) / 2;

    node.x(origX - dx);
    node.y(origY - dy);
    node.scale({ x: hoverScale, y: hoverScale });

    sound.currentTime = 0;
    sound.play();
  });

  node.on("mouseout", () => {
    document.body.style.cursor = "default";
    node.x(origX);
    node.y(origY);
    node.scale({ x: baseScale, y: baseScale });
  });
}