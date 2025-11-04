import Konva from "konva";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import type { ScreenSwitch } from "../../types.ts";
import { ScreenType } from "../../types.ts";

/* ---------------- VIEW ---------------- */
class RulesView {
  private group: Konva.Group;
  public backBtn!: Konva.Group;
  public woodBtn!: Konva.Group;
  public stoneBtn!: Konva.Group;

  constructor() {
    this.group = new Konva.Group({ visible: false });
    this.build();
  }

  getGroup(): Konva.Group {
    return this.group;
  }
  show(): void { this.group.visible(true); this.group.getLayer()?.batchDraw(); }
  hide(): void { this.group.visible(false); this.group.getLayer()?.batchDraw(); }

  private build(): void {
    // ---- layout constants (tweak if needed) ----
    const M = 24;                   // outer margin
    const TITLE_H = 48;             // height reserved for page title line
    const PANEL_RADIUS = 12;
    const ROW_H = 96;               // height per rule row
    const ICON = 56;                // placeholder “image” size
    const GAP_X = 16;               // gap between icon and text
    const FOOTER_H = 56;            // footer area inside panel for buttons
    const BTN_W = 190, BTN_H = 40;

    const group = this.group;

    // ---- frame ----
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

    // Back button (top-right, clear of title)
    const backX = STAGE_WIDTH - M - 96;
    this.backBtn = this.makeButton(backX, 12, 96, 36, "Back");

    // ---- scrollable content area (leaves room for footer) ----
    const innerPad = 16;
    const clipW = panel.width() - innerPad * 2;
    const clipH = panel.height() - innerPad * 2 - FOOTER_H; // reserve footer
    const viewport = new Konva.Group({
      x: panel.x() + innerPad,
      y: panel.y() + innerPad,
      clip: { x: 0, y: 0, width: clipW, height: clipH },
    });

    // helper: add a row (icon + text) with consistent rhythm
    const addRow = (rowTop: number, color: string, text: string) => {
      const icon = new Konva.Rect({
        x: 8,
        y: rowTop + (ROW_H - ICON) / 2,
        width: ICON,
        height: ICON,
        fill: color,
        stroke: "#7a7f85",
        cornerRadius: 12,
        opacity: 0.95,
      });

      const txt = new Konva.Text({
        x: 8 + ICON + GAP_X,
        y: rowTop + (ROW_H - 26) / 2, // approx center
        width: clipW - (8 + ICON + GAP_X) - 8,
        text,
        fontSize: 20,
        lineHeight: 1.3,
        fontFamily: "Inter, system-ui, sans-serif",
        fill: "#111827",
      });

      viewport.add(icon, txt);
    };

    // ---- rows ----
    addRow(0 * ROW_H, "#d0b48f", "Play the Wood mini-game to collect WOOD. Wood is required to construct many buildings.");
    addRow(1 * ROW_H, "#bcc2c9", "Play the Rock mini-game to collect STONE. Stone is used for sturdier structures and upgrades.");
    addRow(2 * ROW_H, "#c9d6f0", "Construct buildings when you have enough resources. Solve area/perimeter word problems correctly to confirm your build.");

    // enable wheel scroll if content exceeds the viewport
    const totalRowsH = 3 * ROW_H;
    const maxScroll = Math.max(0, totalRowsH - clipH);
    viewport.on("wheel", (e) => {
      e.evt.preventDefault();
      const delta = e.evt.deltaY;
      const baseY = panel.y() + innerPad;
      let newY = viewport.y() - delta;
      newY = Math.max(baseY - maxScroll, Math.min(baseY, newY));
      viewport.y(newY);
      group.getLayer()?.batchDraw();
    });

    // ---- footer buttons INSIDE the panel ----
    const footerY = panel.y() + panel.height() - FOOTER_H;
    this.woodBtn  = this.makeButton(panel.x() + 8,              footerY + (FOOTER_H - BTN_H) / 2, BTN_W, BTN_H, "Play Wood Mini-game");
    this.stoneBtn = this.makeButton(panel.x() + 8 + BTN_W + 12, footerY + (FOOTER_H - BTN_H) / 2, BTN_W, BTN_H, "Play Rock Mini-game");

    // assemble
    group.add(panel, title, this.backBtn, viewport, this.woodBtn, this.stoneBtn);
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

/* ---------------- CONTROLLER (unchanged shape) ---------------- */
export class RulesController {
  private view: RulesView;
  private screenSwitch: ScreenSwitch;

  constructor(screenSwitch: ScreenSwitch) {
    this.screenSwitch = screenSwitch;
    this.view = new RulesView();

    this.view.backBtn.on("click tap", () =>
      this.screenSwitch.switchScreen({ type: ScreenType.Title })
    );
    this.view.woodBtn.on("click tap", () =>
      this.screenSwitch.switchScreen({ type: ScreenType.WoodMinigame })
    );
    this.view.stoneBtn.on("click tap", () =>
      this.screenSwitch.switchScreen({ type: ScreenType.StoneMinigame })
    );
  }

  getView(): RulesView { return this.view; }
  show(): void { this.view.show(); }
  hide(): void { this.view.hide(); }
}
