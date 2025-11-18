import Konva from "konva";
import { Assets } from "../../assets.ts";
import { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT} from "../../constants.ts";

/**
 * TitleView - Renders the title screen
 */

export class TitleView extends View {
	private backgroundImage: Konva.Image | Konva.Rect;
	private titleImage: Konva.Image | Konva.Text;
	private startButton: Konva.Image | Konva.Rect;
	private settingsButton: Konva.Image | Konva.Rect;
	private highScoresButton: Konva.Image | Konva.Rect;
	private aboutButton: Konva.Image | Konva.Rect;

	

	onStartClick?: () => void;
  	onSettingsClick?: () => void;
 	onHighScoresClick?: () => void;
 	onAboutClick?: () => void;

	constructor() {
        super();
        const group = this.getGroup();

		// BACKGROUND
		const bgImage = Assets["assets/title/titleBackground.png"];
		this.backgroundImage = new Konva.Image({
		image: bgImage,
		x: 0,
		y: 0,
		width: STAGE_WIDTH,
		height: STAGE_HEIGHT
		});
		group.add(this.backgroundImage);

		// TITLE TEXT
		const titleImg = Assets["assets/title/titleText.png"];
		this.titleImage = new Konva.Image({
		image: titleImg,
		x: STAGE_WIDTH * 0.05,
		y: STAGE_HEIGHT * 0.05,
		scale: { x: 0.8, y: 0.8 }
		});
		group.add(this.titleImage);

		// START BUTTON
		const startImg = Assets["assets/title/startGame.png"];
		this.startButton = new Konva.Image({
		image: startImg,
		x: STAGE_WIDTH * 0.3 - startImg.width * 0.4 - STAGE_WIDTH * 0.005,
		y: STAGE_HEIGHT * 0.275,
		scale: { x: 0.4, y: 0.4 }
		});
		
		this.startButton.on("click", () => {
		this.onStartClick?.();
		});

		group.add(this.startButton);

		// SETTINGS BUTTON
		const settingsImg = Assets["assets/title/settings.png"];
		this.settingsButton = new Konva.Image({
		image: settingsImg,
		x: STAGE_WIDTH * 0.3 + STAGE_WIDTH * 0.005,
		y: STAGE_HEIGHT * 0.275,
		scale: { x: 0.4, y: 0.4 }
		});

		this.settingsButton.on("click", () => {
		  this.onSettingsClick?.();
		});

		group.add(this.settingsButton);

		// HIGH SCORES BUTTON
		const scoresImg = Assets["assets/title/highScores.png"];
		this.highScoresButton = new Konva.Image({
		image: scoresImg,
		x: STAGE_WIDTH * 0.3 - scoresImg.width * 0.4 - STAGE_WIDTH * 0.005,
		y: STAGE_HEIGHT * 0.385,
		scale: { x: 0.4, y: 0.4 }
		});

		this.highScoresButton.on("click", () => {
		this.onHighScoresClick?.();
		});

		group.add(this.highScoresButton);

		// ABOUT BUTTON
		const aboutImg = Assets["assets/title/about.png"];
		this.aboutButton = new Konva.Image({
		image: aboutImg,
		x: STAGE_WIDTH * 0.3 + STAGE_WIDTH * 0.005,
		y: STAGE_HEIGHT * 0.385,
		scale: { x: 0.4, y: 0.4 }
		});

		this.aboutButton.on("click", () => {
		this.onAboutClick?.();
		});

		group.add(this.aboutButton);
	}

}
