import { useState } from "react";
import styles from "./AppShell.module.css";
import PokerTable from "../PokerTable/PokerTable";
import DeckPanel from "../DeckPanel/DeckPanel";
import ResetButton from "../ResetButton/ResetButton";
import RankStats from "../RankStats/RankStats";
import PlayerStats from "../PlayerStats/PlayerStats";
import type { CardId } from "../../types/cards";

export default function AppShell() {
  const [usedCards, setUsedCards] = useState<CardId[]>([]);

  const handleCardClick = (id: CardId) => {
    setUsedCards((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  return (
    <div className={styles.shell}>
      <PokerTable />
      <DeckPanel usedCards={usedCards} onCardClick={handleCardClick} />
      <RankStats />
      <PlayerStats />
      <ResetButton />
    </div>
  );
}
