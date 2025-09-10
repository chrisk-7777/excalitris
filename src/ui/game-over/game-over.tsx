import { Button } from '../button/button';
import { Overlay } from '../overlay/overlay';
import { PanelText } from '../panel-text/panel-text';
import { Panel } from '../panel/panel';
import { Title } from '../title/title';

import styles from './game-over.module.css';

type Props = {
  level: number;
  lines: number;
  onRestart: () => void;
  score: number;
};

export function GameOver(props: Props) {
  const { score, level, lines, onRestart } = props;

  return (
    <Overlay>
      <Panel>
        <div className={styles.root}>
          <Title>Game Over</Title>
          <div>
            <PanelText>Score: {score}</PanelText>
            <PanelText>Level: {level}</PanelText>
            <PanelText>Lines: {lines}</PanelText>
          </div>
          <Button onClick={onRestart}>Play Again</Button>
        </div>
      </Panel>
    </Overlay>
  );
}
