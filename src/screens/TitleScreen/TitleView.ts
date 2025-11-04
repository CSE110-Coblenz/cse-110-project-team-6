import Konva from "konva";
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

	private hoverSound: HTMLAudioElement;

	constructor() {
        super();
        const group = this.getGroup();
		this.hoverSound = new Audio('/hover.mp3');

		// Background 
		Konva.Image.fromURL("/titleBackground.png", (image) => {
			image.x(0);
			image.y(0);
			image.width(STAGE_WIDTH);
			image.height(STAGE_HEIGHT);
			this.backgroundImage = image;	
            group.add(this.backgroundImage);
		});
        
   

		// Title text
		Konva.Image.fromURL("/titleText.png", (image) => {
			image.x((STAGE_WIDTH * 0.05));
			image.y(STAGE_HEIGHT * 0.05);
			image.scale({ x: 0.8, y: 0.8 });
			this.titleImage = image;
			group.add(this.titleImage);
		});

		//Buttons
		Konva.Image.fromURL("/startGame.png", (image) => {
			image.x((STAGE_WIDTH * 0.3) - (image.width()*0.4) - STAGE_WIDTH * 0.005);
			image.y(STAGE_HEIGHT * 0.275);
			image.scale({ x: 0.4, y: 0.4});


			image.on('mouseover', () => {
				document.body.style.cursor = 'pointer';
				image.x((STAGE_WIDTH * 0.3) - (image.width() * 0.4) - (((image.width() * 0.425) - (image.width()*0.4)) / 2) - STAGE_WIDTH * 0.005);
				image.y((STAGE_HEIGHT * 0.275) - (((image.height() * 0.425) - (image.height()*0.4)) / 2));
				image.scale({ x: 0.425, y: 0.425});

				this.hoverSound.currentTime = 0; 
				this.hoverSound.play();

			});
			image.on('mouseout', () => {
				document.body.style.cursor = 'default';
				image.x((STAGE_WIDTH * 0.3) - (image.width()*0.4) - STAGE_WIDTH * 0.005);
				image.y(STAGE_HEIGHT * 0.275);
				image.scale({ x: 0.4, y: 0.4});
			});



			this.startButton = image;
			group.add(this.startButton);
		});


		Konva.Image.fromURL("/settings.png", (image) => {
			image.x((STAGE_WIDTH * 0.3 + STAGE_WIDTH * 0.005));
			image.y(STAGE_HEIGHT * 0.275);
			image.scale({ x: 0.4, y: 0.4});

			image.on('mouseover', () => {
				document.body.style.cursor = 'pointer';
				image.x((STAGE_WIDTH * 0.3) - (((image.width() * 0.425) - (image.width()*0.4)) / 2) + STAGE_WIDTH * 0.005);
				image.y((STAGE_HEIGHT * 0.275) - (((image.height() * 0.425) - (image.height()*0.4)) / 2));
				image.scale({ x: 0.425, y: 0.425});

				this.hoverSound.currentTime = 0; 
				this.hoverSound.play();
			});
			image.on('mouseout', () => {
				document.body.style.cursor = 'default';
				image.x((STAGE_WIDTH * 0.3) + STAGE_WIDTH * 0.005);
				image.y(STAGE_HEIGHT * 0.275);
				image.scale({ x: 0.4, y: 0.4});
			});


			this.settingsButton = image;
			group.add(this.settingsButton);
		});


		Konva.Image.fromURL("/highScores.png", (image) => {
			image.x((STAGE_WIDTH * 0.3) - (image.width()*0.4) - STAGE_WIDTH * 0.005);
			image.y(STAGE_HEIGHT * 0.385);
			image.scale({ x: 0.4, y: 0.4});

			image.on('mouseover', () => {
				document.body.style.cursor = 'pointer';
				image.x((STAGE_WIDTH * 0.3) - (image.width() * 0.4) - (((image.width() * 0.425) - (image.width()*0.4)) / 2) - STAGE_WIDTH * 0.005);
				image.y((STAGE_HEIGHT * 0.385) - (((image.height() * 0.425) - (image.height()*0.4)) / 2));
				image.scale({ x: 0.425, y: 0.425});

				this.hoverSound.currentTime = 0; 
				this.hoverSound.play();
			});
			image.on('mouseout', () => {
				document.body.style.cursor = 'default';
				image.x((STAGE_WIDTH * 0.3) - (image.width()*0.4) - STAGE_WIDTH * 0.005);
				image.y(STAGE_HEIGHT * 0.385);
				image.scale({ x: 0.4, y: 0.4});
			});

			this.highScoresButton = image;
			group.add(this.highScoresButton);
		});


		Konva.Image.fromURL("/about.png", (image) => {
			image.x((STAGE_WIDTH * 0.3 + STAGE_WIDTH * 0.005));
			image.y(STAGE_HEIGHT * 0.385);
			image.scale({ x: 0.4, y: 0.4});

			image.on('mouseover', () => {
				document.body.style.cursor = 'pointer';
				image.x((STAGE_WIDTH * 0.3) - (((image.width() * 0.425) - (image.width()*0.4)) / 2) + STAGE_WIDTH * 0.005);
				image.y((STAGE_HEIGHT * 0.385) - (((image.height() * 0.425) - (image.height()*0.4)) / 2));
				image.scale({ x: 0.425, y: 0.425});

				this.hoverSound.currentTime = 0; 
				this.hoverSound.play();
			});
			image.on('mouseout', () => {
				document.body.style.cursor = 'default';
				image.x((STAGE_WIDTH * 0.3) + STAGE_WIDTH * 0.005);
				image.y(STAGE_HEIGHT * 0.385);
				image.scale({ x: 0.4, y: 0.4});
			});

			this.aboutButton = image;
			group.add(this.aboutButton);
		});
	}

}
