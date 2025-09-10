import type { ReactNode } from 'react';

import styles from './overlay.module.css';

type Props = {
  children: ReactNode;
};

export function Overlay(props: Props) {
  const { children } = props;

  return <div className={styles.root}>{children}</div>;
}
