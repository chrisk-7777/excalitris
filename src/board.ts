import { Scene } from 'excalibur';

import { COLS, ROWS, type Shape } from './config';
import { getBlockSpriteFor } from './sprites';
import { SettledBlock } from './settled-block';
import { type Tetromino } from './tetromino';

// A 2D array representation of the current board, along with support methods for checking validity, settling pieces,
// and so on.
export class Board {
  private scene: Scene;

  public grid: Array<Array<SettledBlock | null>>;

  constructor(scene: Scene) {
    this.scene = scene;
    this.grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  }

  reset(): void {
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const block = this.grid[y][x];
        if (block) this.scene.remove(block);
        this.grid[y][x] = null;
      }
    }
  }

  isValidPosition(x: number, y: number, blocks: Shape['blocks']): boolean {
    for (let row = 0; row < blocks.length; row++) {
      for (let col = 0; col < blocks[row].length; col++) {
        if (blocks[row][col] === 0) continue;
        const boardX = x + col;
        const boardY = y + row;
        if (boardX < 0 || boardX >= COLS || boardY >= ROWS) return false;
        if (boardY >= 0 && this.grid[boardY][boardX] !== null) return false;
      }
    }
    return true;
  }

  settlePiece(piece: Tetromino): void {
    const positions = piece.getBlockPositions();
    const sprite = getBlockSpriteFor(piece.shape.name);
    positions.forEach((pos) => {
      if (pos.y >= 0 && pos.y < ROWS && pos.x >= 0 && pos.x < COLS) {
        const block = new SettledBlock(pos.x, pos.y, sprite);
        this.scene.add(block);
        this.grid[pos.y][pos.x] = block;
      }
    });
  }

  findCompletedRows(): number[] {
    const rows: number[] = [];
    for (let y = 0; y < ROWS; y++) {
      if (this.grid[y].every((c) => c !== null)) rows.push(y);
    }
    return rows;
  }

  applyOpacityToRows(rows: number[], opacity: number): void {
    for (const y of rows) {
      for (let x = 0; x < COLS; x++) {
        const block = this.grid[y][x];
        if (block) block.graphics.opacity = opacity;
      }
    }
  }

  getBlock(x: number, y: number): SettledBlock | null {
    if (y < 0 || y >= ROWS || x < 0 || x >= COLS) return null;
    return this.grid[y][x];
  }

  removeRows(rows: number[]): void {
    const flags = new Array<boolean>(ROWS).fill(false);
    for (const y of rows) flags[y] = true;
    for (let y = 0; y < ROWS; y++) {
      if (!flags[y]) continue;
      for (let x = 0; x < COLS; x++) {
        const block = this.grid[y][x];
        if (block) this.scene.remove(block);
        this.grid[y][x] = null;
      }
    }
  }

  compactAfterRowsCleared(rows: number[]): void {
    const flags = new Array<boolean>(ROWS).fill(false);
    for (const y of rows) flags[y] = true;

    let writeY = ROWS - 1;
    for (let y = ROWS - 1; y >= 0; y--) {
      if (!flags[y]) {
        if (writeY !== y) {
          for (let x = 0; x < COLS; x++) {
            this.grid[writeY][x] = this.grid[y][x];
            if (this.grid[writeY][x]) this.grid[writeY][x]!.updateGridPosition(x, writeY);
          }
        }
        writeY--;
      }
    }
    for (let y = writeY; y >= 0; y--) {
      for (let x = 0; x < COLS; x++) {
        this.grid[y][x] = null;
      }
    }
  }
}
