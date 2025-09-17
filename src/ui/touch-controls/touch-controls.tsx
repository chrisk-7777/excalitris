import type { Engine } from 'excalibur';

import styles from './touch-controls.module.css';

type Props = { engine: Engine };

export function TouchControls(props: Props) {
  const { engine } = props;

  return (
    <div className={styles.root}>
      <button className={styles.button} onClick={() => engine.emit('ui:action', { type: 'left' })}>
        Left <small>◀ / H</small>
      </button>
      <button className={styles.button} onClick={() => engine.emit('ui:action', { type: 'rotate' })}>
        Rotate <small>▲ / R</small>
      </button>
      <button className={styles.button} onClick={() => engine.emit('ui:action', { type: 'drop' })}>
        Drop <small>▼ / J</small>
      </button>
      <button className={styles.button} onClick={() => engine.emit('ui:action', { type: 'right' })}>
        Right <small>▶ / L</small>
      </button>
    </div>
  );
}
