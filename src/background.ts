import { Actor, Canvas } from 'excalibur';

import { BLOCK_SIZE, COLS, ROWS } from './config';

export class Background extends Actor {
  constructor() {
    super({
      x: (COLS * BLOCK_SIZE) / 2,
      y: (ROWS * BLOCK_SIZE) / 2,
      width: COLS * BLOCK_SIZE,
      height: ROWS * BLOCK_SIZE,
      z: -100,
    });
  }

  onInitialize(): void {
    const gridCanvas = new Canvas({
      width: COLS * BLOCK_SIZE,
      height: ROWS * BLOCK_SIZE,
      draw: (ctx: CanvasRenderingContext2D) => {
        // Draw slightly visible background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, 0, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x <= COLS; x++) {
          ctx.beginPath();
          ctx.moveTo(x * BLOCK_SIZE, 0);
          ctx.lineTo(x * BLOCK_SIZE, ROWS * BLOCK_SIZE);
          ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= ROWS; y++) {
          ctx.beginPath();
          ctx.moveTo(0, y * BLOCK_SIZE);
          ctx.lineTo(COLS * BLOCK_SIZE, y * BLOCK_SIZE);
          ctx.stroke();
        }
      },
    });

    this.graphics.use(gridCanvas);
  }
}
