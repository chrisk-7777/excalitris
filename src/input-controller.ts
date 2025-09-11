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

    if (this.engine.input.keyboard.wasReleased(Keys.Left) && this.keyRepeatDelay <= 0) {
      this.keyRepeatDelay = this.KEY_REPEAT_INTERVAL;
      this.handlers.move(-1, 0);
    } else if (this.engine.input.keyboard.wasReleased(Keys.Right) && this.keyRepeatDelay <= 0) {
      this.keyRepeatDelay = this.KEY_REPEAT_INTERVAL;
      this.handlers.move(1, 0);
    } else if (this.engine.input.keyboard.isHeld(Keys.Left) && this.keyRepeatDelay <= 0) {
      this.keyRepeatDelay = this.KEY_REPEAT_INTERVAL;
      this.handlers.move(-1, 0);
    } else if (this.engine.input.keyboard.isHeld(Keys.Right) && this.keyRepeatDelay <= 0) {
      this.keyRepeatDelay = this.KEY_REPEAT_INTERVAL;
      this.handlers.move(1, 0);
    } else if (this.engine.input.keyboard.wasPressed(Keys.Up)) {
      this.handlers.rotate();
    } else if (this.engine.input.keyboard.wasPressed(Keys.Down)) {
      this.handlers.hardDrop();
    }
  }
}
