import { Engine, Keys } from 'excalibur';

type Handlers = {
  move: (dx: number, dy: number) => void;
  rotate: () => void;
  hardDrop: () => void;
};

export class InputController {
  private readonly KEY_REPEAT_INTERVAL = 140;

  private engine: Engine;
  private keyRepeatDelay = this.KEY_REPEAT_INTERVAL;
  private active = false;

  constructor(engine: Engine, private handlers: Handlers) {
    this.engine = engine;
  }

  public setActive(active: boolean): void {
    this.active = active;
  }

  public update(delta: number): void {
    if (!this.active) return;

    this.keyRepeatDelay -= delta;

    const keyboard = this.engine.input.keyboard;

    if ((keyboard.wasReleased(Keys.Left) || keyboard.wasReleased(Keys.H)) && this.keyRepeatDelay <= 0) {
      this.keyRepeatDelay = this.KEY_REPEAT_INTERVAL;
      this.handlers.move(-1, 0);
    } else if ((keyboard.wasReleased(Keys.Right) || keyboard.wasReleased(Keys.L)) && this.keyRepeatDelay <= 0) {
      this.keyRepeatDelay = this.KEY_REPEAT_INTERVAL;
      this.handlers.move(1, 0);
    } else if ((keyboard.isHeld(Keys.Left) || keyboard.isHeld(Keys.H)) && this.keyRepeatDelay <= 0) {
      this.keyRepeatDelay = this.KEY_REPEAT_INTERVAL;
      this.handlers.move(-1, 0);
    } else if ((keyboard.isHeld(Keys.Right) || keyboard.isHeld(Keys.L)) && this.keyRepeatDelay <= 0) {
      this.keyRepeatDelay = this.KEY_REPEAT_INTERVAL;
      this.handlers.move(1, 0);
    } else if (keyboard.wasPressed(Keys.Up) || keyboard.wasPressed(Keys.R)) {
      this.handlers.rotate();
    } else if (keyboard.wasPressed(Keys.Down) || keyboard.wasPressed(Keys.J)) {
      this.handlers.hardDrop();
    }
  }
}
