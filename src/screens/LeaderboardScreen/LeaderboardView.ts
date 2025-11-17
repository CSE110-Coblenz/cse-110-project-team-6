import Konva from "konva"
import { View, Color } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import type { LeaderboardEntry } from "../../types.ts"; 

export class LeaderboardView extends View {

    private titleText: Konva.Text;
    private entriesGroup: Konva.Group;
    public backButton: Konva.Group;
    public backButtonRect: Konva.Rect;

    constructor() {
        super();

        const group = this.getGroup();

        // Background (stage dimensions)
        const background = new Konva.Rect({
          x: 0,
          y: 0,
          width: STAGE_WIDTH,
          height: STAGE_HEIGHT,
          fill: Color.DarkGreyBlue
        });
        group.add(background);

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


        this.backButtonRect = new Konva.Rect({
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

        this.backButton.add(this.backButtonRect);
        this.backButton.add(buttonText);
        group.add(this.backButton);
  }


    /**
     * Updates leaderboard data and redraws the list.
     */
    public setEntries(entries: LeaderboardEntry[]): void {
        this.entriesGroup.destroyChildren();

        const topEntries = Array.from({ length: 8}, (_, i) => entries[i] ?? { username: "", score: ""});

        const rowHeight = 60;
        const fontSize = 30;
        const paddingY = 10;
        const tableWidth = 500;

        const centerX = STAGE_WIDTH / 2;
        const centerY = STAGE_HEIGHT / 2;

        // Header row
        const headerUser = new Konva.Text({
          x: -tableWidth / 2 + 40,
          y: 0,
          text: "Username",
          fontSize,
          fontFamily: "Calibri",
          fill: Color.Cyan,
        });

        const headerScore = new Konva.Text({
          x: tableWidth / 2 - 140,
          y: 0,
          text: "Score",
          fontSize,
          fontFamily: "Calibri",
          fill: Color.Cyan,
        });

        this.entriesGroup.add(headerUser);
        this.entriesGroup.add(headerScore);

        // Draw each player entry
        topEntries.forEach((entry, i) => {
          const y = (i + 1) * rowHeight + paddingY;

          // Alternating row color
          const bg = new Konva.Rect({
            x: -tableWidth / 2,
            y: y - 8,
            width: tableWidth,
            height: rowHeight - 10,
            fill: i % 2 === 0 ? Color.LightGreyBlue : Color.GreyBlue,
            opacity: 0.35,
            cornerRadius: 8,
          });
          this.entriesGroup.add(bg);

          const usernameText = new Konva.Text({
            x: -tableWidth / 2 + 40,
            y,
            text: entry.username === "" ? "----" : entry.username,
            fontSize,
            fontFamily: "Calibri",
            fill: Color.White,
          });

          const scoreText = new Konva.Text({
            x: tableWidth / 2 - 140,
            y,
            text: entry.score === "" ? "----" : entry.score.toString(),
            fontSize,
            fontFamily: "Calibri",
            fill: Color.White,
          });

          this.entriesGroup.add(usernameText);
          this.entriesGroup.add(scoreText);
        });

    
        // ---- Centering logic ----

    // Title centered horizontally near top
    this.titleText.x(centerX - this.titleText.width() / 2);
    this.titleText.y(centerY - 300);

    // Entries group centered on screen
    this.entriesGroup.position({
      x: centerX,
      y: centerY - 200,
    });

    // Back button top right
    const buttonMargin = 20;
    this.backButton.x(STAGE_WIDTH - this.backButton.width() - 150);
    this.backButton.y(buttonMargin);


    this.entriesGroup.getLayer()?.batchDraw();
  }
}