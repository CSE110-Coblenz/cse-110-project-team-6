export type TreeType = "tier1" | "tier2" | "tier3";
export type ToolType = "saw" | "axe" | "chainsaw";

export type Tree = {
  id: string;
  type: TreeType;
  x: number;
  y: number;
  chopped: boolean;
};

export class WoodMinigameModel {
  public trees: Tree[] = [];
  public tools = { saw: 0, axe: 0, chainsaw: 0 };
  public treeCounts = { tier1: 0, tier2: 0, tier3: 0 };
  public selectedTool: "saw" | "axe" | "chainsaw" | null = null;
  public woodCollected = 0;
  private timerSeconds = 30;
  private gameStarted = false;

  constructor() {}

  public startGame() {
    this.gameStarted = true;
  }

  public isGameStarted(): boolean {
    return this.gameStarted;
  }

  /**
   * Generates a new random game state.
   * - randomizes number of trees and their positions
   * - randomizes number of tools available
   * - resets counters and timer
   */
  public generateRandomState(stageWidth: number, stageHeight: number) {
    // reset
    this.trees = [];
    this.woodCollected = 0;
    this.selectedTool = null;
    this.timerSeconds = 30;

    // Randomize counts (example ranges - tweak as desired)
    this.treeCounts.tier1 = this.randRange(3, 6);
    this.treeCounts.tier2 = this.randRange(2, 5);
    this.treeCounts.tier3 = this.randRange(1, 4);

    this.tools.saw = this.randRange(1, 6);
    this.tools.axe = this.randRange(1, 5);
    this.tools.chainsaw = this.randRange(1, 4);
    // Defining tree sizes (approximate based on image dimensions)
    const treeSizes: Record<TreeType, number> = {
      tier1: 70,
      tier2: 100,
      tier3: 130,
    }

    // Build rock list with random positions within a safe margin
    const margin = 120;
    const topMargin = 130;
    const leftMargin = 170;
    const bottomMargin = 150;
    const rightMargin = 180;

    // Build trees list in collision-free positions
    const allTrees: Tree[] = [];

    const isPositionValid = (x: number, y: number, size: number): boolean => {
      // checks is position is any of the UI zones
      if (x - size / 2 < leftMargin) return false;
      if (x + size / 2 > stageWidth - rightMargin) return false;
      if (y - size / 2 < topMargin) return false;
      if (y + size / 2 > stageHeight - bottomMargin) return false;

      // Check collision with existing trees
      for (const tree of allTrees) {
        const existingSize = treeSizes[tree.type];
        const minDistance = (size + existingSize) / 2 + 50; // +50 is the buffer of extra space between stones
        const distance = Math.sqrt(Math.pow(x-tree.x, 2) + Math.pow(y - tree.y, 2));

        if (distance < minDistance) {
          return false
        }
      }

      return true;
    }

    const placeTree = (type: TreeType, count: number) => {
      const size = treeSizes[type];

      for (let i = 0; i < count; i++) {
        let attempts = 0;
        let x, y;

        do {
          x = this.randRange(margin, stageWidth - margin);
          y = this.randRange(margin, stageHeight - margin);
          attempts++;;
        } while (!isPositionValid(x, y, size) && attempts < 100);

        // If we find a valid postion, place the rock at position
        if (attempts < 100) {
          allTrees.push({
            id: `${type}-${Date.now()}-${i}-${Math.floor(Math.random() * 10000)}`,
            type,
            x,
            y,
            chopped: false,
          });
        } else {
          console.warn(`Could not find valid position for tree of type ${type}`);
        }

      }
    };

    // Place trees in order from largest to smallest (easier to fit smaller trees around larger trees)
    placeTree("tier3", this.treeCounts.tier3);
    placeTree("tier2", this.treeCounts.tier2);
    placeTree("tier1", this.treeCounts.tier1);

    // shuffle so they appear mixed visually
    this.trees = this.shuffle(allTrees);
  }

  public getTimer(): number {
    return this.timerSeconds;
  }

  public tickTimer(): number {
    if (this.timerSeconds > 0) {
      this.timerSeconds -= 1;
    }
    return this.timerSeconds;
  }

  public selectTool(tool: "saw" | "axe" | "chainsaw" | null) {
    this.selectedTool = tool;
  }

  /**
   * Attempt to chop a tree. Returns result with success + gained amount.
   * Also decrements appropriate tool count if used.
   */
  public tryChopTree(treeId: string): { success: boolean; gained: number; reason?: string } {
    const tree = this.trees.find(t => t.id === treeId);
    if (!tree) return { success: false, gained: 0, reason: "not_found" };
    if (tree.chopped) return { success: false, gained: 0, reason: "already_chopped" };
    if (!this.selectedTool) return { success: false, gained: 0, reason: "no_tool_selected" };

    const mapping: Record<TreeType, { tool: ToolType; min: number; max: number; toolKey: ToolType }> = {
      tier1: { tool: "saw", min: 5, max: 10, toolKey: "saw" },
      tier2: { tool: "axe", min: 12, max: 20, toolKey: "axe" },
      tier3: { tool: "chainsaw", min: 25, max: 30, toolKey: "chainsaw" },
    };

    const info = mapping[tree.type];
    if (this.selectedTool !== info.tool) {
      return { success: false, gained: 0, reason: "wrong_tool" };
    }

    // Check if tool available
    const toolKey = info.toolKey;
    if (this.tools[toolKey] <= 0) {
      return { success: false, gained: 0, reason: "no_tool_count" };
    }

    // Use tool
    this.tools[toolKey] -= 1;

    // Award randomized stones in range
    const gained = this.randRange(info.min, info.max);
    this.woodCollected += gained;
    tree.chopped = true;

    // Decrement the tree count of that tier
    this.treeCounts[tree.type] -= 1;

    return { success: true, gained };
  }

  public isFinished(): boolean {
    return this.timerSeconds <= 0 || this.hasNoMoreMoves();
  }
  
  public hasNoMoreMoves(): boolean {
    // check if all tool counts are at zero
    const hasAnyTools = this.tools.saw > 0 || this.tools.axe > 0 || this.tools.chainsaw > 0;
    if (!hasAnyTools) return true;

    // check if there are any unchopped trees remaining
    const hasUnchoppedTrees = this.trees.some(t => !t.chopped);
    if (!hasUnchoppedTrees) return true;

    // check if player has the right tools for remaining trees
    const unchoppedTrees = this.trees.filter(tree => !tree.chopped);
    const canChopAny = unchoppedTrees.some(tree => {
      if (tree.type === "tier1" && this.tools.saw > 0) return true;
      if (tree.type === "tier2" && this.tools.axe > 0) return true;
      if (tree.type === "tier3" && this.tools.chainsaw > 0) return true;
      return false;
    });

    return !canChopAny;
  }

  public getEndGameReason(): string {
    if (this.timerSeconds <= 0) return "Time is up!";
    if (this.tools.saw === 0 && this.tools.axe === 0 && this.tools.chainsaw === 0) return "Out of tools!";
    if (this.trees.every(tree => tree.chopped)) return "All trees chopped!";
    return "No matching tools for remaining trees!";
  }

  // helpers
  private randRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j]!, arr[i]!];
    }
    return arr;
  }
}