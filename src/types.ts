import Konva from "konva";

import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants.ts";

export type Point = {
    x: number;
    y: number;
};

/* Color palette */
export enum Color {
    DarkRed = "#B13E53",
    Orange = "#EF7D57",
    Yellow = "#FFCD75",
    Lime = "#A7F070",
    Green = "#38B764",
    Teal = "#257179",
    Cyan = "#73EFF7",
    LightBlue = "#41A6F6",
    Blue = "#3B5DC9",
    DarkBlue = "#29366F",
    Purple = "#5D275D",
    White = "#F4F4F4",
    LightGreyBlue = "#94B0C2",
    GreyBlue = "#566C86",
    DarkGreyBlue = "#333C57",
    Black = "#1A1C2C"
}

export enum ScreenType {
    About = "ABOUT",
    Leaderboard = "LEADERBOARD",
    MainGame = "MAINGAME",
    Settings = "SETTINGS",
    StoneMinigame = "STONEMINIGAME",
    Title = "TITLE",
    WoodMinigame = "WOODMINIGAME"
}

export enum MenuItem {
    Information = "information",
    Settings = "settings",
    Exit = "exit"
}

export enum Building {
    Apartment = "APARTMENT",
    Bank = "BANK",
    Hospital = "HOSPITAL",
    Hotel = "HOTEL",
    Library = "LIBRARY",
    Restaurant = "RESTAURANT",
    School = "SCHOOL",
    Store = "STORE"
}

export type Screen = { type: ScreenType };

export interface ScreenSwitch {
    switchScreen(screen: Screen): void;
}

export abstract class View {
    private group: Konva.Group;

    constructor() {
        this.group = new Konva.Group(
            {
                visible: false,
                x: 0,
                y: 0,
                width: STAGE_WIDTH,
                height: STAGE_HEIGHT
            }
        );
    }

    getGroup(): Konva.Group { return this.group; }

    show(): void {
        this.group.visible(true);
        this.group.getLayer()?.draw();
    }

    hide(): void {
        this.group.visible(false);
        this.group.getLayer()?.draw();
    }
}

export class Container {
    private group: Konva.Group;
    private container: Konva.Rect;

    constructor(x: number, y: number, width: number, height: number) {
        this.group = new Konva.Group(
            { x: x, y: y, width: width, height: height }
        );

        this.container = new Konva.Rect(
            { x: 0, y: 0, width: this.group.width(), height: this.group.height() }
        );
        this.group.add(this.container);
    }

    getGroup(): Konva.Group { return this.group; }
    getContainer(): Konva.Rect { return this.container; }
}

export abstract class Controller {
    private screenSwitch: ScreenSwitch;

    constructor(screenSwitch: ScreenSwitch) {
        this.screenSwitch = screenSwitch;
    }

    abstract getView(): View;
    show(): void { this.getView().show(); }
    hide(): void { this.getView().hide(); }
}
