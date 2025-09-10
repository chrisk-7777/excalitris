import type { Engine } from 'excalibur';

type UiHandlers = {
  start?: () => void;
  restart?: () => void;
  move: (dx: number, dy: number) => void;
  rotate: () => void;
  hardDrop: () => void;
};

// Centralizes mapping of UI events (buttons, title/restart actions)
// to game actions. Gameplay actions are gated by `active` while
// start/restart always pass through.
export class UiController {
  private active = false;

  constructor(engine: Engine, private handlers: UiHandlers) {
    engine.on('ui:action', (evt: any) => {
      const type = evt?.type as string | undefined;
      if (!type) return;

      // Start/Restart should always be allowed
      if (type === 'start') {
        this.handlers.start?.();
        return;
      }
      if (type === 'restart') {
        this.handlers.restart?.();
        return;
      }

      // Gameplay inputs: respect active gate
      if (!this.active) return;

      switch (type) {
        case 'left':
          this.handlers.move(-1, 0);
          break;
        case 'right':
          this.handlers.move(1, 0);
          break;
        case 'rotate':
          this.handlers.rotate();
          break;
        case 'drop':
          this.handlers.hardDrop();
          break;
      }
    });
  }

  public setActive(active: boolean): void {
    this.active = active;
  }
}
