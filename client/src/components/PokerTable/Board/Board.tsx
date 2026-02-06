import CardSlot from "../CardSlot/CardSlot";
import styles from "../TableOverlay.module.css";
import type { CardId } from "../../../types/cards";
import type { SlotId } from "../../../types/slots";
import { BOARD_SLOTS } from "../../../types/slots";

// Form of props to be passed
type BoardProps = {
  assignedCards: Partial<Record<SlotId, CardId>>;
  selectedSlot?: SlotId;
  onSlotClick: (slotId: SlotId) => void;
};

// Renders community cards with a flop group and turn/river group
export default function Board({
  assignedCards,
  selectedSlot,
  onSlotClick,
}: BoardProps) {
  // Board slots destructured and renamed for clarity
  const [flop1, flop2, flop3, turn, river] = BOARD_SLOTS;

  // Renders the board
  return (
    <div className={styles.boardRow}>
      <div className={styles.boardGroup}>
        {/* Flop card slots */}
        {[flop1, flop2, flop3].map((slotId) => (
          <CardSlot
            key={slotId}
            value={assignedCards[slotId]}
            isActive={selectedSlot === slotId}
            onClick={() => onSlotClick(slotId)}
          />
        ))}
      </div>
      <div className={styles.boardGroup}>
        {/* Turn + river card slots */}
        {[turn, river].map((slotId) => (
          <CardSlot
            key={slotId}
            value={assignedCards[slotId]}
            isActive={selectedSlot === slotId}
            onClick={() => onSlotClick(slotId)}
          />
        ))}
      </div>
    </div>
  );
}
