import styles from "./CardSlot.module.css";
import type { CardId } from "../../types/cards";
import { label } from "../../types/cards";

type CardSlotProps = {
  value?: CardId;
  isActive?: boolean;
  onClick: () => void;
};

// Single slot that can display a card label or an empty placeholder.
export default function CardSlot({
  value,
  isActive = false,
  onClick,
}: CardSlotProps) {
  // Use the suit character to color red suits appropriately.
  const suit = value?.slice(-1);
  const isRedSuit = suit === "h" || suit === "d";

  return (
    <button
      type="button"
      // Apply slot state styling: red suits, active outline, empty placeholder.
      className={`${styles.slot} ${isRedSuit ? styles.redSuit : ""} ${
        isActive ? styles.active : ""
      } ${value ? "" : styles.empty}`}
      onClick={onClick}
      aria-pressed={isActive}
    >
      {/* Show the card label if assigned, otherwise a dash placeholder. */}
      {value ? label(value) : "—"}
    </button>
  );
}
