import { Scene, Engine } from 'excalibur';

import { Background } from './background';
import { Board } from './board';
import { ClearEffect } from './clear-effect';
import { COLS, Shape, SHAPES } from './config';
import { InputController } from './input-controller';
import { ScoreManager } from './score';
import { Tetromino } from './tetromino';
import { UiController } from './ui-controller';

export class GameScene extends Scene {
  private board!: Board;
  private clearEffect!: ClearEffect;

  private currentPiece: Tetromino | null = null;

  // Timing
  private dropTimer: number = 0;

  // Controller (keyboard) and scoring
  private controller: InputController | null = null;
  private uiController: UiController | null = null;
  private scoreManager: ScoreManager = new ScoreManager();

  // Game state
  private gameOver: boolean = false;

  // waits for title screen start
  private started: boolean = false;

  // Track last clear count for scoring after effect
  private lastClearCount: number = 0;

  // Next piece preview
  private nextShape: Shape | null = null;

  async onInitialize(engine: Engine): Promise<void> {
    this.board = new Board(this);
    this.clearEffect = new ClearEffect(this.board);
    this.add(new Background());
    this.setupInput(engine);

    // Show title UI and wait for start
    engine.emit('ui:show', { type: 'title' });
  }

  private setupInput(engine: Engine): void {
    // Keyboard controller with built-in repeat
    this.controller = new InputController(engine, {
      move: (dx, dy) => this.tryMove(dx, dy),
      rotate: () => this.tryRotate(),
      hardDrop: () => this.hardDrop(),
    });

    // Map UI actions via controller
    this.uiController = new UiController(engine, {
      start: () => this.startGame(),
      restart: () => this.startGame(),
      move: (dx, dy) => this.tryMove(dx, dy),
      rotate: () => this.tryRotate(),
      hardDrop: () => this.hardDrop(),
    });

    // Disable gameplay actions until game starts; start/restart still work
    this.uiController.setActive(false);
    this.controller.setActive(false);
  }

  private spawnPiece(): void {
    if (!this.nextShape) {
      this.nextShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    }
    const shape = this.nextShape;
    this.nextShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];

    const startX = Math.floor((COLS - shape.blocks[0].length) / 2);
    const startY = 0;

    this.currentPiece = new Tetromino(shape, startX, startY);
    this.currentPiece.addToScene(this);

    // Check for game over
    if (!this.board.isValidPosition(startX, startY, shape.blocks)) {
      this.endGame();
    }

    this.engine.emit('ui:hud', {
      score: this.scoreManager.score,
      level: this.scoreManager.level,
      lines: this.scoreManager.lines,
      next: this.nextShape?.name ?? null,
    });
  }

  private tryMove(dx: number, dy: number): boolean {
    if (!this.currentPiece) return false;

    const newX = this.currentPiece.gridX + dx;
    const newY = this.currentPiece.gridY + dy;

    if (this.board.isValidPosition(newX, newY, this.currentPiece.shape.blocks)) {
      this.currentPiece.updatePosition(newX, newY);
      return true;
    } else if (dy > 0) {
      // Can't move down - lock the piece
      this.camera.shake(2, 5, 300);
      this.lockPiece();
      return false;
    }
    return false;
  }

  private tryRotate(): void {
    if (!this.currentPiece) return;

    const rotated = this.currentPiece.rotate();
    if (this.board.isValidPosition(this.currentPiece.gridX, this.currentPiece.gridY, rotated)) {
      this.currentPiece.updateShape(rotated);
    }
  }

  private hardDrop(): void {
    if (!this.currentPiece) return;

    let dropped = 0;
    while (this.tryMove(0, 1)) {
      dropped++;
    }
    this.scoreManager.addHardDrop(dropped);
    this.updateUI();
  }

  private startGame(): void {
    // Reset state
    this.clearBoardActors();
    this.currentPiece = null;
    this.dropTimer = 0;
    this.scoreManager.reset();
    this.gameOver = false;
    this.started = true;
    this.spawnPiece();
    this.updateUI();

    // Hide ui and reveal HUD
    this.engine.emit('ui:show', { type: 'none' });

    // Enable controller
    this.controller?.setActive(true);
    this.uiController?.setActive(true);
  }

  private clearBoardActors(): void {
    this.board.reset();
    if (this.currentPiece) {
      this.currentPiece.removeFromScene(this);
      this.currentPiece = null;
    }
  }

  private lockPiece(): void {
    if (!this.currentPiece) return;

    // Add blocks to the board
    this.board.settlePiece(this.currentPiece);

    // Remove the current piece
    this.currentPiece.removeFromScene(this);
    this.currentPiece = null;

    // Check for completed lines with flash, defer spawn until after clear
    if (!this.checkAndStartLineClear()) {
      // No lines to clear, spawn immediately
      this.spawnPiece();
    }
  }

  // Find complete lines and start clear effect
  private checkAndStartLineClear(): boolean {
    const rows = this.board.findCompletedRows();
    if (rows.length === 0) return false;
    this.lastClearCount = rows.length;
    this.clearEffect.start(rows);
    return true;
  }

  // Finalise scoring & spawn after effect ends
  private onEffectFinished(): void {
    if (this.lastClearCount > 0) {
      this.scoreManager.addLineClears(this.lastClearCount);
      this.updateUI();
      this.lastClearCount = 0;
    }
    this.spawnPiece();
  }

  private updateUI(): void {
    this.engine.emit('ui:hud', {
      score: this.scoreManager.score,
      level: this.scoreManager.level,
      lines: this.scoreManager.lines,
      next: this.nextShape?.name ?? null,
    });
  }

  onPreUpdate(_engine: Engine, delta: number): void {
    if (!this.started || this.gameOver) return;

    // Handle line clear effect (flash + staggered fade)
    if (this.clearEffect.isActive()) {
      const finished = this.clearEffect.update(delta);
      if (finished) this.onEffectFinished();
      return;
    }

    this.controller?.update(delta);

    // Handle automatic drop
    if (this.currentPiece) {
      this.dropTimer += delta / 1000;
      if (this.dropTimer >= this.scoreManager.dropInterval) {
        this.tryMove(0, 1);
        this.dropTimer = 0;
      }
    }
  }

  private endGame(): void {
    this.gameOver = true;

    // Disable input controller
    this.controller?.setActive(false);
    this.uiController?.setActive(false);

    this.engine.emit('ui:show', {
      type: 'gameover',
      score: this.scoreManager.score,
      level: this.scoreManager.level,
      lines: this.scoreManager.lines,
    });
  }
}
