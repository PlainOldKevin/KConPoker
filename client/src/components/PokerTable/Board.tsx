import CardSlot from "../CardSlot/CardSlot";
import styles from "./TableOverlay.module.css";
import type { CardId } from "../../types/cards";
import type { SlotId } from "../../types/slots";
import { BOARD_SLOTS } from "../../types/slots";

type BoardProps = {
  assignedCards: Partial<Record<SlotId, CardId>>;
  selectedSlot?: SlotId;
  onSlotClick: (slotId: SlotId) => void;
};

// Renders community cards with a flop group and turn/river group.
export default function Board({
  assignedCards,
  selectedSlot,
  onSlotClick,
}: BoardProps) {
  // Explicit flop/turn/river slot order for spacing between groups.
  const [flop1, flop2, flop3, turn, river] = BOARD_SLOTS;

  return (
    // Board grouping keeps a visible gap between the flop and turn/river cards.
    <div className={styles.boardRow}>
      <div className={styles.boardGroup}>
        {/* Flop (3 cards). */}
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
        {/* Turn + river (2 cards). */}
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
