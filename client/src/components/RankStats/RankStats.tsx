import styles from "./RankStats.module.css";

export default function RankStats() {
  return (
    <div className={styles.ranks}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableTitle}>Rank</th>
            <th className={styles.tablePlayers}>
              <span>You</span>
            </th>
            <th className={styles.tablePlayers}>
              <span>Others</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={styles.rankTitle}>Straight Flush</td>
            <td>0%</td>
            <td>0%</td>
          </tr>
          <tr>
            <td className={styles.rankTitle}>Four-of-a-Kind</td>
            <td>0%</td>
            <td>0%</td>
          </tr>
          <tr>
            <td className={styles.rankTitle}>Full House</td>
            <td>0%</td>
            <td>0%</td>
          </tr>
          <tr>
            <td className={styles.rankTitle}>Flush</td>
            <td>0%</td>
            <td>0%</td>
          </tr>
          <tr>
            <td className={styles.rankTitle}>Straight</td>
            <td>0%</td>
            <td>0%</td>
          </tr>
          <tr>
            <td className={styles.rankTitle}>Three-of-a-kind</td>
            <td>0%</td>
            <td>0%</td>
          </tr>
          <tr>
            <td className={styles.rankTitle}>Two Pair</td>
            <td>0%</td>
            <td>0%</td>
          </tr>
          <tr>
            <td className={styles.rankTitle}>One Pair</td>
            <td>0%</td>
            <td>0%</td>
          </tr>
          <tr>
            <td className={styles.rankTitle}>High Card</td>
            <td>0%</td>
            <td>0%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
