import { ReactNode } from "react";

import styles from "./panel-text.module.css";

export type Props = {
  children: ReactNode;
};

export function PanelText(props: Props) {
  const { children } = props;

  return <div className={styles.root}>{children}</div>;
}
