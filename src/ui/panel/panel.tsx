import type { ReactNode } from 'react';

import styles from './panel.module.css';

type Props = {
  children: ReactNode;
};

export function Panel(props: Props) {
  const { children } = props;

  return <div className={styles.root}>{children}</div>;
}
