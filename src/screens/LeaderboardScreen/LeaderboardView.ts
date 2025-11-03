import Konva from "konva"
import { View, Color } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

export class LeaderboardView extends View {

    private titleText: Konva.Text;
    private entriesGroup: Konva.Group;
    private backButton: Konva.Group;

    constructor() {
        super();

        const group = this.getGroup();

        // Title text
        this.titleText = new Konva.Text({
            text: "Leaderboard",
            fontSize: 60,
            fontFamily: "Calibri",
            fill: Color.LightBlue,
            align: "center",
        });
        group.add(this.titleText);

        // Subgroup for entries
        this.entriesGroup = new Konva.Group();
        group.add(this.entriesGroup);

        // Creating the BACK button (top-right corner)
        const buttonWidth = 120;
        const buttonHeight = 45;
        const padding = 20;

        this.backButton = new Konva.Group({
            x: STAGE_WIDTH - buttonWidth - padding,
            y: padding,
        });

        const buttonRect = new Konva.Rect({
            width: buttonWidth,
            height: buttonHeight,
            fill: Color.GreyBlue,
            cornerRadius: 10,
            opacity: 0.8,
        });

        const buttonText = new Konva.Text({
            text: "Back",
            fontSize: 22,
            fontfamily:"Calibri",
            fill: Color.White,
            width: buttonWidth,
            height: buttonHeight,
            align: "center",
            verticalAlign: "middle",
        });

        // Mouse Hover Effect for BACK button
        this.backButton.on("mouseenter", () => {
            buttonRect.fill(Color.LightBlue);
            this.backButton.getLayer()?.draw();
        });
        this.backButton.on("mouseleave", () => {
            buttonRect.fill(Color.GreyBlue);
            this.backButton.getLayer()?.draw();
        });

        this.backButton.add(buttonRect);
        this.backButton.add(buttonText);

        group.add(this.backButton);
  }


    /**
     * Updates leaderboard data and redraws the list.
     */
    public setEntries(entries: { username: string; score: number }[]): void {
        this.entriesGroup.destroyChildren();

    const rowHeight = 60;
    const fontSize = 30;
    const usernameColX = 20;  // Added padding from left
    const scoreColX = 380;    // Adjusted for better spacing
    const paddingY = 10;

    // Header row
    const headerUser = new Konva.Text({
      x: usernameColX,
      y: 0,
      text: "Username",
      fontSize,
      fontFamily: "Calibri",
      fill: Color.Cyan,
    });

    const headerScore = new Konva.Text({
      x: scoreColX,
      y: 0,
      text: "Score",
      fontSize,
      fontFamily: "Calibri",
      fill: Color.Cyan,
    });

    this.entriesGroup.add(headerUser);
    this.entriesGroup.add(headerScore);

    const tableWidth = 500;

    // Draw each player entry
    entries.forEach((entry, i) => {
      const y = (i + 1) * rowHeight + paddingY;

      // Optional alternating row color
      const bg = new Konva.Rect({
        x: -10,
        y: y - 8,
        width: tableWidth,
        height: rowHeight - 10,
        fill: i % 2 === 0 ? Color.DarkGreyBlue : Color.GreyBlue,
        opacity: 0.35,
        cornerRadius: 8,
      });
      this.entriesGroup.add(bg);

      const usernameText = new Konva.Text({
        x: usernameColX,
        y,
        text: entry.username,
        fontSize,
        fontFamily: "Calibri",
        fill: Color.White,
      });

      const scoreText = new Konva.Text({
        x: scoreColX,
        y,
        text: entry.score.toString(),
        fontSize,
        fontFamily: "Calibri",
        fill: Color.White,
      });

      this.entriesGroup.add(usernameText);
      this.entriesGroup.add(scoreText);
    });

    // ---- Centering logic (unfinished) ----
    const stageWidth = STAGE_WIDTH;
    const stageHeight = STAGE_HEIGHT;

    // Center the title horizontally
    this.titleText.x(600);
    this.titleText.y(50); // Top margin

    // Calculate total height of the leaderboard content
    const totalTableHeight = (entries.length + 1) * rowHeight + paddingY;

    // Center the leaderboard horizontally
    this.entriesGroup.x(515);
    
    // Position vertically with spacing from title, ensuring it doesn't go off-screen
    const entriesStartY = this.titleText.y() + this.titleText.height() + 40;
    const availableHeight = stageHeight - entriesStartY - 40; // 40px bottom padding
    
    // If content is too tall, start higher up
    if (totalTableHeight > availableHeight) {
        this.entriesGroup.y(entriesStartY - (totalTableHeight - availableHeight));
    } else {
        this.entriesGroup.y(entriesStartY);
    }

    this.entriesGroup.getLayer()?.draw();
  }
}