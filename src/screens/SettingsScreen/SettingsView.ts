import Konva from "konva";
import { Assets } from "../../assets.ts";
import { STAGE_HEIGHT, STAGE_WIDTH } from "../../constants.ts";
import { View } from "../../types.ts";

export class SettingsView extends View {  
  private static readonly PANEL_WIDTH = STAGE_WIDTH / 2;
  private static readonly PANEL_HEIGHT = STAGE_HEIGHT / 2;

  private panel: Konva.Rect;
  private settingsTitle: Konva.Image;
  private soundLabel: Konva.Text;
  private exitButton: Konva.Group;
  private mainVolSlider: Slider;
  private effectsSlider: Slider;
  private musicSlider: Slider;
  private muteButton: Checkbox;

  constructor() {
    super();

    const group = this.getGroup();
    group.x((STAGE_WIDTH - SettingsView.PANEL_WIDTH) / 2);
    group.y((STAGE_HEIGHT - SettingsView.PANEL_HEIGHT) / 2)

    // Background panel
    this.panel = new Konva.Rect({
      x: 0,
      y: 0,
      width: SettingsView.PANEL_WIDTH,
      height: SettingsView.PANEL_HEIGHT,
      fill: "#F4F4F4",
      stroke: "#1A1C2C",
      cornerRadius: 20,
    });
    group.add(this.panel);

    // Title
    const settingsImage = Assets["/settings.png"];
    this.settingsTitle = new Konva.Image({
      image: settingsImage,
      x: SettingsView.PANEL_WIDTH / 2 - 75,
      y: SettingsView.PANEL_HEIGHT / 20,
      scale: { x: 0.25, y: 0.25 }
    });
    group.add(this.settingsTitle);

    // Section labels
    this.soundLabel = new Konva.Text({
      x: SettingsView.PANEL_WIDTH / 8,
      y: SettingsView.PANEL_HEIGHT / 4,
      text: "Sound",
      fontSize: 24,
      fontStyle: "bold",
      fill: "#1A1C2C",
    });
    group.add(this.soundLabel);

    // Exit button
    this.exitButton = new Konva.Group();

    const buttonSize = 40;
    const exitBackground = new Konva.Rect({
      x: SettingsView.PANEL_WIDTH - buttonSize - 20,
      y: 20,
      width: buttonSize,
      height: buttonSize,
      fill: "#B13E53",
      cornerRadius: 20,
      stroke: "#1A1C2C",
      strokeWidth: 3,
    });
    this.exitButton.add(exitBackground);

    const exitText = new Konva.Text({
      x: exitBackground.x() + exitBackground.width() / 2,
      y: exitBackground.y() + exitBackground.height() / 2,
      text: "X",
      fontSize: 24,
      fontStyle: "bold",
      fill: "#F4F4F4",
    });
    exitText.offsetX(exitText.width() / 2);
    exitText.offsetY(exitText.height() / 2);
    this.exitButton.add(exitText);
    
    group.add(this.exitButton);

    // Sliders
    this.mainVolSlider = new Slider("Main Volume", SettingsView.PANEL_WIDTH / 8, SettingsView.PANEL_HEIGHT / 4 + 40);
    this.effectsSlider = new Slider("Sound Effects", SettingsView.PANEL_WIDTH / 8, SettingsView.PANEL_HEIGHT / 4 + 80);
    this.musicSlider = new Slider("Music", SettingsView.PANEL_WIDTH / 8, SettingsView.PANEL_HEIGHT / 4 + 120);
    
    group.add(this.mainVolSlider.getGroup());
    group.add(this.effectsSlider.getGroup());
    group.add(this.musicSlider.getGroup());

    // Mute Button
    this.muteButton = new Checkbox("Mute All", SettingsView.PANEL_WIDTH / 8, SettingsView.PANEL_HEIGHT / 4 + 160);
    group.add(this.muteButton.getGroup());

  }

  getPanel(): Konva.Rect {return this.panel;}
  getSettingsTitle(): Konva.Image {return this.settingsTitle;}
  getSoundLabel(): Konva.Text {return this.soundLabel;}
  getExitButton(): Konva.Group {return this.exitButton;}
  getMainVolSlider(): Slider {return this.mainVolSlider;}
  getEffectsSlider(): Slider {return this.effectsSlider;}
  getMusicSlider(): Slider {return this.musicSlider;}
  getMuteButton(): Checkbox {return this.muteButton;}
}

class Slider {
  private group: Konva.Group;
  private text: Konva.Text;
  private line: Konva.Line;
  private knob: Konva.Circle;
  private percent: Konva.Text;
  private minX: number;
  private maxX: number;

  constructor(label: string, x: number, y: number, minX = 200, maxX = 500) {
    this.group = new Konva.Group();
    this.minX = minX;
    this.maxX = maxX;

    this.text = new Konva.Text({
        x,
        y,
        text: `${label}:`,
        fontSize: 16,
        fill: "#1A1C2C",
    });

    this.line = new Konva.Line({
        points: [minX, y + 10, maxX, y + 10],
        stroke: "#1A1C2C",
        strokeWidth: 2,
    });

    this.knob = new Konva.Circle({
        x: (minX + maxX) / 2,
        y: y + 10,
        radius: 8,
        fill: "#1A1C2C",
        draggable: true,
    });

    this.percent = new Konva.Text({
        x: maxX + 20,
        y,
        text: "50%",
        fontSize: 16,
        fill: "#1A1C2C",
    });

    this.group.add(this.text, this.line, this.knob, this.percent);
  }

  getGroup(): Konva.Group {return this.group;}
  getText(): Konva.Text {return this.text;}
  getLine(): Konva.Line {return this.line;}
  getKnob(): Konva.Circle {return this.knob;}
  getPercent(): Konva.Text {return this.percent;}
  getMinX(): number {return this.minX;}
  getMaxX(): number {return this.maxX;}
}

class Checkbox {
  private group: Konva.Group;
  private text: Konva.Text;
  private box: Konva.Rect;
  private check: boolean;
  
  constructor(label: string, x: number, y: number){
    this.group = new Konva.Group();

    this.text = new Konva.Text({
      x,
      y,
      text: `${label}:`,
      fontSize: 16,
      fill: "#1A1C2C",
    });

    this.box = new Konva.Rect({
      x: x + 80,
      y: y - 5,
      width: 25, 
      height: 25,
      cornerRadius: 10,
      fill: "#B13E53",
      stroke: "#1A1C2C",
    });

    this.check = false;

    this.group.add(this.text, this.box);
  }

  toggle() {
    this.check = !this.check;
  }

  getGroup(): Konva.Group {return this.group;}
  getText(): Konva.Text {return this.text;}
  getBox(): Konva.Rect {return this.box;}
  isChecked(): boolean {return this.check;}
}