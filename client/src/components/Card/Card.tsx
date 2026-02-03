import styles from "./Card.module.css";
import type { CardId, Rank, Suit } from "../../types/cards.ts";
import { label } from "../../types/cards.ts";

// Exactly how the card we are sending should look
type CardProps = {
  id: CardId;
  rank: Rank;
  suit: Suit;
  selected: boolean;
  disabled?: boolean;
  onClick: (id: CardId) => void;
};

// Card component
export default function Card({
  id,
  rank,
  suit,
  selected,
  disabled = false,
  onClick,
}: CardProps) {
  const isRedSuit = suit === "h" || suit === "d";

  return (
    <button
      type="button"
      className={`${styles.card} ${isRedSuit ? styles.redSuit : ""} ${
        selected ? styles.selected : ""
      } ${disabled ? styles.disabled : ""}`}
      onClick={() => onClick(id)}
      disabled={disabled}
      data-rank={rank}
      data-suit={suit}
      aria-pressed={selected}
    >
      {label(id)}
    </button>
  );
}
