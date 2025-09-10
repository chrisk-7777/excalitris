import { ReactNode } from 'react';

import styles from './title.module.css';

export type Props = {
  children: ReactNode;
};

export function Title(props: Props) {
  const { children } = props;

  return <h1 className={styles.root}>{children}</h1>;
}
