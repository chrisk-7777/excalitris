import { COLS } from './config';
import { Board } from './board';

export class ClearEffect {
  private board: Board;
  private readonly DELAY = 20;

  public isActive: boolean = false;

  constructor(board: Board) {
    this.board = board;
  }

  start(rows: number[], onDone: any): void {
    this.isActive = true;

    // Reverse rows so we can process from bottom up and simplify delay calculation
    const reversedRows = [...rows].reverse();

    for (let rowIdx = 0; rowIdx < reversedRows.length; rowIdx++) {
      const y = reversedRows[rowIdx];
      for (let x = 0; x < COLS; x++) {
        const actionChain = this.board
          .getBlock(x, y)
          ?.actions.delay((rowIdx * COLS + x) * this.DELAY)
          .fade(0, 300);

        if (rowIdx === reversedRows.length - 1 && x === COLS - 1) {
          actionChain?.callMethod(() => {
            this.board.removeRows(rows);
            this.board.compactAfterRowsCleared(rows);
            this.isActive = false;
            onDone();
          });
        }
      }
    }
  }
}
