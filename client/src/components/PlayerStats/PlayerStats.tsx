import styles from "./PlayerStats.module.css";

// Props are split as "you" and "others" so this component stays presentation-only
interface PlayerStatsProps {
  yourWinPct: number;
  yourTiePct: number;
  othersWinPct: number;
  othersTiePct: number;
}

// Shared display formatter for odds values
const formatPct = (value: number) => `${value}%`;

export default function PlayerStats({
  yourWinPct,
  yourTiePct,
  othersWinPct,
  othersTiePct,
}: PlayerStatsProps) {
  return (
    <div className={styles.player}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableTitle}>
              <span>You</span>
            </th>
            {/* Spacer header used by middle label column (Win/Tie) */}
            <th></th>
            <th className={styles.tableTitle}>
              <span>Others</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={styles.tableWinOdds}>{formatPct(yourWinPct)}</td>
            <td className={styles.tableWin}>Win</td>
            <td className={styles.tableWinOdds}>{formatPct(othersWinPct)}</td>
          </tr>
          <tr>
            <td className={styles.tableTieOdds}>{formatPct(yourTiePct)}</td>
            <td className={styles.tableTie}>Tie</td>
            <td className={styles.tableTieOdds}>{formatPct(othersTiePct)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
