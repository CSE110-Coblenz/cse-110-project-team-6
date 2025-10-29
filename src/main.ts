import Konva from "konva";

import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants.ts";
import type { Screen, ScreenSwitch } from "./types.ts";

class Application implements ScreenSwitch {
    private stage: Konva.Stage;
    private layer: Konva.Layer;

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

        // Add screen groups to layer
    }

    run(): void {
        // Draw layer
        this.layer.draw();

        // Display initial screen
    }

    switchScreen(screen: Screen): void {}
}

function main(): void {
    const application = new Application("container");
    application.run();
}

main();
