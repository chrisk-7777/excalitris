import { COLS } from './config';
import { Board } from './board';
import { ActionContext } from 'excalibur';

export class ClearEffect {
  private board: Board;
  public isActive: boolean = false;

  constructor(board: Board) {
    this.board = board;
  }

  start(rows: number[], onDone: any): void {
    this.isActive = true;
    let lastActionChain: ActionContext | undefined;
    let maxDelay = 0;

    for (const y of rows) {
      for (let x = 0; x < COLS; x++) {
        const block = this.board.getBlock(x, y);
        const delay = ((rows.length - 1 - rows.indexOf(y)) * COLS + x) * 25;

        const actionChain = block?.actions.delay(delay).fade(0, 300);

        if (delay >= maxDelay) {
          maxDelay = delay;
          lastActionChain = actionChain;
        }
      }
    }

    // Call a function on the very last block based on its delay
    if (lastActionChain) {
      lastActionChain.callMethod(() => {
        console.log('Last block fade complete');
        this.board.removeRows(rows);
        this.board.compactAfterRowsCleared(rows);
        this.isActive = false;
        onDone();
      });
    }
  }
}
