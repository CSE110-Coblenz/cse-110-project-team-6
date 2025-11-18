import { TitleView } from "./TitleView.ts";
import { addCenterHoverScale } from "../../buttonBehavior.ts";
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

        this.view.onStartClick = () => {
            this.confirmSound.currentTime = 0; 
			this.confirmSound.play();
            screenSwitch.switchScreen({type: ScreenType.MainGame});
        };

<<<<<<< HEAD
        
=======
        /* Need to do more testing with this one
>>>>>>> 26a02cb8456a23faa00db5e605c061b16531a1f8
        this.view.onSettingsClick = () => {
            this.confirmSound.currentTime = 0; 
			this.confirmSound.play();
            screenSwitch.switchScreen({ type: ScreenType.Settings });
        };
<<<<<<< HEAD
        
=======
        */
>>>>>>> 26a02cb8456a23faa00db5e605c061b16531a1f8

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
