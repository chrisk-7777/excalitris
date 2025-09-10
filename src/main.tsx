import { Engine, Color, DisplayMode } from 'excalibur';
import { createRoot } from 'react-dom/client';

import { COLS, ROWS, BLOCK_SIZE } from './config';
import { GameScene } from './game-scene';
import { loader } from './resources';
import { Ui } from './ui/ui';

// Game bits and bobs
const engine = new Engine({
  canvasElementId: 'game',
  resolution: { width: COLS * BLOCK_SIZE, height: ROWS * BLOCK_SIZE },
  displayMode: DisplayMode.FitContainerAndFill,
  backgroundColor: Color.Transparent,
  pixelArt: true,
});

const gameScene = new GameScene();
engine.add('game', gameScene);

// UI bits and bobs
const overlay = document.getElementById('ui');
if (!overlay) throw new Error('Missing ui element in dom');
const root = createRoot(overlay);

engine.start(loader).then(() => {
  setTimeout(() => {
    engine.goToScene('game');
    root.render(<Ui engine={engine} />);
    document.body.classList.add('game-started');
  }, 300);
});
