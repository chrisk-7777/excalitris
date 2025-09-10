import { Sprite, SpriteSheet } from 'excalibur';

import { BLOCK_SIZE, SHAPES } from './config';
import { Resources } from './resources';

let cachedSheet: SpriteSheet | null = null;

function getSheet(): SpriteSheet {
  if (!cachedSheet) {
    cachedSheet = SpriteSheet.fromImageSource({
      image: Resources.Blocks,
      grid: { rows: 1, columns: 7, spriteWidth: BLOCK_SIZE, spriteHeight: BLOCK_SIZE },
    });
  }
  return cachedSheet;
}

export function getBlockSpriteFor(shapeName: string): Sprite {
  const index = SHAPES.findIndex((s) => s.name === shapeName);
  return getSheet().getSprite(Math.max(0, index), 0)!;
}
