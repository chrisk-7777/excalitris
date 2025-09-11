import { Sprite, SpriteSheet } from 'excalibur';

import { BLOCK_SIZE, SHAPES } from './config';
import { Resources } from './resources';

export class SpriteManager {
  private sheet: SpriteSheet;

  constructor() {
    this.sheet = SpriteSheet.fromImageSource({
      image: Resources.Blocks,
      grid: { rows: 1, columns: 7, spriteWidth: BLOCK_SIZE, spriteHeight: BLOCK_SIZE },
    });
  }

  getBlockSpriteFor(shapeName: string): Sprite {
    const index = SHAPES.findIndex((s) => s.name === shapeName);
    return this.sheet.getSprite(Math.max(0, index), 0)!;
  }
}
