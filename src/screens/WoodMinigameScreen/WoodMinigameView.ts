import Konva from "konva";
import { View, Color } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import type { Tree } from "./WoodMinigameModel.ts";
import { Assets } from "../../assets.ts";

type TreeClickHandler = (TreeId: string) => void;
type ToolSelectHandler = (tool: "saw" | "axe" | "chainsaw" | null) => void;
type VoidHandler = () => void;

export class WoodMinigameView extends View {
     // UI handles so that controller can attach logic
        public backButton: Konva.Group;
        private startButton!: Konva.Group;
        private startHandler?: VoidHandler;
        private endGameOverlay!: Konva.Group;
    
        private treeGroup: Konva.Group;
        private timerText: Konva.Text;
        private toolGroups: Record<string, Konva.Group> = {};
        private treeImages: Map<string, Konva.Image> = new Map();
        public woodCollectedText: Konva.Text;
        private tier1Img!: HTMLImageElement;
        private tier2Img!: HTMLImageElement;
        private tier3Img!: HTMLImageElement;
        private toolSawImg!: HTMLImageElement;
        private toolAxeImg!: HTMLImageElement;
        private toolChainsawImg!: HTMLImageElement;
        private woodIconImg!: HTMLImageElement;
    
        // events
        private treeClickHandler?: TreeClickHandler;
        private toolSelectHandler?: ToolSelectHandler;
        private backHandler?: VoidHandler;
    
        constructor() {
            super();
    
           
            this.tier1Img = Assets["/assets/icons/tier1Tree.png"]!;
            this.tier2Img = Assets["/assets/icons/tier2Tree.png"]!;
            this.tier3Img = Assets["/assets/icons/tier3Tree.png"]!;
    
            this.toolSawImg = Assets["/assets/inventory/saw.png"]!;
            this.toolAxeImg = Assets["/assets/inventory/axe.png"]!;
            this.toolChainsawImg = Assets["/assets/inventory/chainsaw1.png"]!;
            this.woodIconImg = Assets["/assets/inventory/wood.png"]!;
    
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
    
            // Tree Types Count Panel (top left)
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
                text: "Trees:",
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
            const toolNames: Array<{ key: "saw" | "axe" | "chainsaw"; label: string }> = [
              { key: "saw", label: "Saw" },
              { key: "axe", label: "Axe" },
              { key: "chainsaw", label: "Chainsaw" },
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
                t.key === "saw"
                  ? this.toolSawImg
                  : t.key === "axe"
                  ? this.toolAxeImg
                  : this.toolChainsawImg;
    
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
            
    
            // Wood Collected Display (bottom right)
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
                text: "Wood Collected",
                fontSize: 14,
                fontFamily: "Calibri",
                fill: Color.Black,
                x: 0,
                y: 95,
                width: 100,
                align: "center",
            });
            // 
            const woodIcon = new Konva.Image({
              image: this.woodIconImg,
              x: 42,
              y: 5,
              width: 50,
              height: 50,
              offsetX: 20,
              name: "wood-icon",
            })
            collectedGroup.add(collectedBox);
            collectedGroup.add(collectedText);
            collectedGroup.add(collectedLabel);
            //
            collectedGroup.add(woodIcon);
    
            root.add(collectedGroup);
    
            this.woodCollectedText = collectedText;
    
            // Group for trees
            this.treeGroup = new Konva.Group();
            root.add(this.treeGroup);
    
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
        public onTreeClick(fn: TreeClickHandler) {
            this.treeClickHandler = fn;
        }
        public onToolSelect(fn: ToolSelectHandler) {
            this.toolSelectHandler = fn;
        }
        public onBack(fn: VoidHandler) {
            this.backHandler = fn;
        }
    
    
        // ---- Rendering helpers used by controller ----
        public renderTrees(trees: Tree[]) {
        // clear existing
        this.treeGroup.destroyChildren();
        this.treeImages.clear();
    
        trees.forEach((r) => {
          if (r.chopped) return;
    
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
          (icon as any).treeId = r.id;
    
          // click handling (emit up to controller)
          icon.on("click", (evt) => {
            const id = (evt.target as any).treeId;
            if (id) this.treeClickHandler?.(id);
          });
    
          this.treeGroup.add(icon);
          this.treeImages.set(r.id, icon);
        });
    
        this.treeGroup.getLayer()?.batchDraw();
      }
    
      public removeTree(treeId: string) {
        const node = this.treeImages.get(treeId);
        if (!node) return;
        node.destroy();
        this.treeImages.delete(treeId);
        this.treeGroup.getLayer()?.batchDraw();
      }
    
      public updateTimer(seconds: number) {
        this.timerText.text(`Time Left: ${seconds}s`);
        // center
        this.timerText.x(STAGE_WIDTH / 2 - this.timerText.width() / 2);
        this.timerText.getLayer()?.batchDraw();
      }
    
      public updateWoodCollected(amount: number) {
        this.woodCollectedText.text(amount.toString());
        this.woodCollectedText.getLayer()?.batchDraw();
      }
    
      public updateToolCounts(tools: { saw: number; axe: number; chainsaw: number }) {
        (this.toolGroups["saw"] as any).labelText.text(`Saw\nCount: ${tools.saw}`);
        (this.toolGroups["axe"] as any).labelText.text(`Axe\nCount: ${tools.axe}`);
        (this.toolGroups["chainsaw"] as any).labelText.text(`Chainsaw\nCount: ${tools.chainsaw}`);
        this.getGroup().getLayer()?.batchDraw();
      }
    
      public updateTreeCounts(counts: { tier1: number; tier2: number; tier3: number }) {
      const tier1 = this.getGroup().findOne("#tier1-count") as Konva.Text;
      const tier2 = this.getGroup().findOne("#tier2-count") as Konva.Text;
      const tier3 = this.getGroup().findOne("#tier3-count") as Konva.Text;
    
      tier1.text(`Tier1: ${counts.tier1}`);
      tier2.text(`Tier2: ${counts.tier2}`);
      tier3.text(`Tier3: ${counts.tier3}`);
    
      this.getGroup().getLayer()?.batchDraw();
    }
    
      public highlightSelectedTool(tool: "saw" | "axe" | "chainsaw" | null) {
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
