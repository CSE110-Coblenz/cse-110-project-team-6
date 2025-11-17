import Konva from "konva";

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

export type Screen = { type: ScreenType };

export interface ScreenSwitch {
    switchScreen(screen: Screen): void;
}

export abstract class View {
    private group: Konva.Group;

    constructor() {
        this.group = new Konva.Group({ visible: false });
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

export abstract class Controller {
    private screenSwitch: ScreenSwitch;

    constructor(screenSwitch: ScreenSwitch) {
        this.screenSwitch = screenSwitch;
    }

    abstract getView(): View;
    show(): void { this.getView().show(); }
    hide(): void { this.getView().hide(); }
}

export interface LeaderboardEntry {
    username: string;
    score: number;
}
