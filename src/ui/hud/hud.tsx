import { useEffect, useState } from 'react';
import * as z from 'zod';
import type { Engine } from 'excalibur';

import { Panel } from '../panel/panel';
import { PanelHeading } from '../panel-heading/panel-heading';
import { PanelText } from '../panel-text/panel-text';
import { SHAPES } from '../../config';

import styles from './hud.module.css';

type Props = {
  engine: Engine;
};

const payloadShape = z.object({
  score: z.number(),
  level: z.number(),
  lines: z.number(),
  next: z.string().nullable(),
});

type HudState = z.infer<typeof payloadShape>;

function getBlocksForShape(name: string | null) {
  if (!name) return null;
  const shape = SHAPES.find((s) => s.name === name);
  return shape?.blocks ?? null;
}

export function Hud(props: Props) {
  const { engine } = props;
  const [hud, setHud] = useState<HudState>({ score: 0, level: 1, lines: 0, next: null });

  useEffect(() => {
    const sub = engine.on('ui:hud', (event: unknown) => {
      setHud(payloadShape.parse(event));
    });

    return () => sub.close();
  }, [engine]);

  const blocks = getBlocksForShape(hud.next);
  const shapeClass = hud.next ? `shape${hud.next}` : '';

  return (
    <div className={styles.root}>
      <Panel>
        <PanelHeading>Score</PanelHeading>
        <PanelText>
          {hud.score} (Lv {hud.level}, {hud.lines} lines)
        </PanelText>
      </Panel>

      <Panel>
        <div className={shapeClass}>
          <PanelHeading>Next</PanelHeading>
          {blocks && (
            <div className={styles.nextGrid} style={{ gridTemplateColumns: `repeat(${blocks[0].length}, 12px)` }}>
              {blocks.flatMap((row, y) =>
                row.map((cell, x) => (
                  <div key={`${x}-${y}`} className={`${styles.cell} ${cell ? styles.filled : ''}`} />
                ))
              )}
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
