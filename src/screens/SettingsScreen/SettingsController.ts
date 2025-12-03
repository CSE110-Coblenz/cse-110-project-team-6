import { SettingsView } from "./SettingsView.ts";
import { Controller, ScreenType } from "../../types.ts";
import type { ScreenSwitch } from "../../types.ts";

export class SettingsController extends Controller {
    private view: SettingsView;
    private volumeVals: number[] = [0.5, 0.5, 0.5]; 
    // 0 = Main, 1 = Effects, 2 = Music

    constructor(screenSwitch: ScreenSwitch) {
        super(screenSwitch);

        this.view = new SettingsView();

        this.setupExitButton();
        this.setupMuteButton();

        this.setupSlider(this.view.getMainVolSlider(), 0);
        this.setupSlider(this.view.getEffectsSlider(), 1);
        this.setupSlider(this.view.getMusicSlider(), 2);
    }

    // Exit Button Logic
    private setupExitButton() {
        const exit = this.view.getExitButton();

        exit.on("mouseover", e =>
            (e.target.getStage()!.container().style.cursor = "pointer")
        );

        exit.on("mouseout", e =>
            (e.target.getStage()!.container().style.cursor = "default")
        );

        exit.on("mousedown", () => {
            const previous = (this.screenSwitch as any).getPreviousScreen();

            // If no previous screen (null), settings accessed from TitleScreen
            const target = previous ?? ScreenType.Title;

            this.screenSwitch.switchScreen({ type: target });
        });
    }

    // Mute Button
    private setupMuteButton() {
        const mute = this.view.getMuteButton();
        const box = mute.getBox();

        mute.getGroup().on("mouseover", e =>
            (e.target.getStage()!.container().style.cursor = "pointer")
        );

        mute.getGroup().on("mouseout", e =>
            (e.target.getStage()!.container().style.cursor = "default")
        );

        mute.getGroup().on("mousedown", () => {
            mute.toggle();
            const checked = mute.isChecked();

            // Update color
            box.fill(checked ? "#38B764" : "#B13E53");
            box.getLayer()?.batchDraw();

            // If muting zero all volumes
            if (checked) {
                this.volumeVals = [0, 0, 0];
            }
        });
    }

    // Slider logic
    private setupSlider(slider: any, index: number) {
        const knob = slider.getKnob();

        knob.on("mouseover", e =>
            (e.target.getStage()!.container().style.cursor = "pointer")
        );

        knob.on("mouseout", e =>
            (e.target.getStage()!.container().style.cursor = "default")
        );

        // Drag move
        knob.on("dragmove", () => {
            const min = slider.getMinX();
            const max = slider.getMaxX();
            const knobX = knob.x();

            // Clamp X
            const newX = Math.max(min, Math.min(knobX, max));
            knob.x(newX);

            // Lock Y on the slider line
            knob.y(slider.getLine().points()[1]);

            // Update %
            const ratio = (newX - min) / (max - min);
            slider.getPercent().text(Math.round(ratio * 100) + "%");
        });

        // Drag end (apply volume + unmute if needed)
        knob.on("dragend", () => {
            this.unmuteIfNeeded();
            this.applySliderVolume(slider, index);
        });
    }

    // Unmute if slider is moved
    private unmuteIfNeeded() {
        const muteButton = this.view.getMuteButton();
        if (!muteButton.isChecked()) return;

        muteButton.toggle();

        const box = muteButton.getBox();
        box.fill("#B13E53");
        box.getLayer()?.batchDraw();
    }

    // Slider Volume logic
    private applySliderVolume(slider: any, index: number) {
        const knob = slider.getKnob();

        const min = slider.getMinX();
        const max = slider.getMaxX();
        const x = knob.x();

        const ratio = (x - min) / (max - min);
        this.volumeVals[index] = this.volumeVals[0] * ratio;

        // Play test sound
        const hoverSound = new Audio('/hover.mp3');
        hoverSound.volume = ratio;
        hoverSound.play();
    }

    getView(): SettingsView {return this.view;}
}
