import type { Engine } from 'excalibur';

import { Panel } from '../panel/panel';
import { PanelHeading } from '../panel-heading/panel-heading';
import { PanelText } from '../panel-text/panel-text';
import { SHAPES } from '../../config';

import styles from './hud.module.css';

type Props = {
  lines: number;
  level: number;
  score: number;
  next: string | null;
};

function getBlocksForShape(name: string | null) {
  if (!name) return null;
  const shape = SHAPES.find((s) => s.name === name);
  return shape?.blocks ?? null;
}

export function Hud(props: Props) {
  const { next, lines, level, score } = props;

  const blocks = getBlocksForShape(next);
  const shapeClass = next ? `shape${next}` : '';

  return (
    <div className={styles.root}>
      <Panel>
        <div className={styles.row}>
          <PanelHeading>Score</PanelHeading>
          <PanelText>{score}</PanelText>
        </div>
        <div className={styles.row}>
          <PanelHeading>Level</PanelHeading>
          <PanelText>{level}</PanelText>
        </div>
        <div className={styles.row}>
          <PanelHeading>Lines</PanelHeading>
          <PanelText>{lines}</PanelText>
        </div>
      </Panel>

      <div />

      <Panel>
        <div className={styles.blocks}>
          <div className={shapeClass}>
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
        </div>
      </Panel>
    </div>
  );
}
