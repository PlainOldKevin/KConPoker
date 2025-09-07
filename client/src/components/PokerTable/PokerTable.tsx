import styles from "./PokerTable.module.css";

export default function PokerTable() {
  return (
    <div className={styles.tableArea}>
      <span className={styles.branding}>KConPoker.io</span>
      <div className={styles.table}></div>
    </div>
  );
}
