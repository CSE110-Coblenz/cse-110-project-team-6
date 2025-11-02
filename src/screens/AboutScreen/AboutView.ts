import Konva from "konva";
import { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

export class AboutView extends View {
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
        const panelX = panelMarginX;
        const panelY = panelMarginY;
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
            x: panelX,
            y: panelY,
            width: panelWidth,
            height: panelHeight,
            stroke: "black",
            strokeWidth: 2,
            listening: false
        });
        group.add(panelFrame);

        // Side decorative diagonal lines
        const leftDiagTop = new Konva.Line({
            points: [STAGE_WIDTH - panelX, panelY * 2, STAGE_WIDTH, panelY],
            stroke: "black",
            strokeWidth: 2,
            listening: false
        });
        const leftDiagBottom = new Konva.Line({
            points: [0, STAGE_HEIGHT, panelX, panelY + panelHeight],
            stroke: "black",
            strokeWidth: 2,
            listening: false
        });
        const rightDiagTop = new Konva.Line({
            points: [STAGE_WIDTH - (panelX + panelWidth), panelY * 2, 0, panelY],
            stroke: "black",
            strokeWidth: 2,
            listening: false
        });
        const rightDiagBottom = new Konva.Line({
            points: [STAGE_WIDTH, STAGE_HEIGHT, panelX + panelWidth, panelY + panelHeight],
            stroke: "black",
            strokeWidth: 2,
            listening: false
        });
        group.add(leftDiagTop);
        group.add(leftDiagBottom);
        group.add(rightDiagTop);
        group.add(rightDiagBottom);

        // Title
        const title = new Konva.Text({
            x: 0,
            y: 40,
            width: STAGE_WIDTH,
            align: "center",
            text: "About",
            fontSize: 56,
            fontStyle: "bold",
            fill: "black"
        });
        group.add(title);

        // Title bar: full width, bottom aligned with top edge of content panel
        const titleBarY = 0; // align with top of the screen
        const titleBarHeight = panelY; // bottom edge aligns with panelFrame's top (panelY)
        title.y(titleBarY + (titleBarHeight - title.height()) / 2);
        const titleBar = new Konva.Rect({
            x: 0,
            y: titleBarY,
            width: STAGE_WIDTH,
            height: titleBarHeight,
            stroke: "black",
            strokeWidth: 2,
            listening: false
        });
        group.add(titleBar);

        // Layout constants
        const leftColumnX = 184; // 160 margin + 24 padding
        const rightColumnX = 640; // left content start
        const firstRowY = 210; // below title
        const rowGap = 180;

        // Left labels
        const labelStyle = {
            fontSize: 40,
            fontStyle: "bold" as const,
            fill: "black"
        };

        const versionLabel = new Konva.Text({
            x: leftColumnX,
            y: firstRowY,
            text: "Version",
            ...labelStyle
        });
        const devsLabel = new Konva.Text({
            x: leftColumnX,
            y: firstRowY + rowGap,
            text: "Developers",
            ...labelStyle
        });
        const contactLabel = new Konva.Text({
            x: leftColumnX,
            y: firstRowY + rowGap * 3,
            text: "Contact Us",
            ...labelStyle
        });
        group.add(versionLabel);
        group.add(devsLabel);
        group.add(contactLabel);

        // Right values
        const valueStyle = {
            fontSize: 40,
            fill: "black"
        };

        const versionValue = new Konva.Text({
            x: rightColumnX,
            y: firstRowY,
            text: "1.0.0",
            ...valueStyle
        });
        const developersValue = new Konva.Text({
            x: rightColumnX,
            y: firstRowY + rowGap,
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
        const contactValue = new Konva.Text({
            x: rightColumnX,
            y: firstRowY + rowGap * 3,
            text: "support@geometropolis.com",
            ...valueStyle
        });
        group.add(versionValue);
        group.add(developersValue);
        group.add(contactValue);

        // Close button (top-right of panel)
        const closeGroup = new Konva.Group({
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
        closeGroup.add(closeBg);
        closeGroup.add(closeX1);
        closeGroup.add(closeX2);
        group.add(closeGroup);

        // Interactions
        closeGroup.on("click tap", () => this.hide());
        overlay.on("click tap", () => this.hide());
    }
}
