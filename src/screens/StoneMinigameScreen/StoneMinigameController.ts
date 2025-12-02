import { StoneMinigameView } from "./StoneMinigameView.ts";
import { StoneMinigameModel } from "./StoneMinigameModel.ts";
import { Controller } from "../../types.ts";
import type { ScreenSwitch } from "../../types.ts";
import { ScreenType } from "../../types.ts";


export class StoneMinigameController extends Controller {
    private view: StoneMinigameView;
    private model: StoneMinigameModel;
    private timerHandle : number | null = null;


    constructor(screenSwitch: ScreenSwitch) {
        super(screenSwitch);

        this.view = new StoneMinigameView();
        this.model = new StoneMinigameModel();

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

        this.view.onRockClick((rockId) => {
            // only allow rockClick if game has started
            if (!this.model.isGameStarted()) {
                return;
            }

            const result = this.model.tryMineRock(rockId);

            if (!result.success) {
                // For now we silently ignore wrong clicks. Could add feedback.
                return;
            }

            // success -> remove rock in view, update UI counters
            this.view.removeRock(rockId);
            this.view.updateStoneCollected(this.model.stoneCollected);
            this.view.updateToolCounts(this.model.tools);
            this.view.updateRockCounts(this.model.rockCounts);

            if (this.model.isFinished()) {
                this.endGame();
            }
        });
    }

    getView(): StoneMinigameView { return this.view; }

    override show(): void {
        // reset model state
        this.model.generateRandomState(1280, 720);

        // push initial view state
        this.view.renderRocks(this.model.rocks);
        this.view.updateStoneCollected(this.model.stoneCollected);
        this.view.updateToolCounts(this.model.tools);
        this.view.updateRockCounts(this.model.rockCounts);
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
