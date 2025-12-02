import Konva from "konva";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import { View } from "../../types.ts";

/** Single row in the rules list: an icon + a text block */
class RulesItem {
  private icon?: Konva.Image;
  private text: Konva.Text;
  private itemGroup: Konva.Group;

  constructor(opts: {
    top: number;
    iconSize: number;
    imagePath: string;
    gapX: number;
    rowWidth: number;
  }, copy: string) {
    const { top, iconSize, imagePath, gapX, rowWidth } = opts;

    // Create a group for the entire item
    this.itemGroup = new Konva.Group({
      x: 0,
      y: top,
    });

    // Load image asynchronously - same pattern as InventoryItem
    Konva.Image.fromURL(
      imagePath, (img) => {
        this.icon = img;
        this.icon.width(iconSize);
        this.icon.height(iconSize);
        this.icon.x(8);
        this.icon.y(8); // Align with text top
        this.itemGroup.add(this.icon);
        this.itemGroup.getLayer()?.batchDraw();
      }
    );

    this.text = new Konva.Text({
      x: 8 + iconSize + gapX,
      y: 8, // Start from top with padding
      width: rowWidth - (8 + iconSize + gapX) - 8,
      text: copy,
      fontSize: 20,
      lineHeight: 1.3,
      fontFamily: "Inter, system-ui, sans-serif",
      fill: "#111827",
      wrap: "word",
      align: "left",
      ellipsis: false, // Don't truncate with ellipsis
    });
    this.itemGroup.add(this.text);
  }

  addTo(group: Konva.Group) {
    group.add(this.itemGroup);
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

  private makeItem(i: number, rowHeight: number, iconSize: number, gapX: number, rowWidth: number, imagePath: string, copy: string, viewport: Konva.Group): void {
    const item = new RulesItem(
      {
        top: i * rowHeight,
        iconSize,
        imagePath,
        gapX,
        rowWidth,
      },
      copy
    );
    this.items.push(item);
    item.addTo(viewport);
  }

  private build(): void {
    // Layout constants
    const M = 24;                   // outer margin
    const TITLE_H = 48;             // reserved height for title row
    const PANEL_RADIUS = 12;
    const ROW_H = 140;              // row height (increased for wrapped text)
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

    // Build items - using relative paths from root assets folder (same pattern as MainGameView)
    this.makeItem(0, ROW_H, ICON, GAP_X, clipW, "../../assets/inventory/wood.png", "Play the Wood mini-game to collect WOOD. Wood is required to construct many buildings.", viewport);
    this.makeItem(1, ROW_H, ICON, GAP_X, clipW, "../../assets/inventory/stone.png", "Play the Rock mini-game to collect STONE. Stone is used for sturdier structures and upgrades.", viewport);
    this.makeItem(2, ROW_H, ICON, GAP_X, clipW, "../../assets/buildings/icons/apartment.png", "Construct buildings when you have enough resources. Solve area/perimeter word problems correctly to confirm your build.", viewport);

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
    return g;
  }
}