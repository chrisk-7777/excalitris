import { Actor, GraphicsGroup, Scene, Sprite, SpriteSheet, vec, Vector } from 'excalibur';

import { BLOCK_SIZE, Shape, SHAPES } from './config';
import { Resources } from './resources';

export interface BlockPosition {
  x: number;
  y: number;
}

export class Tetromino extends Actor {
  private blockSprites: Array<Sprite> = [];
  private maxBlocksNeeded: number = 4;

  public shape: Shape;
  public gridX: number;
  public gridY: number;

  constructor(shape: Shape, startX: number, startY: number) {
    super({
      x: startX * BLOCK_SIZE,
      y: startY * BLOCK_SIZE,
    });

    this.shape = shape;
    this.gridX = startX;
    this.gridY = startY;

    const spriteSheet = SpriteSheet.fromImageSource({
      image: Resources.Blocks,
      grid: {
        rows: 1,
        columns: 7,
        spriteWidth: BLOCK_SIZE,
        spriteHeight: BLOCK_SIZE,
      },
    });

    // Create sprites for blocks
    for (let i = 0; i < this.maxBlocksNeeded; i++) {
      const shapeIndex = SHAPES.findIndex((s) => s.name === shape.name);
      this.blockSprites.push(spriteSheet.getSprite(Math.max(0, shapeIndex), 0)!);
    }
    this.updateBlocks();
  }

  private updateBlocks(): void {
    let blockIndex = 0;
    const group = new GraphicsGroup({ members: [] });

    // Add sprites at correct positions based on shape
    for (let row = 0; row < this.shape.blocks.length; row++) {
      for (let col = 0; col < this.shape.blocks[row].length; col++) {
        if (this.shape.blocks[row][col] === 1) {
          const sprite = this.blockSprites[blockIndex];
          const offsetX = col * BLOCK_SIZE;
          const offsetY = (row - 1) * BLOCK_SIZE;

          group.members.push({
            graphic: sprite,
            offset: new Vector(offsetX, offsetY),
          });

          blockIndex++;
        }
      }
    }

    this.graphics.anchor = vec(0, 0);
    this.graphics.use(group);

    this.pos.x = this.gridX * BLOCK_SIZE;
    this.pos.y = this.gridY * BLOCK_SIZE;
  }

  public addToScene(scene: Scene): void {
    scene.add(this);
  }

  public removeFromScene(scene: Scene): void {
    scene.remove(this);
  }

  public updatePosition(newX: number, newY: number): void {
    this.gridX = newX;
    this.gridY = newY;
    this.pos.x = this.gridX * BLOCK_SIZE;
    this.pos.y = this.gridY * BLOCK_SIZE;
  }

  // Return a rotated copy of the current blocks (clockwise)
  public rotate(): Shape['blocks'] {
    const h = this.shape.blocks.length;
    const w = this.shape.blocks[0].length;
    const rotated: Shape['blocks'] = Array.from({ length: w }, () => Array(h).fill(0));

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        rotated[x][h - 1 - y] = this.shape.blocks[y][x];
      }
    }

    return rotated;
  }

  public updateShape(newShape: Shape['blocks']): void {
    this.shape = { name: this.shape.name, blocks: newShape };
    this.updateBlocks();
  }

  public getBlockPositions(): BlockPosition[] {
    const positions: BlockPosition[] = [];
    for (let row = 0; row < this.shape.blocks.length; row++) {
      for (let col = 0; col < this.shape.blocks[row].length; col++) {
        if (this.shape.blocks[row][col] === 1) {
          positions.push({
            x: this.gridX + col,
            y: this.gridY + row,
          });
        }
      }
    }
    return positions;
  }
}
