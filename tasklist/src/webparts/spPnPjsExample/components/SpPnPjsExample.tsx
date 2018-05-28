import * as React from "react";
import styles from "./SpPnPjsExample.module.scss";
import { ISpPnPjsExampleProps } from "./ISpPnPjsExampleProps";
import { escape } from "@microsoft/sp-lodash-subset";
import pnp from "sp-pnp-js";
import { Web } from "sp-pnp-js";
import { TimelineList } from "../components";

export default class SpPnPjsExample extends React.Component<
  ISpPnPjsExampleProps,
  {}
> {
  public render(): React.ReactElement<ISpPnPjsExampleProps> {
    console.log("string1");
    return (
      <div className={styles.spPnPjsExample}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>Timeline Tasks</span>
              <p className={styles.subTitle}>REST API using sp-pnp-js.</p>
              <p className={styles.description}>
                {escape(this.props.description)}
              </p>
              <a href="https://aka.ms/spfx" className={styles.button}>
                <span className={styles.label}>Learn more</span>
              </a>
              <TimelineList />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
