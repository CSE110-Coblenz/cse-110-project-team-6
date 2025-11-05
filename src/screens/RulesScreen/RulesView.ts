import Konva from "konva";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import { View } from "../../types.ts";

/** Single row in the rules list: an icon + a text block */
class RulesItem {
  private icon: Konva.Rect;
  private text: Konva.Text;

  constructor(opts: {
    top: number;
    iconSize: number;
    color: string;
    gapX: number;
    rowWidth: number;
    rowHeight: number;
  }, copy: string) {
    const { top, iconSize, color, gapX, rowWidth, rowHeight } = opts;

    this.icon = new Konva.Rect({
      x: 8,
      y: top + (rowHeight - iconSize) / 2,
      width: iconSize,
      height: iconSize,
      fill: color,
      stroke: "#7a7f85",
      cornerRadius: 12,
      opacity: 0.95,
    });

    this.text = new Konva.Text({
      x: 8 + iconSize + gapX,
      y: top + (rowHeight - 26) / 2, // approx vertical centering
      width: rowWidth - (8 + iconSize + gapX) - 8,
      text: copy,
      fontSize: 20,
      lineHeight: 1.3,
      fontFamily: "Inter, system-ui, sans-serif",
      fill: "#111827",
    });
  }

  addTo(group: Konva.Group) {
    group.add(this.icon, this.text);
  }
}

/** Rules screen view (extends base View) */
export class RulesView extends View {
  public backBtn!: Konva.Group;

  private items: RulesItem[] = [];

  constructor() {
    super(); // initializes hidden Konva.Group and inherits show/hide/getGroup()
    this.build();
  }

  /** Accessor if a controller/tests ever need to inspect items */
  getItems(): RulesItem[] {
    return this.items;
  }

  private build(): void {
    // Layout constants
    const M = 24;                   // outer margin
    const TITLE_H = 48;             // reserved height for title row
    const PANEL_RADIUS = 12;
    const ROW_H = 96;               // row height
    const ICON = 56;                // icon (placeholder) size
    const GAP_X = 16;               // space between icon and text
    const innerPad = 16;

    const root = this.getGroup();

    // Frame
    const panel = new Konva.Rect({
      x: M,
      y: TITLE_H + M,
      width: STAGE_WIDTH - M * 2,
      height: STAGE_HEIGHT - (TITLE_H + M * 2),
      fill: "#f5f5f5",
      cornerRadius: PANEL_RADIUS,
      stroke: "#ddd",
      strokeWidth: 1,
    });

    const title = new Konva.Text({
      x: M,
      y: 12,
      text: "Rules",
      fontSize: 36,
      fontStyle: "bold",
      fontFamily: "Inter, system-ui, sans-serif",
      fill: "#111827",
    });

    // Back (top-right)
    const backX = STAGE_WIDTH - M - 96;
    this.backBtn = this.makeButton(backX, 12, 96, 36, "Back");

    // Viewport (scrollable)
    const clipW = panel.width() - innerPad * 2;
    const clipH = panel.height() - innerPad * 2;
    const viewport = new Konva.Group({
      x: panel.x() + innerPad,
      y: panel.y() + innerPad,
      clip: { x: 0, y: 0, width: clipW, height: clipH },
    });

    // Build items
    const makeItem = (i: number, color: string, copy: string) => {
      const item = new RulesItem(
        {
          top: i * ROW_H,
          iconSize: ICON,
          color,
          gapX: GAP_X,
          rowWidth: clipW,
          rowHeight: ROW_H,
        },
        copy
      );
      this.items.push(item);
      item.addTo(viewport);
    };

    makeItem(0, "#d0b48f", "Play the Wood mini-game to collect WOOD. Wood is required to construct many buildings.");
    makeItem(1, "#bcc2c9", "Play the Rock mini-game to collect STONE. Stone is used for sturdier structures and upgrades.");
    makeItem(2, "#c9d6f0", "Construct buildings when you have enough resources. Solve area/perimeter word problems correctly to confirm your build.");

    // Scroll (only if needed)
    const totalContentH = this.items.length * ROW_H;
    const maxScroll = Math.max(0, totalContentH - clipH);
    viewport.on("wheel", (e) => {
      e.evt.preventDefault();
      const delta = e.evt.deltaY;
      const baseY = panel.y() + innerPad;
      let newY = viewport.y() - delta;
      newY = Math.max(baseY - maxScroll, Math.min(baseY, newY));
      viewport.y(newY);
      root.getLayer()?.batchDraw();
    });

    root.add(panel, title, this.backBtn, viewport);
  }

  private makeButton(x: number, y: number, w: number, h: number, label: string): Konva.Group {
    const g = new Konva.Group({ x, y });
    const r = new Konva.Rect({
      width: w,
      height: h,
      cornerRadius: 10,
      fill: "#111827",
      opacity: 0.95,
      shadowColor: "black",
      shadowBlur: 2,
      shadowOpacity: 0.15,
      shadowOffset: { x: 0, y: 1 },
    });
    const t = new Konva.Text({
      x: 0, y: 0, width: w, height: h,
      align: "center", verticalAlign: "middle",
      text: label, fontSize: 16,
      fontFamily: "Inter, system-ui, sans-serif",
      fill: "white",
    });
    g.add(r, t);
    g.on("mouseenter", () => (document.body.style.cursor = "pointer"));
    g.on("mouseleave", () => (document.body.style.cursor = "default"));
    return g;
  }
}
