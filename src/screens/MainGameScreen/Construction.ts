import Konva from "konva";

import { Container, Icon } from "../../components.ts";
import { BuildingType, Color } from "../../types.ts";

export class ConstructionDialog extends Container {
    private iconCancel: Icon;

    private title: Konva.Text;
    private details: DetailsForm;
    private proposal: ProposalForm;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        this.group.visible(false);
        this.container.cornerRadius(12);
        this.container.fill(Color.White);
        this.container.stroke(Color.Black);

        this.iconCancel = new Icon("../../assets/icons/cancel.png");
        const groupCancel = this.iconCancel.getGroup();
        groupCancel.x(this.group.width() - groupCancel.width());
        this.group.add(groupCancel);

        this.title = new Konva.Text({ fontSize: 24, padding: 12 });
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

    getIconCancel(): Icon { return this.iconCancel; }

    setBuildingType(type: BuildingType) {
        this.title.text(`Current Project: ${type}`);
        this.title.x((this.group.width() - this.title.width()) / 2);
    }
}

class DetailsForm extends Container {
    private title: Konva.Text;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        this.container.stroke(Color.Black);

        this.title = new Konva.Text(
            {
                fontSize: 18,
                padding: 6,
                text: "Project Details"
            }
        );
        this.group.add(this.title);
    }
}

class ProposalForm extends Container {
    private title: Konva.Text;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        this.container.stroke(Color.Black);

        this.title = new Konva.Text(
            {
                fontSize: 18,
                padding: 6,
                text: "Project Proposal"
            }
        );
        this.group.add(this.title);
    }
}
