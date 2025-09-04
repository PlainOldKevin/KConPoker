import styles from "./AppShell.module.css";
import PokerTable from "../PokerTable/PokerTable";
import DeckPanel from "../DeckPanel/DeckPanel";
import ResetButton from "../ResetButton/ResetButton";
import RankStats from "../RankStats/RankStats";
import PlayerStats from "../PlayerStats/PlayerStats";

export default function AppShell() {
  return (
    <div className={styles.shell}>
      <PokerTable />
      <DeckPanel />
      <RankStats />
      <PlayerStats />
      <ResetButton />
    </div>
  );
}
