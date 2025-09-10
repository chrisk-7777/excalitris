import { Engine, Keys } from 'excalibur';

type Handlers = {
  move: (dx: number, dy: number) => void;
  rotate: () => void;
  hardDrop: () => void;
};

export class InputController {
  private heldKeys: Set<Keys> = new Set();
  private keyRepeatTimers: Map<Keys, number> = new Map();
  private keyRepeatDelay = 0.15; // seconds
  private keyRepeatInterval = 0.05; // seconds
  private active = false;

  constructor(engine: Engine, private handlers: Handlers) {
    // Register keyboard handlers once; respect active flag
    engine.input.keyboard.on('press', (evt) => {
      if (!this.active) return;
      this.heldKeys.add(evt.key);
      this.keyRepeatTimers.set(evt.key, 0);

      switch (evt.key) {
        case Keys.Left:
          this.handlers.move(-1, 0);
          break;
        case Keys.Right:
          this.handlers.move(1, 0);
          break;
        case Keys.Down:
        case Keys.Space:
          this.handlers.hardDrop();
          break;
        case Keys.Up:
          this.handlers.rotate();
          break;
      }
    });

    engine.input.keyboard.on('release', (evt) => {
      this.heldKeys.delete(evt.key);
      this.keyRepeatTimers.delete(evt.key);
    });
  }

  public setActive(active: boolean): void {
    this.active = active;
    if (!active) {
      this.heldKeys.clear();
      this.keyRepeatTimers.clear();
    }
  }

  public update(deltaMs: number): void {
    if (!this.active) return;
    for (const key of this.heldKeys) {
      const timer = this.keyRepeatTimers.get(key) ?? 0;
      const newTimer = timer + deltaMs / 1000;
      if (key === Keys.Left || key === Keys.Right) {
        if (newTimer >= this.keyRepeatDelay) {
          const repeatTime = newTimer - this.keyRepeatDelay;
          const lastRepeatTime = timer - this.keyRepeatDelay;
          if (
            lastRepeatTime < 0 ||
            Math.floor(repeatTime / this.keyRepeatInterval) > Math.floor(lastRepeatTime / this.keyRepeatInterval)
          ) {
            if (key === Keys.Left) this.handlers.move(-1, 0);
            else if (key === Keys.Right) this.handlers.move(1, 0);
          }
        }
      }
      this.keyRepeatTimers.set(key, newTimer);
    }
  }
}
