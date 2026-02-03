import CardSlot from "../CardSlot/CardSlot";
import styles from "./PlayerHands.module.css";
import type { CardId } from "../../types/cards";
import type { SlotId } from "../../types/slots";
import { PLAYER_HAND_SLOT_PAIRS } from "../../types/slots";

// Seat positions around the table (8 seats to match the layout reference).
const PLAYER_POSITIONS = [
  "top",
  "topLeft",
  "topRight",
  "right",
  "bottomRight",
  "bottom",
  "bottomLeft",
  "left",
] as const;

type PlayerHandsProps = {
  assignedCards: Partial<Record<SlotId, CardId>>;
  selectedSlot?: SlotId;
  onSlotClick: (slotId: SlotId) => void;
};

// Layout-only component that renders player hands around the table.
export default function PlayerHands({
  assignedCards,
  selectedSlot,
  onSlotClick,
}: PlayerHandsProps) {
  return (
    <div className={styles.players}>
      {/* Render placeholder two-card hands around the table edge. */}
      {PLAYER_POSITIONS.map((position, index) => {
        const [firstSlot, secondSlot] = PLAYER_HAND_SLOT_PAIRS[index];
        return (
          <div
            key={position}
            className={`${styles.player} ${styles[position]}`}
          >
            <span className={styles.label}>{`Player${index + 1}`}</span>
            <div className={styles.hand}>
              {/* Placeholder slots for player cards. */}
              <CardSlot
                value={assignedCards[firstSlot]}
                isActive={selectedSlot === firstSlot}
                onClick={() => onSlotClick(firstSlot)}
              />
              <CardSlot
                value={assignedCards[secondSlot]}
                isActive={selectedSlot === secondSlot}
                onClick={() => onSlotClick(secondSlot)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
