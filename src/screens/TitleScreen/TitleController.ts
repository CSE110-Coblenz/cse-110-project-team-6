import { TitleView } from "./TitleView.ts";
import { Controller, ScreenType } from "../../types.ts";
import type { ScreenSwitch } from "../../types.ts";

export class TitleController extends Controller {
    private view: TitleView;
    private confirmSound: HTMLAudioElement;

    constructor(screenSwitch: ScreenSwitch) {
        super(screenSwitch);

        this.view = new TitleView();

        this.confirmSound = new Audio('/assets/sounds/confirm.mp3');

        this.view.onStartClick = () => {
            this.confirmSound.currentTime = 0; 
			this.confirmSound.play();
            screenSwitch.switchScreen({type: ScreenType.MainGame});
        };

        /* Need to do more testing with this one
        this.view.onSettingsClick = () => {
            this.confirmSound.currentTime = 0; 
			this.confirmSound.play();
            screenSwitch.switchScreen({ type: ScreenType.Settings });
        };
        */

        this.view.onHighScoresClick = () => {
            this.confirmSound.currentTime = 0; 
			this.confirmSound.play();
            screenSwitch.switchScreen({ type: ScreenType.Leaderboard });
        };

        this.view.onAboutClick = () => {
            this.confirmSound.currentTime = 0; 
			this.confirmSound.play();
            screenSwitch.switchScreen({ type: ScreenType.About });
        };
    }

    getView(): TitleView { return this.view; }
}
