import Konva from "konva";

import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants.ts";
import type { Screen, ScreenSwitch } from "./types.ts";
import { ScreenType } from "./types.ts";
import { AboutController } from "./screens/AboutScreen/AboutController.ts";
import { LeaderboardController } from "./screens/LeaderboardScreen/LeaderboardController.ts";
import { MainGameController } from "./screens/MainGameScreen/MainGameController.ts";
import { SettingsController } from "./screens/SettingsScreen/SettingsController.ts";
import { StoneMinigameController } from "./screens/StoneMinigameScreen/StoneMinigameController.ts";
import { TitleController } from "./screens/TitleScreen/TitleController.ts";
import { WoodMinigameController } from "./screens/WoodMinigameScreen/WoodMinigameController.ts";
import { RulesController } from "./screens/RulesScreen/RulesController.ts";
import { loadAssets } from "./assets.ts";

class Application implements ScreenSwitch {
    private stage: Konva.Stage;
    private layer: Konva.Layer;

    private aboutController: AboutController;
    private leaderboardController: LeaderboardController;
    private mainGameController: MainGameController;
    private settingsController: SettingsController;
    private stoneMinigameController: StoneMinigameController;
    private titleController: TitleController;
    private woodMinigameController: WoodMinigameController;

    constructor(container: string) {
        // Initialize stage
        this.stage = new Konva.Stage(
            {
                container,
                width: STAGE_WIDTH,
                height: STAGE_HEIGHT
            }
        );

        // Create layer to which to add screens
        this.layer = new Konva.Layer();
        this.stage.add(this.layer);

        // Initialize screen controllers
        this.aboutController = new AboutController(this);
        this.leaderboardController = new LeaderboardController(this);
        this.mainGameController = new MainGameController(this);
        this.settingsController = new SettingsController(this);
        this.stoneMinigameController = new StoneMinigameController(this);
        this.titleController = new TitleController(this);
        this.woodMinigameController = new WoodMinigameController(this);

        // Add screen groups to layer
        this.layer.add(this.aboutController.getView().getGroup());
        this.layer.add(this.leaderboardController.getView().getGroup());
        this.layer.add(this.mainGameController.getView().getGroup());
        this.layer.add(this.settingsController.getView().getGroup());
        this.layer.add(this.stoneMinigameController.getView().getGroup());
        this.layer.add(this.titleController.getView().getGroup());
        this.layer.add(this.woodMinigameController.getView().getGroup());
    }

    run(): void {
        // Draw layer
        this.layer.draw();

        // Display initial screen
        this.titleController.show();
    }

    switchScreen(screen: Screen): void {
        // Hide all screens
        this.aboutController.hide();
        this.leaderboardController.hide();
        this.mainGameController.hide();
        this.settingsController.hide();
        this.stoneMinigameController.hide();
        this.titleController.hide();
        this.woodMinigameController.hide();

        // Show requested screen
        switch (screen.type) {
            case ScreenType.About:
                this.aboutController.show();
                break;
            case ScreenType.Leaderboard:
                this.leaderboardController.show();
                break;
            case ScreenType.MainGame:
                this.mainGameController.show();
                break;
            case ScreenType.Settings:
                this.settingsController.show();
                break;
            case ScreenType.StoneMinigame:
                this.stoneMinigameController.show();
                break;
            case ScreenType.Title:
                this.titleController.show();
                break;
            case ScreenType.WoodMinigame:
                this.woodMinigameController.show();
                break;
            default:
                throw new TypeError(screen.type);
        }
    }
}

async function main(): Promise<void> {
    await loadAssets([
        "/settings.png",
    ]);

    const application = new Application("container");
    application.run();
}

main();
