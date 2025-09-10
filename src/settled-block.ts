import { Actor, Sprite } from 'excalibur';
import { BLOCK_SIZE } from './config';

// Represents a single settled block on the board.
// Uses a pre-selected Sprite (color) and snaps to the grid.
export class SettledBlock extends Actor {
  constructor(gridX: number, gridY: number, sprite: Sprite) {
    super({
      x: gridX * BLOCK_SIZE + BLOCK_SIZE / 2,
      y: gridY * BLOCK_SIZE + BLOCK_SIZE / 2,
      width: BLOCK_SIZE,
      height: BLOCK_SIZE,
    });

    this.graphics.use(sprite);
  }

  // Update the actor's position when rows shift down after clearing lines
  public updateGridPosition(gridX: number, gridY: number): void {
    this.pos.x = gridX * BLOCK_SIZE + BLOCK_SIZE / 2;
    this.pos.y = gridY * BLOCK_SIZE + BLOCK_SIZE / 2;
  }
}

