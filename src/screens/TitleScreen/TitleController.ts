import { TitleView } from "./TitleView.ts";
import { addCenterHoverScale } from "../../components.ts";
import { Controller, ScreenType } from "../../types.ts";
import type { ScreenSwitch } from "../../types.ts";

export class TitleController extends Controller {
    private view: TitleView;
    private confirmSound: HTMLAudioElement;
    private hoverSound: HTMLAudioElement;

    constructor(screenSwitch: ScreenSwitch) {
        super(screenSwitch);

        this.view = new TitleView();

        this.confirmSound = new Audio('/assets/sounds/confirm.mp3');
        this.hoverSound = new Audio('/assets/sounds/hover.mp3');
       
        addCenterHoverScale(this.view.startButton, 0.4, 0.425, this.hoverSound);
        addCenterHoverScale(this.view.settingsButton, 0.4, 0.425, this.hoverSound);
        addCenterHoverScale(this.view.highScoresButton, 0.4, 0.425, this.hoverSound);
        addCenterHoverScale(this.view.aboutButton, 0.4, 0.425, this.hoverSound);

        this.view.startButton.on("click", this.handleStartClick(this.screenSwitch));
        this.view.settingsButton.on("click", this.handleSettingsClick(this.screenSwitch));
        this.view.highScoresButton.on("click", this.handleHighScoresClick(this.screenSwitch));
        this.view.aboutButton.on("click", this.handleAboutClick(this.screenSwitch));
    }

    private playConfirm() {
        this.confirmSound.currentTime = 0;
        this.confirmSound.play();
    }

    private handleStartClick = (screenSwitch: ScreenSwitch) => () => {
        this.playConfirm();
        screenSwitch.switchScreen({ type: ScreenType.MainGame });
    };

    private handleSettingsClick = (screenSwitch: ScreenSwitch) => () => {
        this.playConfirm();
        screenSwitch.switchScreen({ type: ScreenType.Settings });
    };

    private handleHighScoresClick = (screenSwitch: ScreenSwitch) => () => {
        this.playConfirm();
        screenSwitch.switchScreen({ type: ScreenType.Leaderboard });
    };

    private handleAboutClick = (screenSwitch: ScreenSwitch) => () => {
        this.playConfirm();
        screenSwitch.switchScreen({ type: ScreenType.About });
    };

    getView(): TitleView { return this.view; }
}
