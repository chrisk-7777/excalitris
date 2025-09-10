export class ScoreManager {
  public score = 0;
  public lines = 0;
  public level = 1;
  public dropInterval = 0.8;

  reset(): void {
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.dropInterval = 0.8;
  }

  // bonus points for hard drop
  addHardDrop(rows: number): void {
    this.score += rows * 2;
  }

  addLineClears(clearedCount: number): void {
    if (clearedCount <= 0) return;
    const lineScores = [0, 40, 100, 300, 1200];
    this.score += lineScores[Math.min(clearedCount, 4)] * this.level;
    this.lines += clearedCount;
    const newLevel = Math.floor(this.lines / 10) + 1;

    // bump level and speed at each new level
    if (newLevel !== this.level) {
      this.level = newLevel;
      this.dropInterval = Math.max(0.1, 0.8 - (this.level - 1) * 0.07);
    }
  }
}
