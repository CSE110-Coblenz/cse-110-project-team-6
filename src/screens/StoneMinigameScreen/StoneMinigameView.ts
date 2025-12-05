import Konva from "konva";
import { View, Color } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import type { Rock } from "./StoneMinigameModel.ts";
import { Assets } from "../../assets.ts";

type RockClickHandler = (rockId: string) => void;
type ToolSelectHandler = (tool: "pickaxe" | "drill" | "dynamite" | null) => void;
type VoidHandler = () => void;

export class StoneMinigameView extends View {

    // UI handles so that controller can attach logic
    public backButton: Konva.Group;
    private startButton!: Konva.Group;
    private startHandler?: VoidHandler;
    private endGameOverlay!: Konva.Group;

    private rockGroup: Konva.Group;
    private timerText: Konva.Text;
    private toolGroups: Record<string, Konva.Group> = {};
    private rockImages: Map<string, Konva.Image> = new Map();
    public stoneCollectedText: Konva.Text;
    private tier1Img!: HTMLImageElement;
    private tier2Img!: HTMLImageElement;
    private tier3Img!: HTMLImageElement;
    private toolPickaxeImg!: HTMLImageElement;
    private toolDrillImg!: HTMLImageElement;
    private toolDynamiteImg!: HTMLImageElement;
    private stoneIconImg!: HTMLImageElement;

    // events
    private rockClickHandler?: RockClickHandler;
    private toolSelectHandler?: ToolSelectHandler;
    private backHandler?: VoidHandler;

    constructor() {
        super();

       
        this.tier1Img = Assets["/assets/icons/Tier1Rock.png"]!;
        this.tier2Img = Assets["/assets/icons/Tier2Rock.png"]!;
        this.tier3Img = Assets["/assets/icons/Tier3Rock.png"]!;

        this.toolPickaxeImg = Assets["/assets/inventory/pickaxe.png"]!;
        this.toolDrillImg = Assets["/assets/inventory/drill.png"]!;
        this.toolDynamiteImg = Assets["/assets/inventory/dynamite.png"]!;
        this.stoneIconImg = Assets["/assets/inventory/stone.png"]!;

        const root = this.getGroup();

        // Background (to be changed)
        const bg = new Konva.Rect({
            x: 0,
            y: 0,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            fill: "#8B6A4B",
        });
        root.add(bg);

        // Timer at top center
        this.timerText = new Konva.Text({
            text: "Time Left: 30s",
            x: STAGE_WIDTH / 2,
            y: 50,
            fontSize: 20,
            fontFamily: "Calibri",
            fill: Color.White,
        });
        
        this.timerText.offsetX(this.timerText.width() / 2 - 50);
        root.add(this.timerText);
        

        // Back button top-right
        this.backButton = new Konva.Group({
            x: STAGE_WIDTH - 120,
            y: 12,
        });
        const backRect = new Konva.Rect({
            width: 100,
            height: 36,
            cornerRadius: 6,
            fill: Color.GreyBlue,
        });
        const backText = new Konva.Text({
        text: "Back",
        fontSize: 16,
        fontFamily: "Calibri",
        fill: Color.White,
        width: 100,
        align: "center",
        y: 8,
        });
        backText.offsetX(backText.width() / 2);
        backText.x(50);
        this.backButton.add(backRect);
        this.backButton.add(backText);
        
        // visual hover effect
        this.backButton.on("mouseenter", () => {
            backRect.fill(Color.LightBlue);
            this.backButton.getLayer()?.draw();
        });
        this.backButton.on("mouseleave", () => {
            backRect.fill(Color.GreyBlue);
            this.backButton.getLayer()?.draw();
        });
        root.add(this.backButton);

        // Rock Types Count Panel (top left)
        const countsGroup = new Konva.Group({ x: 20, y: 50 });
        
        const countsBox = new Konva.Rect({ 
          width: 100, 
          height: 110, 
          fill: Color.GreyBlue, 
          cornerRadius: 6, 
          opacity: 0.8 
        });
        countsGroup.add(countsBox);

        const countsTitle = new Konva.Text({
            x: 25,
            y: 5,
            text: "Rocks:",
            fontSize: 18,
            fontFamily: "Calibri",
            fill: Color.White,
        });
        countsGroup.add(countsTitle);

        const tier1Count = new Konva.Text({
            x: 23,
            y: 30,
            text: "Small: 0",
            fontSize: 16,
            fontFamily: "Calibri",
            fill: Color.White,
            id: "tier1-count",
        });
        const tier2Count = new Konva.Text({
            x: 23,
            y: 50,
            text: "Medium: 0",
            fontSize: 16,
            fontFamily: "Calibri",
            fill: Color.White,
            id: "tier2-count",
        });
        const tier3Count = new Konva.Text({
            x: 23,
            y: 70,
            text: "Large: 0",
            fontSize: 16,
            fontFamily: "Calibri",
            fill: Color.White,
            id: "tier3-count",
        });
        countsGroup.add(tier1Count, tier2Count, tier3Count);
        root.add(countsGroup);

        // Tools Selection Panel (bottom left)
        const toolsGroup = new Konva.Group({ x: 20, y: STAGE_HEIGHT - 120 });
        const toolNames: Array<{ key: "pickaxe" | "drill" | "dynamite"; label: string }> = [
          { key: "pickaxe", label: "Pickaxe" },
          { key: "drill", label: "Drill" },
          { key: "dynamite", label: "Dynamite" },
        ];

        toolNames.forEach((t, idx) => {
          const g = new Konva.Group({
            x: idx * 150,
            y: 0,
            name: `tool-${t.key}`,
          });

          // Background box
          const rect = new Konva.Rect({
            width: 140,
            height: 75,
            cornerRadius: 10,
            fill: "#5b5b5b",
            opacity: 0.9,
            stroke: "#444",
            strokeWidth: 2,
          });

          // Tool icon
          const iconImg =
            t.key === "pickaxe"
              ? this.toolPickaxeImg
              : t.key === "drill"
              ? this.toolDrillImg
              : this.toolDynamiteImg;

          const icon = new Konva.Image({
            image: iconImg,
            x: 10,
            y: 12,
            width: 48,
            height: 48,
          });

          // Count text
          const text = new Konva.Text({
            text: `${t.label}\nCount: 0`,
            fontSize: 16,
            fontFamily: "Calibri",
            fill: Color.White,
            x: 70,
            y: 20,
          });

          // Build the group
          g.add(rect);
          g.add(icon);
          g.add(text);

          // Store references for dynamic UI updates
          (g as any).rect = rect;
          (g as any).labelText = text;

          // Let controller select tool
          g.on("click", () => this.toolSelectHandler?.(t.key));

          this.toolGroups[t.key] = g;
          toolsGroup.add(g);
        });

        root.add(toolsGroup);
        

        // Stone Collected Display (bottom right)
        const collectedGroup = new Konva.Group({ x: STAGE_WIDTH - 140, y: STAGE_HEIGHT - 140 });
        const collectedBox = new Konva.Rect({ width: 100, height: 120, fill: "#e9e9e9", cornerRadius: 6 });
        const collectedText = new Konva.Text({
            text: "0",
            fontSize: 28,
            fontFamily: "Calibri",
            fill: Color.Black,
            x: 35,
            y: 60,
        });
        const collectedLabel = new Konva.Text({
            text: "Stone Collected",
            fontSize: 14,
            fontFamily: "Calibri",
            fill: Color.Black,
            x: 0,
            y: 95,
            width: 100,
            align: "center",
        });
        // 
        const stoneIcon = new Konva.Image({
          image: this.stoneIconImg,
          x: 42,
          y: 5,
          width: 50,
          height: 50,
          offsetX: 20,
          name: "stone-icon",
        })
        collectedGroup.add(collectedBox);
        collectedGroup.add(collectedText);
        collectedGroup.add(collectedLabel);
        //
        collectedGroup.add(stoneIcon);

        root.add(collectedGroup);

        this.stoneCollectedText = collectedText;

        // Group for rocks
        this.rockGroup = new Konva.Group();
        root.add(this.rockGroup);

        // Hook up back/settings clicks to handlers (controller will call set handlers)
        this.backButton.on("click", () => this.backHandler?.());

         // Create start button (shown at beginning of game)
        this.startButton = new Konva.Group({
          x: STAGE_WIDTH / 2,
          y: STAGE_HEIGHT / 2,
          visible: false, // initially hidden
        })

        const startBg = new Konva.Rect({
          width: 200,
          height: 80,
          offsetX: 100,
          offsetY: 40,
          fill: Color.Green,
          stroke: Color.White,
          cornerRadius: 10,
        });

        const startText = new Konva.Text({
          text: "START",
          y: 20,
          fontSize: 32,
          fontFamily: "Calibri",
          fill: Color.White,
          width: 200, 
          offsetX: 100,
          offsetY: 40,
          align: "center",
          verticalAlign: "middle",
        });

        this.startButton.add(startBg);
        this.startButton.add(startText);

        // start button hover effect
        this.startButton.on("mouseenter", () => {
          startBg.fill(Color.Lime);
          this.startButton.getLayer()?.draw();
        });
        this.startButton.on("mouseleave", () => {
          startBg.fill(Color.Green);
          this.startButton.getLayer()?.draw();
        });

        root.add(this.startButton);

        // Create end-game overlay
        this.endGameOverlay = new Konva.Group({
            visible: false,
        });

        const overlayBg = new Konva.Rect({
            x: 0,
            y: 0,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            fill: "black",
            opacity: 0.7,
        });

        const resultBox = new Konva.Rect({
            x: STAGE_WIDTH / 2 - 200,
            y: STAGE_HEIGHT / 2 - 150,
            width: 400,
            height: 300,
            fill: Color.White,
            cornerRadius: 10,
            stroke: Color.DarkGreyBlue,
            strokeWidth: 3,
        });

        const resultTitle = new Konva.Text({
            text: "Game Over!",
            x: STAGE_WIDTH / 2 - 200,
            y: STAGE_HEIGHT / 2 - 120,
            width: 400,
            fontSize: 36,
            fontFamily: "Calibri",
            fill: Color.DarkGreyBlue,
            align: "center",
        });

        const resultReason = new Konva.Text({
            text: "",
            x: STAGE_WIDTH / 2 - 200,
            y: STAGE_HEIGHT / 2 - 60,
            width: 400,
            fontSize: 24,
            fontFamily: "Calibri",
            fill: Color.Black,
            align: "center",
            name: "result-reason",
        });

        this.endGameOverlay.add(overlayBg);
        this.endGameOverlay.add(resultBox);
        this.endGameOverlay.add(resultTitle);
        this.endGameOverlay.add(resultReason);
        root.add(this.endGameOverlay);

        // Handle start button click
        this.startButton.on("click", () => {
          this.startHandler?.();
        });



    }

    // Start of game event handlers
    public onStart(fn: VoidHandler) {
      this.startHandler = fn;
    }

    // show start button
    public showStartButton() {
      this.startButton.visible(true);
      this.getGroup().getLayer()?.batchDraw();
    }

    // Hide start button
    public hideStartButton() {
      this.startButton.visible(false);
      this.getGroup().getLayer()?.batchDraw();
    }

    // show end-game overlay with reason
    public showEndGame(reason: string) {
      const reasonText = this.endGameOverlay.findOne(".result-reason") as Konva.Text;
      reasonText.text(reason);
      this.endGameOverlay.visible(true);
      this.getGroup().getLayer()?.batchDraw();
    }

    // hide end-game overlay
    public hideEndGame() {
      this.endGameOverlay.visible(false);
      this.getGroup().getLayer()?.batchDraw();
    }

    // ---- Event registration (controller uses these) ----
    public onRockClick(fn: RockClickHandler) {
        this.rockClickHandler = fn;
    }
    public onToolSelect(fn: ToolSelectHandler) {
        this.toolSelectHandler = fn;
    }
    public onBack(fn: VoidHandler) {
        this.backHandler = fn;
    }


    // ---- Rendering helpers used by controller ----
    public renderRocks(rocks: Rock[]) {
    // clear existing
    this.rockGroup.destroyChildren();
    this.rockImages.clear();

    rocks.forEach((r) => {
      if (r.mined) return;

      let imgElement: HTMLImageElement = this.tier1Img; //default

      switch (r.type) {
        case "tier1":
          imgElement = this.tier1Img;
          break;
        case "tier2":
          imgElement = this.tier2Img;
          break;
        case "tier3":
          imgElement = this.tier3Img;
          break;
      }

      const icon = new Konva.Image({
        image: imgElement,
        x: r.x,
        y: r.y,
        offsetX: imgElement.naturalWidth / 2,
        offsetY: imgElement.naturalHeight / 2,
        listening: true,
      });
       

      // attach id so controller can identify
      (icon as any).rockId = r.id;

      // click handling (emit up to controller)
      icon.on("click", (evt) => {
        const id = (evt.target as any).rockId;
        if (id) this.rockClickHandler?.(id);
      });

      this.rockGroup.add(icon);
      this.rockImages.set(r.id, icon);
    });

    this.rockGroup.getLayer()?.batchDraw();
  }

  public removeRock(rockId: string) {
    const node = this.rockImages.get(rockId);
    if (!node) return;
    node.destroy();
    this.rockImages.delete(rockId);
    this.rockGroup.getLayer()?.batchDraw();
  }

  public updateTimer(seconds: number) {
    this.timerText.text(`Time Left: ${seconds}s`);
    // center
    this.timerText.x(STAGE_WIDTH / 2 - this.timerText.width() / 2);
    this.timerText.getLayer()?.batchDraw();
  }

  public updateStoneCollected(amount: number) {
    this.stoneCollectedText.text(amount.toString());
    this.stoneCollectedText.getLayer()?.batchDraw();
  }

  public updateToolCounts(tools: { pickaxe: number; drill: number; dynamite: number }) {
    (this.toolGroups["pickaxe"] as any).labelText.text(`Pickaxe\nCount: ${tools.pickaxe}`);
    (this.toolGroups["drill"] as any).labelText.text(`Drill\nCount: ${tools.drill}`);
    (this.toolGroups["dynamite"] as any).labelText.text(`Dynamite\nCount: ${tools.dynamite}`);
    this.getGroup().getLayer()?.batchDraw();
  }

  public updateRockCounts(counts: { tier1: number; tier2: number; tier3: number }) {
  const tier1 = this.getGroup().findOne("#tier1-count") as Konva.Text;
  const tier2 = this.getGroup().findOne("#tier2-count") as Konva.Text;
  const tier3 = this.getGroup().findOne("#tier3-count") as Konva.Text;

  tier1.text(`Tier1: ${counts.tier1}`);
  tier2.text(`Tier2: ${counts.tier2}`);
  tier3.text(`Tier3: ${counts.tier3}`);

  this.getGroup().getLayer()?.batchDraw();
}

  public highlightSelectedTool(tool: "pickaxe" | "drill" | "dynamite" | null) {
    // visual highlight with stroke
    Object.keys(this.toolGroups).forEach((k) => {
      const g = this.toolGroups[k] as Konva.Group;
      const rect = (g as any).rect as Konva.Rect;
      if (k === tool) {
        rect.stroke("#FFD700");
        rect.strokeWidth(4);
      } else {
        rect.stroke(null);
      }
    });
    this.getGroup().getLayer()?.batchDraw();
  }

}
