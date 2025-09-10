import { Button } from '../button/button';
import { Overlay } from '../overlay/overlay';
import { Panel } from '../panel/panel';
import { PanelText } from '../panel-text/panel-text';
import { Title } from '../title/title';

import styles from './title-screen.module.css';

type Props = {
  onStart: () => void;
};

export function TitleScreen(props: Props) {
  const { onStart } = props;

  return (
    <Overlay>
      <Panel>
        <div className={styles.root}>
          <header className={styles.header}>
            <Title>Excalitris</Title>
            <PanelText>Arrow keys to move, Down/Space to hard drop</PanelText>
          </header>
          <Button onClick={onStart}>Start Game</Button>
        </div>
      </Panel>
    </Overlay>
  );
}
