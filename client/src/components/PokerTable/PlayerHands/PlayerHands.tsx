import CardSlot from "../CardSlot/CardSlot";
import styles from "./PlayerHands.module.css";
import type { CardId } from "../../../types/cards";
import type { SlotId } from "../../../types/slots";
import { PLAYER_HAND_SLOT_PAIRS } from "../../../types/slots";

// Ordered seat classes used to position each player's two-card hand around the table
const PLAYER_POSITIONS = [
  "top",
  "topRight",
  "right",
  "bottomRight",
  "bottom",
  "bottomLeft",
  "left",
  "topLeft",
] as const;

// Form of props to be passed
type PlayerHandsProps = {
  assignedCards: Partial<Record<SlotId, CardId>>;
  selectedSlot?: SlotId;
  onSlotClick: (slotId: SlotId) => void;
};

// Renders the 8-seat ring around the table, each with two interactive card slots
export default function PlayerHands({
  assignedCards, // Shared slot -> card assignment map from AppShell
  selectedSlot, // Optional currently active slot so the selected seat card can be highlighted
  onSlotClick, // Callback to select/remove cards from slots when user clicks a seat card
}: PlayerHandsProps) {
  return (
    // Absolute overlay that sits on top of the felt and contains all seat groups
    <div className={styles.players}>
      {/* Map each seat position to the matching pair of slot ids in PLAYER_HAND_SLOT_PAIRS. */}
      {PLAYER_POSITIONS.map((position, index) => {
        const [firstSlot, secondSlot] = PLAYER_HAND_SLOT_PAIRS[index];

        return (
          // Seat container combines shared seat styling with position-specific placement class
          <div
            key={position}
            className={`${styles.player} ${styles[position]}`}
          >
            {/* Seat label (Player1..Player8) */}
            <span className={styles.label}>{`Player ${index + 1}`}</span>
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
