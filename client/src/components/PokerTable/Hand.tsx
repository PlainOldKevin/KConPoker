import CardSlot from "../CardSlot/CardSlot";
import styles from "./TableOverlay.module.css";
import type { CardId } from "../../types/cards";
import type { SlotId } from "../../types/slots";
import { PLAYER_HAND_SLOT_PAIRS } from "../../types/slots";

type HandProps = {
  assignedCards: Partial<Record<SlotId, CardId>>;
  selectedSlot?: SlotId;
  onSlotClick: (slotId: SlotId) => void;
  slotIds?: readonly [SlotId, SlotId];
};

// Renders the two hole-card slots for the current hand.
export default function Hand({
  assignedCards,
  selectedSlot,
  onSlotClick,
  slotIds = PLAYER_HAND_SLOT_PAIRS[0],
}: HandProps) {
  return (
    // Map the fixed hand slots into slot buttons.
    <div className={styles.row}>
      {slotIds.map((slotId) => (
        <CardSlot
          key={slotId}
          value={assignedCards[slotId]}
          isActive={selectedSlot === slotId}
          onClick={() => onSlotClick(slotId)}
        />
      ))}
    </div>
  );
}
