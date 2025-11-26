import Konva from "konva";

import { Building } from "./Buildings.ts";
import { Container, NumericInput } from "../../components.ts";
import { BuildingType, Color } from "../../types.ts";

import prompts from "../../data/prompts.json";

export class ConstructionDialog extends Container {
    private title: Konva.Text;
    private details: DetailsForm;
    private proposal: ProposalForm;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        this.group.visible(false);
        this.container.cornerRadius(12);
        this.container.fill(Color.White);
        this.container.stroke(Color.Black);

        this.title = new Konva.Text({ fontSize: 36, padding: 12 });
        this.group.add(this.title);

        this.details = new DetailsForm(
            0.025 * this.group.width(),
            this.title.y() + this.title.height() + 0.025 * (this.group.height() - this.title.height()),
            0.45 * this.group.width(),
            0.95 * (this.group.height() - this.title.height())
        );
        this.group.add(this.details.getGroup());

        this.proposal = new ProposalForm(
            0.525 * this.group.width(),
            this.title.y() + this.title.height() + 0.025 * (this.group.height() - this.title.height()),
            0.45 * this.group.width(),
            0.95 * (this.group.height() - this.title.height())
        );
        this.group.add(this.proposal.getGroup());
    }

    show(): void { this.group.visible(true); }
    hide(): void { this.group.visible(false); }

    updateBuildingType(type: BuildingType): void {
        this.title.text(`Current Project: ${type}`);
        this.title.x((this.group.width() - this.title.width()) / 2);

        this.details.updateBuildingType(type);
    }

    getDetails(): DetailsForm { return this.details; }
    getProposal(): ProposalForm { return this.proposal; }
}

class DetailsForm extends Container {
    private title: Konva.Text;
    private building?: Building;
    private prompt: Konva.Text;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        this.container.stroke(Color.Black);

        this.title = new Konva.Text(
            {
                fontSize: 32,
                padding: 6,
                text: "Project Details"
            }
        );
        this.title.x((this.group.width() - this.title.width()) / 2);
        this.group.add(this.title);

        this.prompt = new Konva.Text(
            {
                fontSize: 18,
                wrap: "word",
                x: 0.025 * this.group.width(),
                y: 0.5 * this.group.height(),
                width: 0.95 * this.group.width(),
                height: 0.975 * (this.group.height() - (this.title.y() + this.title.height()))
            }
        );
        this.group.add(this.prompt);
    }

    updateBuildingType(type: BuildingType): void {
        this.building?.getGroup().remove();
        this.building = new Building(
            type, `../../assets/buildings/orthographic/${type}.png`,
            0.25 * this.group.width(), this.title.y() + this.title.height(),
            0.5 * this.group.width(), 0.5 * this.group.width()
        );
        this.group.add(this.building.getGroup());

        this.prompt.text(prompts[type.toLowerCase() as keyof typeof prompts]);
    }
}

class ProposalForm extends Container {
    private title: Konva.Text;
    private length: NumericInput;
    private width: NumericInput;
    private area: NumericInput;
    private perimeter: NumericInput;
    private cancel: ButtonCancel;
    private confirm: ButtonConfirm;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        this.container.stroke(Color.Black);

        this.title = new Konva.Text(
            {
                fontSize: 32,
                padding: 6,
                text: "Project Proposal"
            }
        );
        this.title.x((this.group.width() - this.title.width()) / 2);
        this.group.add(this.title);

        this.group.add(
            new Konva.Text(
                {
                    fill: Color.Black,
                    fontSize: 18,
                    padding: 10,
                    text: "Length (Units)",
                    x: 0.025 * this.group.width(),
                    y: 0.175 * this.group.height(),
                }
            )
        );
        this.length = new NumericInput(
            0.025 * this.group.width(), 0.25 * this.group.height(),
            0.95 * this.group.width(), 0.075 * this.group.height()
        );
        this.group.add(this.length.getGroup());

        this.group.add(
            new Konva.Text(
                {
                    fill: Color.Black,
                    fontSize: 18,
                    padding: 10,
                    text: "Width (Units)",
                    x: 0.025 * this.group.width(),
                    y: 0.325 * this.group.height(),
                }
            )
        );
        this.width = new NumericInput(
            0.025 * this.group.width(), 0.4 * this.group.height(),
            0.95 * this.group.width(), 0.075 * this.group.height()
        );
        this.group.add(this.width.getGroup());

        this.group.add(
            new Konva.Text(
                {
                    fill: Color.Black,
                    fontSize: 18,
                    padding: 10,
                    text: "Area (Square Units)",
                    x: 0.025 * this.group.width(),
                    y: 0.475 * this.group.height(),
                }
            )
        );
        this.area = new NumericInput(
            0.025 * this.group.width(), 0.55 * this.group.height(),
            0.95 * this.group.width(), 0.075 * this.group.height()
        );
        this.group.add(this.area.getGroup());

        this.group.add(
            new Konva.Text(
                {
                    fill: Color.Black,
                    fontSize: 18,
                    padding: 10,
                    text: "Perimeter (Units)",
                    x: 0.025 * this.group.width(),
                    y: 0.625 * this.group.height(),
                }
            )
        );
        this.perimeter = new NumericInput(
            0.025 * this.group.width(), 0.7 * this.group.height(),
            0.95 * this.group.width(), 0.075 * this.group.height()
        );
        this.group.add(this.perimeter.getGroup());

        this.cancel = new ButtonCancel(
            0.025 * this.group.width(), 0.9 * this.group.height(),
            0.45 * this.group.width(), 0.075 * this.group.height()
        );
        this.group.add(this.cancel.getGroup());

        this.confirm = new ButtonConfirm(
            0.525 * this.group.width(), 0.9 * this.group.height(),
            0.45 * this.group.width(), 0.075 * this.group.height()
        );
        this.group.add(this.confirm.getGroup());
    }

    getLength(): NumericInput { return this.length; }
    getWidth(): NumericInput { return this.width; }
    getArea(): NumericInput { return this.area; }
    getPerimeter(): NumericInput { return this.perimeter; }
    getCancel(): ButtonCancel { return this.cancel; }
    getConfirm(): ButtonConfirm { return this.confirm; }

    updateArea(): void {
        this.area.setValue(
            this.length.getValue() * this.width.getValue()
        );
    }

    updatePerimeter(): void {
        this.perimeter.setValue(
            2 * (this.length.getValue() + this.width.getValue())
        );
    }
}

class ButtonCancel extends Container {
    private text: Konva.Text;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        this.container.stroke(Color.Black);
        this.container.fill(Color.DarkRed);

        this.text = new Konva.Text(
            {
                fill: Color.Black,
                fontSize: 24,
                padding: 10,
                text: "Cancel"
            }
        );
        this.text.x((this.group.width() - this.text.width()) / 2);
        this.text.y((this.group.height() - this.text.height()) / 2);
        this.group.add(this.text);
    }
}

class ButtonConfirm extends Container {
    private text: Konva.Text;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        this.container.stroke(Color.Black);
        this.container.fill(Color.Green);

        this.text = new Konva.Text(
            {
                fill: Color.Black,
                fontSize: 24,
                padding: 10,
                text: "Confirm"
            }
        );
        this.text.x((this.group.width() - this.text.width()) / 2);
        this.text.y((this.group.height() - this.text.height()) / 2);
        this.group.add(this.text);
    }
}
