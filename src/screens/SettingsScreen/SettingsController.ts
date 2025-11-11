import { SettingsView } from "./SettingsView.ts";
import { Controller } from "../../types.ts";
import type { ScreenSwitch } from "../../types.ts";

export class SettingsController extends Controller {
    private view: SettingsView;

    constructor(screenSwitch: ScreenSwitch) {
        super(screenSwitch);

        this.view = new SettingsView();
        
        // 0 - Main Volume
        // 1 - Sound Effects
        // 2 - Music
        let volumeVals = [0.5, 0.5, 0.5]; 

        // Exit button Logic
        this.view.getExitButton().on("mouseover", (e) => {
            e.target.getStage()!.container().style.cursor = "pointer";
        });

        this.view.getExitButton().on("mouseout", (e) => {
            e.target.getStage()!.container().style.cursor = "default";
        });

        this.view.getExitButton().on("mousedown", () => {
            this.view.getGroup().visible(false);
            this.view.getGroup().getLayer()?.batchDraw();
        });

        // Mute button logic
        this.view.getMuteButton().getGroup().on('mouseover', function (e) {
            e.target.getStage()!.container().style.cursor = 'pointer';
        });

        this.view.getMuteButton().getGroup().on('mouseout', function (e) {
            e.target.getStage()!.container().style.cursor = 'default';
        });

        this.view.getMuteButton().getGroup().on('mousedown', () => {
            const muteButton = this.view.getMuteButton();

            volumeVals[0] = 0;
            volumeVals[1] = 0;
            volumeVals[2] = 0;

            const isChecked = !muteButton.isChecked();
            muteButton.toggle();
            this.view.getMuteButton().getBox().fill(isChecked ? "#38B764" : "#B13E53");
            this.view.getMuteButton().getBox().getLayer()?.batchDraw();
        });

        // Main Volume Slider logic
        this.view.getMainVolSlider().getKnob().on('mouseover', function (e) {
            e.target.getStage()!.container().style.cursor = 'pointer';
        }) 

        this.view.getMainVolSlider().getKnob().on('mouseout', function (e) {
            e.target.getStage()!.container().style.cursor = 'default';
        }) 


        this.view.getMainVolSlider().getKnob().on('dragmove', () => {
            const slider = this.view.getMainVolSlider();
            const knob = slider.getKnob();

            // Clamp knob on slider
            const newX = Math.max(slider.getMinX(), Math.min(knob.x(), slider.getMaxX()));
            knob.x(newX);
            knob.y(slider.getLine().points()[1]);

            // Update percentage
            const ratio = (newX - slider.getMinX()) / (slider.getMaxX() - slider.getMinX());
            const percentValue = Math.round(ratio * 100);
            this.view.getMainVolSlider().getPercent().text(percentValue + "%");
        });

        this.view.getMainVolSlider().getKnob().on("dragend", () => {
            const muteButton = this.view.getMuteButton();
            
            // If mute all is on, toggle off
            if (muteButton.isChecked()) {
                muteButton.toggle();

                const newChecked = muteButton.isChecked();

                this.view.getMuteButton().getBox().fill(newChecked ? "#38B764" : "#B13E53");
                this.view.getMuteButton().getBox().getLayer()?.batchDraw();
            }

            const hoverSound = new Audio('/hover.mp3');
            const slider = this.view.getMainVolSlider();
            const knob = slider.getKnob();
            
            const newX = Math.max(slider.getMinX(), Math.min(knob.x(), slider.getMaxX()));

            const ratio = (newX - slider.getMinX()) / (slider.getMaxX() - slider.getMinX());
            volumeVals[0] = ratio;
            hoverSound.volume = volumeVals[0];
            
            hoverSound.play();
        });

        // Sound Effects Slider logic
        this.view.getEffectsSlider().getKnob().on('mouseover', function (e) {
            e.target.getStage()!.container().style.cursor = 'pointer';
        }) 

        this.view.getEffectsSlider().getKnob().on('mouseout', function (e) {
            e.target.getStage()!.container().style.cursor = 'default';
        }) 


        this.view.getEffectsSlider().getKnob().on('dragmove', () => {
            const slider = this.view.getEffectsSlider();
            const knob = slider.getKnob();

            // Clamp knob on slider
            const newX = Math.max(slider.getMinX(), Math.min(knob.x(), slider.getMaxX()));
            knob.x(newX);
            knob.y(slider.getLine().points()[1]);

            // Update percentage
            const ratio = (newX - slider.getMinX()) / (slider.getMaxX() - slider.getMinX());
            const percentValue = Math.round(ratio * 100);
            this.view.getEffectsSlider().getPercent().text(percentValue + "%");
        });

        this.view.getEffectsSlider().getKnob().on("dragend", () => {
            const hoverSound = new Audio('/hover.mp3');
            const slider = this.view.getEffectsSlider();
            const knob = slider.getKnob();
            
            const newX = Math.max(slider.getMinX(), Math.min(knob.x(), slider.getMaxX()));

            const ratio = (newX - slider.getMinX()) / (slider.getMaxX() - slider.getMinX());
            volumeVals[1] = ratio;
            hoverSound.volume = volumeVals[1];
            
            hoverSound.play();
        });

        // Music Slider logic
        this.view.getMusicSlider().getKnob().on('mouseover', function (e) {
            e.target.getStage()!.container().style.cursor = 'pointer';
        }) 

        this.view.getMusicSlider().getKnob().on('mouseout', function (e) {
            e.target.getStage()!.container().style.cursor = 'default';
        }) 


        this.view.getMusicSlider().getKnob().on('dragmove', () => {
            const slider = this.view.getMusicSlider();
            const knob = slider.getKnob();

            // Clamp knob on slider
            const newX = Math.max(slider.getMinX(), Math.min(knob.x(), slider.getMaxX()));
            knob.x(newX);
            knob.y(slider.getLine().points()[1]);

            // Update percentage
            const ratio = (newX - slider.getMinX()) / (slider.getMaxX() - slider.getMinX());
            const percentValue = Math.round(ratio * 100);
            this.view.getMusicSlider().getPercent().text(percentValue + "%");
        });

        this.view.getMusicSlider().getKnob().on("dragend", () => {
            const hoverSound = new Audio('/hover.mp3');
            const slider = this.view.getMusicSlider();
            const knob = slider.getKnob();
            
            const newX = Math.max(slider.getMinX(), Math.min(knob.x(), slider.getMaxX()));

            const ratio = (newX - slider.getMinX()) / (slider.getMaxX() - slider.getMinX());
            volumeVals[2] = ratio;
            hoverSound.volume = volumeVals[2];
            
            hoverSound.play();
        });
    }




    getView(): SettingsView { return this.view; }
}
