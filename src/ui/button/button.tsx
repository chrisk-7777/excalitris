import type { ReactNode } from 'react';

import styles from './button.module.css';

type Props = {
  children: ReactNode;
  onClick: () => void;
};

export function Button(props: Props) {
  const { children, onClick } = props;

  return (
    <button className={styles.root} type="button" onClick={onClick}>
      {children}
    </button>
  );
}
