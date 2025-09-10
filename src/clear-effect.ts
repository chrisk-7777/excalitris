import { COLS, ROWS } from './config';
import { Board } from './board';
import type { SettledBlock } from './settled-block';

type Stage = 'idle' | 'flash' | 'fade';

type Entry = { block: SettledBlock; x: number; y: number; start: number; duration: number };

export class ClearEffect {
  private board: Board;
  private elapsed = 0;
  private entries: Array<Entry> = [];
  private flashTimer = 0;
  private rows: Array<number> = [];
  private stage: Stage = 'idle';
  private total = 0;

  constructor(board: Board) {
    this.board = board;
  }

  start(rows: number[]): void {
    this.rows = [...rows];
    this.flashTimer = 0.25;
    this.stage = 'flash';
    // Dim rows for flash
    this.board.applyOpacityToRows(this.rows, 0.3);
    this.entries = [];
    this.elapsed = 0;
    this.total = 0;
  }

  isActive(): boolean {
    return this.stage !== 'idle';
  }

  // Returns true when finished
  update(deltaMs: number): boolean {
    if (this.stage === 'idle') return false;
    const delta = deltaMs / 1000;

    if (this.stage === 'flash') {
      this.flashTimer -= delta;
      if (this.flashTimer <= 0) {
        this.prepareFade();
        this.stage = 'fade';
      }
      return false;
    }

    if (this.stage === 'fade') {
      this.elapsed += delta;
      for (const e of this.entries) {
        const t = this.elapsed - e.start;
        if (t < 0) continue;
        if (t <= e.duration) {
          const pct = Math.max(0, Math.min(1, t / e.duration));
          e.block.graphics.opacity = 0.3 * (1 - pct);
        } else {
          e.block.graphics.opacity = 0;
        }
      }
      if (this.elapsed >= this.total + 0.01) {
        // Remove and compact via board
        this.board.removeRows(this.rows);
        this.board.compactAfterRowsCleared(this.rows);
        this.stage = 'idle';
        return true;
      }
      return false;
    }

    return false;
  }

  private prepareFade(): void {
    const staggerX = 0.035; // seconds per column
    const staggerY = 0.015; // seconds per upward row
    const fadeDuration = 0.18; // seconds
    this.entries = [];
    this.total = 0;
    for (const y of this.rows) {
      for (let x = 0; x < COLS; x++) {
        const block = this.board.getBlock(x, y);
        if (!block) continue;
        const start = x * staggerX + (ROWS - 1 - y) * staggerY;
        this.entries.push({ block, x, y, start, duration: fadeDuration });
        this.total = Math.max(this.total, start + fadeDuration);
      }
    }
  }
}
