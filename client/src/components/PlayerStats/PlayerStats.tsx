import styles from "./PlayerStats.module.css";

export default function PlayerStats() {
  return (
    <div className={styles.player}>
      <table className={styles.table}>
        <thead>
          <th className={styles.tableTitle}>
            <span>You</span>
          </th>
          <th></th>
          <th className={styles.tableTitle}>
            <span>Others</span>
          </th>
        </thead>
        <tbody>
          <tr>
            <td className={styles.tableWinOdds}>0%</td>
            <td className={styles.tableWin}>Win</td>
            <td className={styles.tableWinOdds}>0%</td>
          </tr>
          <tr>
            <td className={styles.tableTieOdds}>0%</td>
            <td className={styles.tableTie}>Tie</td>
            <td className={styles.tableTieOdds}>0%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
