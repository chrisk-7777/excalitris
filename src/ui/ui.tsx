import { useEffect, useState } from 'react';
import * as z from 'zod';
import type { Engine } from 'excalibur';

import '@fontsource-variable/outfit';

import { GameOver } from './game-over/game-over';
import { Hud } from './hud/hud';
import { TitleScreen } from './title-screen/title-screen';
import { TouchControls } from './touch-controls/touch-controls';

import styles from './ui.module.css';

const showPayloadShape = z.union([
  z.object({ type: z.literal('none') }),
  z.object({ type: z.literal('title') }),
  z.object({ type: z.literal('gameover'), score: z.number(), level: z.number(), lines: z.number() }),
]);

const hudPayloadShape = z.object({
  score: z.number(),
  level: z.number(),
  lines: z.number(),
  next: z.string().nullable(),
});

type UIScreen = z.infer<typeof showPayloadShape>;
type HudState = z.infer<typeof hudPayloadShape>;

type Props = {
  engine: Engine;
};

export function Ui(props: Props) {
  const { engine } = props;
  const [screen, setScreen] = useState<UIScreen>({ type: 'title' });
  const [hud, setHud] = useState<HudState>({ score: 0, level: 1, lines: 0, next: null });

  useEffect(() => {
    const subShow = engine.on('ui:show', (event: unknown) => {
      setScreen(showPayloadShape.parse(event));
    });

    const subHud = engine.on('ui:hud', (event: unknown) => {
      setHud(hudPayloadShape.parse(event));
    });

    return () => {
      subShow.close();
      subHud.close();
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
      <Hud score={hud.score} level={hud.level} lines={hud.lines} next={hud.next} />
      <TouchControls engine={engine} />
    </div>
  );
}
