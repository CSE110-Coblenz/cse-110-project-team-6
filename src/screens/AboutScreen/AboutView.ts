import Konva from "konva";
import { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT, BASE_WIDTH, BASE_HEIGHT } from "../../constants.ts";

export class AboutView extends View {
    private title: Konva.Text;
    private titleBar: Konva.Rect;
    private versionLabel: Konva.Text;
    private devsLabel: Konva.Text;
    private contactLabel: Konva.Text;
    private versionValue: Konva.Text;
    private developersValue: Konva.Text;
    private contactValue: Konva.Text;
    private closeGroup: Konva.Group;

    constructor() {
        super();

        const group = this.getGroup();

        // Fullscreen white background
        const overlay = new Konva.Rect({
            x: 0,
            y: 0,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            fill: "white"
        });
        group.add(overlay);

        // Decorative frame and panel lines (black)
        const panelMarginX = 160;
        const panelMarginY = 96;
        const panelWidth = STAGE_WIDTH - panelMarginX * 2;
        const panelHeight = STAGE_HEIGHT - panelMarginY * 2;

        // Outer frame (around entire stage)
        const outerFrame = new Konva.Rect({
            x: 0,
            y: 0,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            stroke: "black",
            strokeWidth: 2,
            listening: false
        });
        group.add(outerFrame);

        // Inner content panel border
        const panelFrame = new Konva.Rect({
            x: panelMarginX,
            y: panelMarginY,
            width: panelWidth,
            height: panelHeight,
            stroke: "black",
            strokeWidth: 2,
            listening: false
        });
        group.add(panelFrame);

        // Decorative diagonal lines from prototype were intentionally removed per product requirements

        // Title
        this.title = new Konva.Text({
            x: 0,
            y: 40,
            width: STAGE_WIDTH,
            align: "center",
            text: "About",
            fontSize: 56,
            fontStyle: "bold",
            fill: "black"
        });
        group.add(this.title);

        // Title bar: full width, bottom aligned with top edge of content panel
        const titleBarY = 0; // align with top of the screen
        const titleBarHeight = panelMarginY; // bottom edge aligns with panelFrame's top (panelMarginY)
        this.title.y(titleBarY + (titleBarHeight - this.title.height()) / 2);
        this.titleBar = new Konva.Rect({
            x: 0,
            y: titleBarY,
            width: STAGE_WIDTH,
            height: titleBarHeight,
            stroke: "black",
            strokeWidth: 2,
            listening: false
        });
        group.add(this.titleBar);

        // Layout constants scaled from original 1920x1080 to current STAGE size
        const scaleX = STAGE_WIDTH / BASE_WIDTH;
        const scaleY = STAGE_HEIGHT / BASE_HEIGHT;
        const uniformScale = Math.min(scaleX, scaleY);

        const shiftX = 144 * scaleX; // move content 6 baselines to the right (base 144px)
        const leftColumnX = 184 * scaleX + shiftX; // base 184 + shift
        const rightColumnX = 640 * scaleX + shiftX; // base 640 + shift
        const firstRowY = 210 * scaleY; // base 210
        const rowGap = 180 * scaleY; // base 180

        // Left labels
        const labelStyle = {
            fontSize: 40 * uniformScale,
            fontStyle: "bold" as const,
            fill: "black"
        };

        this.versionLabel = new Konva.Text({
            x: leftColumnX,
            y: firstRowY,
            text: "Version",
            ...labelStyle
        });
        const developersRowY = firstRowY + rowGap;
        this.devsLabel = new Konva.Text({
            x: leftColumnX,
            y: developersRowY,
            text: "Developers",
            ...labelStyle
        });
        this.contactLabel = new Konva.Text({
            x: leftColumnX,
            y: firstRowY + rowGap * 3,
            text: "Contact Us",
            ...labelStyle
        });
        group.add(this.versionLabel);
        group.add(this.devsLabel);
        group.add(this.contactLabel);

        // Right values
        const valueStyle = {
            fontSize: 40 * uniformScale,
            fill: "black"
        };

        this.versionValue = new Konva.Text({
            x: rightColumnX,
            y: firstRowY,
            text: "1.0.0",
            ...valueStyle
        });
        this.developersValue = new Konva.Text({
            x: rightColumnX,
            y: developersRowY,
            text: [
                "Lee, Jacob",
                "Mitchell, Nathan",
                "Cardenas Ortiz, Gwendal",
                "Prajapati, Varun",
                "Shah, Kavya",
                "Qi, Wu"
            ].join("\n"),
            lineHeight: 1.3,
            ...valueStyle
        });
        this.contactValue = new Konva.Text({
            x: rightColumnX,
            y: firstRowY + rowGap * 3,
            text: "support@geometropolis.com",
            ...valueStyle
        });
        group.add(this.versionValue);
        group.add(this.developersValue);
        // Vertically center the "Developers" label relative to the whole list block
        const developersLabelCenteredY = this.developersValue.y() + (this.developersValue.height() - this.devsLabel.height()) / 2;
        const devsLabelAdjustedY = developersLabelCenteredY - 24 * scaleY; // move up by one baseline
        this.devsLabel.y(devsLabelAdjustedY);
        group.add(this.contactValue);

        // Close button (top-right of panel)
        this.closeGroup = new Konva.Group({
            x: STAGE_WIDTH - 36,
            y: 36,
            listening: true
        });
        const closeBg = new Konva.Circle({
            radius: 18,
            fill: "white",
            stroke: "black",
            strokeWidth: 3
        });
        const closeX1 = new Konva.Line({
            points: [-8, -8, 8, 8],
            stroke: "black",
            strokeWidth: 3,
            lineCap: "round",
            lineJoin: "round"
        });
        const closeX2 = new Konva.Line({
            points: [-8, 8, 8, -8],
            stroke: "black",
            strokeWidth: 3,
            lineCap: "round",
            lineJoin: "round"
        });
        this.closeGroup.add(closeBg);
        this.closeGroup.add(closeX1);
        this.closeGroup.add(closeX2);
        group.add(this.closeGroup);
    }

    /**
     * Get the close button group for event binding in the controller
     */
    getCloseGroup(): Konva.Group {
        return this.closeGroup;
    }
}
