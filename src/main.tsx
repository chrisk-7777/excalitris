import { Engine, Color, DisplayMode } from 'excalibur';
import { createRoot } from 'react-dom/client';

import { COLS, ROWS, BLOCK_SIZE } from './config';
import { GameScene } from './game-scene';
import { loader } from './resources';
import { Ui } from './ui/ui';

// Get the right size for the container before attaching canvas
const gameWrapper = document.querySelector<HTMLDivElement>('#wrapper');
if (!gameWrapper) throw new Error('Missing wrapper element in dom');
gameWrapper.style.aspectRatio = `${COLS}/${ROWS}`;

// Game bits and bobs
const engine = new Engine({
  canvasElementId: 'game',
  resolution: { width: COLS * BLOCK_SIZE, height: ROWS * BLOCK_SIZE },
  displayMode: DisplayMode.FitContainerAndFill,
  backgroundColor: Color.fromHex('#6b0f1a'),
  pixelArt: true,
});

const gameScene = new GameScene();
engine.add('game', gameScene);

// UI bits and bobs
const ui = document.getElementById('ui');
if (!ui) throw new Error('Missing ui element in dom');
const root = createRoot(ui);

engine.start(loader).then(() => {
  engine.goToScene('game');
  root.render(<Ui engine={engine} />);
  document.body.classList.add('game-started');
});
