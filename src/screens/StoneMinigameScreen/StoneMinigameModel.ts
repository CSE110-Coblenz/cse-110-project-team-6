export type RockType = "tier1" | "tier2" | "tier3";
export type ToolType = "pickaxe" | "drill" | "dynamite";

export type Rock = {
  id: string;
  type: RockType;
  x: number;
  y: number;
  mined: boolean;
};

export class StoneMinigameModel {
  public rocks: Rock[] = [];
  public tools = { pickaxe: 0, drill: 0, dynamite: 0 };
  public rockCounts = { tier1: 0, tier2: 0, tier3: 0 };
  public selectedTool: "pickaxe" | "drill" | "dynamite" | null = null;
  public stoneCollected = 0;
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
   * - randomizes number of rocks and their positions
   * - randomizes number of tools available
   * - resets counters and timer
   */
  public generateRandomState(stageWidth: number, stageHeight: number) {
    // reset
    this.rocks = [];
    this.stoneCollected = 0;
    this.selectedTool = null;
    this.timerSeconds = 30;

    // Randomize counts (example ranges - tweak as desired)
    this.rockCounts.tier1 = this.randRange(3, 6);
    this.rockCounts.tier2 = this.randRange(2, 5);
    this.rockCounts.tier3 = this.randRange(1, 4);

    this.tools.pickaxe = this.randRange(1, 6);
    this.tools.drill = this.randRange(1, 5);
    this.tools.dynamite = this.randRange(1, 4);

    // Defining rock sizes (approximate based on image dimensions)
    const rockSizes: Record<RockType, number> = {
      tier1: 60,
      tier2: 90,
      tier3: 120,
    }

    // Build rock list with random positions within a safe margin
    const margin = 120;
    const topMargin = 130;
    const leftMargin = 170;
    const bottomMargin = 150;
    const rightMargin = 180;

    // Build rocks list in collision-free positions
    const allRocks: Rock[] = [];

    const isPositionValid = (x: number, y: number, size: number): boolean => {
      // checks is position is any of the UI zones
      if (x - size / 2 < leftMargin) return false;
      if (x + size / 2 > stageWidth - rightMargin) return false;
      if (y - size / 2 < topMargin) return false;
      if (y + size / 2 > stageHeight - bottomMargin) return false;

      // Check collision with existing rocks
      for (const rock of allRocks) {
        const existingSize = rockSizes[rock.type];
        const minDistance = (size + existingSize) / 2 + 50; // +50 is the buffer of extra space between stones
        const distance = Math.sqrt(Math.pow(x-rock.x, 2) + Math.pow(y - rock.y, 2));

        if (distance < minDistance) {
          return false
        }
      }

      return true;
    }

    const placeRock = (type: RockType, count: number) => {
      const size = rockSizes[type];

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
          allRocks.push({
            id: `${type}-${Date.now()}-${i}-${Math.floor(Math.random() * 10000)}`,
            type,
            x,
            y,
            mined: false,
          });
        } else {
          console.warn(`Could not find valid position for rock of type ${type}`);
        }

      }
    };

    // Place rocks in order from largest to smallest (easier to fit smaller rocks around larger rocks)
    placeRock("tier3", this.rockCounts.tier3);
    placeRock("tier2", this.rockCounts.tier2);
    placeRock("tier1", this.rockCounts.tier1);

    // shuffle so they appear mixed visually
    this.rocks = this.shuffle(allRocks);
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

  public selectTool(tool: "pickaxe" | "drill" | "dynamite" | null) {
    this.selectedTool = tool;
  }

  /**
   * Attempt to mine a rock. Returns result with success + gained amount.
   * Also decrements appropriate tool count if used.
   */
  public tryMineRock(rockId: string): { success: boolean; gained: number; reason?: string } {
    const rock = this.rocks.find(r => r.id === rockId);
    if (!rock) return { success: false, gained: 0, reason: "not_found" };
    if (rock.mined) return { success: false, gained: 0, reason: "already_mined" };
    if (!this.selectedTool) return { success: false, gained: 0, reason: "no_tool_selected" };

    const mapping: Record<RockType, { tool: ToolType; min: number; max: number; toolKey: ToolType }> = {
      tier1: { tool: "pickaxe", min: 5, max: 10, toolKey: "pickaxe" },
      tier2: { tool: "drill", min: 12, max: 20, toolKey: "drill" },
      tier3: { tool: "dynamite", min: 25, max: 30, toolKey: "dynamite" },
    };

    const info = mapping[rock.type];
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
    this.stoneCollected += gained;
    rock.mined = true;

    // Decrement the rock count of that tier
    this.rockCounts[rock.type] -= 1;

    return { success: true, gained };
  }

  public isFinished(): boolean {
    return this.timerSeconds <= 0 || this.hasNoMoreMoves();
  }
  
  public hasNoMoreMoves(): boolean {
    // check if all tool counts are at zero
    const hasAnyTools = this.tools.pickaxe > 0 || this.tools.drill > 0 || this.tools.dynamite > 0;
    if (!hasAnyTools) return true;

    // check if there are any unmined rocks remaining
    const hasUnminedRocks = this.rocks.some(r => !r.mined);
    if (!hasUnminedRocks) return true;

    // check if player has the right tools for remaining rocks
    const unminedRocks = this.rocks.filter(rock => !rock.mined);
    const canMineAny = unminedRocks.some(rock => {
      if (rock.type === "tier1" && this.tools.pickaxe > 0) return true;
      if (rock.type === "tier2" && this.tools.drill > 0) return true;
      if (rock.type === "tier3" && this.tools.dynamite > 0) return true;
      return false;
    });

    return !canMineAny;
  }

  public getEndGameReason(): string {
    if (this.timerSeconds <= 0) return "Time is up!";
    if (this.tools.pickaxe === 0 && this.tools.drill === 0 && this.tools.dynamite === 0) return "Out of tools!";
    if (this.rocks.every(rock => rock.mined)) return "All rocks mined!";
    return "No mathcing tools for remaning rocks!";
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