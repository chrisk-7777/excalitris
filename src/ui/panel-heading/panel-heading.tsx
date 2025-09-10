import { ReactNode } from "react";

import styles from "./panel-heading.module.css";

export type Props = {
  children: ReactNode;
};

export function PanelHeading(props: Props) {
  const { children } = props;

  return <div className={styles.root}>{children}</div>;
}
