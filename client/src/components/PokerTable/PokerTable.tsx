import styles from "./PokerTable.module.css";
import overlayStyles from "./TableOverlay.module.css";
import Board from "./Board";
import PlayerHands from "./PlayerHands";
import type { CardId } from "../../types/cards";
import type { SlotId } from "../../types/slots";

type PokerTableProps = {
  assignedCards: Partial<Record<SlotId, CardId>>;
  selectedSlot?: SlotId;
  onSlotClick: (slotId: SlotId) => void;
};

// Table shell that composes the felt, players, and centered board overlay.
export default function PokerTable({
  assignedCards,
  selectedSlot,
  onSlotClick,
}: PokerTableProps) {
  return (
    <div className={styles.tableArea}>
      <span className={styles.branding}>KConPoker.io</span>
      {/* Felt surface */}
      <div className={styles.table}></div>
      {/* Player hands arrayed around the table edge */}
      <PlayerHands
        assignedCards={assignedCards}
        selectedSlot={selectedSlot}
        onSlotClick={onSlotClick}
      />
      {/* Centered board overlay */}
      <div className={overlayStyles.overlay}>
        <Board
          assignedCards={assignedCards}
          selectedSlot={selectedSlot}
          onSlotClick={onSlotClick}
        />
      </div>
    </div>
  );
}
