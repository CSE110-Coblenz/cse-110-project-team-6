import Konva from "konva";
import { View } from "../../types.ts";
import { STAGE_HEIGHT, STAGE_WIDTH } from "../../constants.ts";

export class SettingsView extends View {
  private group: Konva.Group;

  constructor() {
    super();

    this.group = new Konva.Group({
    x: 0,
    y: 0,
    });

    // Background panel
    const panel = new Konva.Rect({
      x:  this.group.width(),
      y: this.group.height(),
      width: 700,
      height: 440,
      fill: "#ffffffff",
      stroke: "#333",
      cornerRadius: 10,
    });
    this.group.add(panel);

    // Title
    const title = new Konva.Text({
      x: 300,
      y: 40,
      text: "Settings",
      fontSize: 28,
      fontStyle: "bold",
      fill: "#000",
    });
    this.group.add(title);

    // Section labels
    const soundLabel = new Konva.Text({
      x: 120,
      y: 100,
      text: "Sound",
      fontSize: 22,
      fontStyle: "bold",
      fill: "#000",
    });
    this.group.add(soundLabel);

    const videoLabel = new Konva.Text({
      x: 120,
      y: 260,
      text: "Video",
      fontSize: 22,
      fontStyle: "bold",
      fill: "#000",
    });
    this.group.add(videoLabel);

    // Sliders
    const addSlider = (label: string, y: number) => {
        const minX = 250;
        const maxX = 500;

        const text = new Konva.Text({
            x: 120,
            y,
            text: `${label}:`,
            fontSize: 16,
            fill: "#000",
        });

        const line = new Konva.Line({
            points: [minX, y + 10, maxX, y + 10],
            stroke: "#333",
            strokeWidth: 3,
        });

        // Start knob in the middle
        const knob = new Konva.Circle({
            x: (minX + maxX) / 2,
            y: y + 10,
            radius: 8,
            fill: "#333",
            draggable: true,
        });

        const percent = new Konva.Text({
            x: maxX + 20,
            y,
            text: "50%",
            fontSize: 16,
            fill: "#000",
        });

        // Drag logic
        knob.on("dragmove", () => {
            // Clamp knob within slider line
            knob.y(0);
        });

        knob.on("dragend", () => {
            // optional: play sound / save setting
        });

  this.group.add(text, line, knob, percent);
};

    addSlider("Main Volume", 140);
    addSlider("Sound Effects", 180);
    addSlider("Music", 220);

    // Helper: Dropdown widget
    const addDropdown = (label: string, y: number, value: string) => {
      const text = new Konva.Text({
        x: 120,
        y,
        text: `${label}:`,
        fontSize: 16,
        fill: "#000",
      });

      const box = new Konva.Rect({
        x: 250,
        y: y - 5,
        width: 180,
        height: 28,
        stroke: "#333",
        cornerRadius: 6,
      });

      const val = new Konva.Text({
        x: 260,
        y,
        text: value,
        fontSize: 16,
        fill: "#000",
      });

      const arrow = new Konva.Text({
        x: 415,
        y,
        text: "▼",
        fontSize: 14,
        fill: "#000",
      });

      this.group.add(text, box, val, arrow);
    };

    addDropdown("Resolution", 310, "1920x1080");
    addDropdown("Window", 360, "Fullscreen");
  }

  getGroup(): Konva.Group {
    return this.group;
  }
}
