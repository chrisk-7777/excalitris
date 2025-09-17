import type { ReactNode } from 'react';

import styles from './panel.module.css';

type Props = {
  children: ReactNode;
  variant?: 'default' | 'top-left' | 'top-right';
};

export function Panel(props: Props) {
  const { children, variant = 'default' } = props;

  return <div className={`${styles.root} ${styles[variant]}`}>{children}</div>;
}
