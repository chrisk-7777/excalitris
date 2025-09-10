import { useEffect, useState } from 'react';
import * as z from 'zod';
import type { Engine } from 'excalibur';

import '@fontsource-variable/outfit';

import { GameOver } from './game-over/game-over';
import { Hud } from './hud/hud';
import { TitleScreen } from './title-screen/title-screen';
import { TouchControls } from './touch-controls/touch-controls';

import styles from './ui.module.css';

const payloadShape = z.union([
  z.object({ type: z.literal('none') }),
  z.object({ type: z.literal('title') }),
  z.object({ type: z.literal('gameover'), score: z.number(), level: z.number(), lines: z.number() }),
]);

type UIScreen = z.infer<typeof payloadShape>;

type Props = {
  engine: Engine;
};

export function Ui(props: Props) {
  const { engine } = props;
  const [screen, setScreen] = useState<UIScreen>({ type: 'title' });

  useEffect(() => {
    const subShow = engine.on('ui:show', (event: unknown) => {
      setScreen(payloadShape.parse(event));
    });

    return () => {
      subShow.close();
    };
  }, [engine]);

  if (screen.type === 'title') {
    return (
      <div className={styles.root}>
        <TitleScreen onStart={() => engine.emit('ui:action', { type: 'start' })} />
      </div>
    );
  }

  if (screen.type === 'gameover') {
    return (
      <div className={styles.root}>
        <GameOver
          score={screen.score}
          level={screen.level}
          lines={screen.lines}
          onRestart={() => engine.emit('ui:action', { type: 'restart' })}
        />
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        <Hud engine={engine} />
        <TouchControls engine={engine} />
      </div>
    </div>
  );
}
