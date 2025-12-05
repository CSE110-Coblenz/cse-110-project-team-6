import { WoodMinigameView } from "./WoodMinigameView.ts";
import { WoodMinigameModel } from "./WoodMinigameModel.ts";
import { Controller } from "../../types.ts";
import type { ScreenSwitch } from "../../types.ts";
import { ScreenType } from "../../types.ts";

export class WoodMinigameController extends Controller {
    private view: WoodMinigameView;
    private model: WoodMinigameModel;
    private timerHandle : number | null = null;

    constructor(screenSwitch: ScreenSwitch) {
        super(screenSwitch);

        this.view = new WoodMinigameView();
        this.model = new WoodMinigameModel();

        // wire UI events to controller logic
        this.view.onBack(() => {
            // navigate back to main game
            this.screenSwitch.switchScreen({ type: ScreenType.MainGame });
        });

        this.view.onStart(() => {
            // start the game in model and hide start button in view
            this.model.startGame();
            this.view.hideStartButton();
            this.startTimer();
        });

        this.view.onToolSelect((tool) => {
        // select tool in model and update view highlight
        this.model.selectTool(tool);
        this.view.highlightSelectedTool(tool);
        });

        this.view.onTreeClick((treeId) => {
            // only allow treeClick if game has started
            if (!this.model.isGameStarted()) {
                return;
            }

            const result = this.model.tryChopTree(treeId);

            if (!result.success) {
                // For now we silently ignore wrong clicks. Could add feedback.
                return;
            }

            // success -> remove tree in view, update UI counters
            this.view.removeTree(treeId);
            this.view.updateWoodCollected(this.model.woodCollected);
            this.view.updateToolCounts(this.model.tools);
            this.view.updateTreeCounts(this.model.treeCounts);

            if (this.model.isFinished()) {
                this.endGame();
            }
        });
    }

    getView(): WoodMinigameView { return this.view; }

    override show(): void {
        // reset model state
        this.model.generateRandomState(1280, 720);

        // push initial view state
        this.view.renderTrees(this.model.trees);
        this.view.updateWoodCollected(this.model.woodCollected);
        this.view.updateToolCounts(this.model.tools);
        this.view.updateTreeCounts(this.model.treeCounts);
        this.view.highlightSelectedTool(null);
        this.view.updateTimer(this.model.getTimer());
        this.view.hideEndGame();

        // show start button
        this.view.showStartButton();

        // start timer
        super.show();
        this.screenSwitch.getStage().draw();
    }

    override hide(): void {
        // stop timer when leaving
        this.stopTimer();
        super.hide();
    }

    private startTimer() {
        this.stopTimer();
        // tick once a second
        this.timerHandle = window.setInterval(() => {
            const remaining = this.model.tickTimer();
            this.view.updateTimer(remaining);

            if (this.model.isFinished()) {
                this.endGame();
            }
        }, 1000);
  }

   private stopTimer() {
    if (this.timerHandle !== null) {
      clearInterval(this.timerHandle);
      this.timerHandle = null;
    }
   }

   private endGame() {
    this.stopTimer();
    const reason = this.model.getEndGameReason();
    this.view.showEndGame(reason);
   }
}
