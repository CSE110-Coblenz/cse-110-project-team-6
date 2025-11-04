import Konva from "konva";
import { View } from "../../types.ts";
import { STAGE_HEIGHT, STAGE_WIDTH } from "../../constants.ts";
import { Assets } from "../../assets.ts";

export class SettingsView extends View {  
  constructor() {
    super();

    // Dimension constants
    const PANEL_WIDTH = STAGE_WIDTH / 2;
    const PANEL_HEIGHT = STAGE_HEIGHT / 2;

    const group = this.getGroup();
    group.x((STAGE_WIDTH - PANEL_WIDTH) / 2);
    group.y((STAGE_HEIGHT - PANEL_HEIGHT) / 2)

    // Background panel
    const panel = new Konva.Rect({
      x: 0,
      y: 0,
      width: PANEL_WIDTH,
      height: PANEL_HEIGHT,
      fill: "#F4F4F4",
      stroke: "#1A1C2C",
      cornerRadius: 20,
    });
    this.group.add(panel);

    // Title
    const settingsTitle = new Konva.Image({
      image: Assets["/settings.png"],
      x: PANEL_WIDTH / 2 - 100,
      y: PANEL_HEIGHT / 20,
      scale: { x: 0.25, y: 0.25 }
    });

this.group.add(settingsTitle);

    // Section labels
    const soundLabel = new Konva.Text({
      x: PANEL_WIDTH / 8,
      y: PANEL_HEIGHT / 8,
      text: "Sound",
      fontSize: 24,
      fontStyle: "bold",
      fill: "#1A1C2C",
    });
    this.group.add(soundLabel);

    const videoLabel = new Konva.Text({
      x: PANEL_WIDTH / 8,
      y: PANEL_HEIGHT / 8 + 200,
      text: "Video",
      fontSize: 24,
      fontStyle: "bold",
      fill: "#1A1C2C",
    });
    this.group.add(videoLabel);

    // Sliders
    const addSlider = (label: string, y: number) => {
      const minX = 200;
      const maxX = 500;

      const text = new Konva.Text({
        x: PANEL_WIDTH / 8,
        y,
        text: `${label}:`,
        fontSize: 16,
        fill: "#1A1C2C",
      });

      const line = new Konva.Line({
        points: [minX, y + 10, maxX, y + 10],
        stroke: "#1A1C2C",
        strokeWidth: 2,
      });

      const knob = new Konva.Circle({
        x: (minX + maxX) / 2,
        y: y + 10,
        radius: 8,
        fill: "#1A1C2C",
        draggable: true,
      });

      const percent = new Konva.Text({
        x: maxX + 20,
        y,
        text: "50%",
        fontSize: 16,
        fill: "#1A1C2C",
      });


      knob.on('mouseover', function (e) {
        e.target.getStage()!.container().style.cursor = 'pointer';
      });


      knob.on('mouseout', function (e) {
        e.target.getStage()!.container().style.cursor = 'default';
      });

      // Drag logic
      knob.on("dragmove", () => {
        // Clamp knob on slider
        knob.y(y + 10);
        const newX = Math.max(minX, Math.min(knob.x(), maxX));
        knob.x(newX);

        // Update percentage
        const ratio = (newX - minX) / (maxX - minX);
        const percentValue = Math.round(ratio * 100);
        percent.text(percentValue + "%");
      });


        knob.on("dragend", () => {
          // Maybe add a sound to show sound level?
        });
        this.group.add(text, line, knob, percent);
    };

    addSlider("Main Volume", PANEL_HEIGHT / 8 + 40);
    addSlider("Sound Effects", PANEL_HEIGHT / 8 + 80);
    addSlider("Music", PANEL_HEIGHT / 8 + 120);

    // Checkbox
    const addCheckbox = (label: string, y: number) => {
      const text = new Konva.Text({
        x: PANEL_WIDTH / 8,
        y,
        text: `${label}:`,
        fontSize: 16,
        fill: "#1A1C2C",
      });

      const box = new Konva.Rect({
        x: PANEL_WIDTH / 8 + 60,
        y: y - 5,
        width: 25, 
        height: 25,
        cornerRadius: 10,
        fill: "#B13E53",
        stroke: "#1A1C2C",
      });

      let isChecked = false;

      box.on('mouseover', function (e) {
        e.target.getStage()!.container().style.cursor = 'pointer';
      });

      box.on('mousedown', function () {
        isChecked = !isChecked; 
        box.fill(isChecked ? "#38B764" : "#B13E53");
        box.getLayer()?.batchDraw();
      });

      box.on('mouseout', function (e) {
        e.target.getStage()!.container().style.cursor = 'default';
      });
      this.group.add(text, box);
    };

    addCheckbox("Mute", PANEL_HEIGHT / 8 + 160);

    // Dropdown options
    const addDropdown = (label: string, y: number, value: string) => {
      const text = new Konva.Text({
        x: PANEL_WIDTH / 8,
        y,
        text: `${label}:`,
        fontSize: 16,
        fill: "#1A1C2C",
      });

      const box = new Konva.Rect({
        x: PANEL_WIDTH / 3,
        y: y,
        width: 250,
        height: 20,
        stroke: "#1A1C2C",
        cornerRadius: 20,
      });

      const val = new Konva.Text({
        x: PANEL_WIDTH / 2 - 20,
        y: y,
        text: value,
        fontSize: 16,
        fill: "#1A1C2C",
      });

      const arrow = new Konva.Text({
        x: PANEL_WIDTH / 2 + 120,
        y,
        text: "▼",
        fontSize: 20,
        fill: "#38B764",
      });

      arrow.on('mouseover', function (e) {
        e.target.getStage()!.container().style.cursor = 'pointer';
      });

      box.on('mousedown', function () {
        // Not sure if this counts as view?
      });

      arrow.on('mouseout', function (e) {
        e.target.getStage()!.container().style.cursor = 'default';
      });
      this.group.add(text, box, val, arrow);
    };

    addDropdown("Resolution", PANEL_HEIGHT / 8 + 240, "1920x1080");
    addDropdown("Window", PANEL_HEIGHT / 8 + 280, "Fullscreen");

    // Exit button
    const exitSize = 40;
    const exitButton = new Konva.Rect({
      x: PANEL_WIDTH - exitSize - 20,
      y: 20,
      width: exitSize,
      height: exitSize,
      fill: "#B13E53",
      cornerRadius: 20,
      stroke: "#1A1C2C",
      strokeWidth: 3,
    });

    const exitText = new Konva.Text({
      x: exitButton.x() + exitSize / 2,
      y: exitButton.y() + exitSize / 2,
      text: "X",
      fontSize: 24,
      fill:"#F4F4F4",
      fontStyle: "bold",
    });

    exitText.offsetX(exitText.width() / 2);
    exitText.offsetY(exitText.height() / 2);

    exitButton.on("mouseover", (e) => {
      e.target.getStage()!.container().style.cursor = "pointer";
    });

    exitButton.on("mouseout", (e) => {
      e.target.getStage()!.container().style.cursor = "default";
    });

    exitButton.on("mousedown", () => {
      this.group.visible(false);
      this.group.getLayer()?.batchDraw();
    });
    this.group.add(exitButton, exitText);
  }
}
