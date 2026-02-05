import styles from "./DeckPanel.module.css";
import Card from "../PokerTable/Card/Card";
import { RANKS, SUITS } from "../../types/cards";
import type { CardId, Rank, Suit } from "../../types/cards";

// Define exactly what the deck panel will take in/do on click
type DeckPanelProps = {
  usedCards: CardId[];
  onCardClick: (id: CardId) => void;
};

// Deck of cards on the panel
const buildDeck = () =>
  RANKS.flatMap((rank: Rank) =>
    SUITS.map((suit: Suit) => ({
      id: `${rank}${suit}` as CardId,
      rank,
      suit,
    })),
  );

export default function DeckPanel({ usedCards, onCardClick }: DeckPanelProps) {
  const deck = buildDeck();
  const usedSet = new Set(usedCards);

  return (
    <div className={styles.deck}>
      {deck.map((card) => {
        const isUsed = usedSet.has(card.id);

        return (
          <Card
            key={card.id}
            id={card.id}
            rank={card.rank}
            suit={card.suit}
            selected={isUsed}
            disabled={isUsed}
            onClick={onCardClick}
          />
        );
      })}
    </div>
  );
}
