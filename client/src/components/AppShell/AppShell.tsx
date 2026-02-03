import { useState } from "react";
import styles from "./AppShell.module.css";
import PokerTable from "../PokerTable/PokerTable";
import DeckPanel from "../DeckPanel/DeckPanel";
import ResetButton from "../ResetButton/ResetButton";
import RankStats from "../RankStats/RankStats";
import PlayerStats from "../PlayerStats/PlayerStats";
import type { CardId } from "../../types/cards";
import type { PlayerHandSlot, SlotId } from "../../types/slots";
import {
  BOARD_SLOTS,
  PLAYER_HAND_SLOT_PAIRS,
  PLAYER_HAND_SLOTS,
} from "../../types/slots";

// App-level shell that wires the table, deck, and stats components together.
export default function AppShell() {
  // Currently active slot to receive the next dealt card from the deck.
  const [selectedSlot, setSelectedSlot] = useState<SlotId | undefined>();
  // Map of slot id -> assigned card id for both hand and board slots.
  const [assignedCards, setAssignedCards] = useState<
    Partial<Record<SlotId, CardId>>
  >({});

  // When a deck card is clicked, snap it into the active slot and advance.
  const handleCardClick = (id: CardId) => {
    if (!selectedSlot) {
      return;
    }

    setAssignedCards((prev) => {
      const isBoardSlot = BOARD_SLOTS.includes(selectedSlot);
      const firstEmptyBoardSlot = BOARD_SLOTS.find((slot) => !prev[slot]);
      const targetSlot = isBoardSlot
        ? firstEmptyBoardSlot
        : selectedSlot;

      if (!targetSlot) {
        return prev;
      }

      // Persist the assignment for the active slot.
      const updated = {
        ...prev,
        [targetSlot]: id,
      };

      // Auto-advance within the same player's two-card hand.
      if (PLAYER_HAND_SLOTS.includes(targetSlot as PlayerHandSlot)) {
        const pair = PLAYER_HAND_SLOT_PAIRS.find((slots) =>
          slots.includes(targetSlot as PlayerHandSlot),
        );
        if (pair) {
          const nextSlot = pair.find(
            (slot) => slot !== targetSlot && !updated[slot],
          );
          setSelectedSlot(nextSlot);
        }
      }

      // Auto-advance along the board in left-to-right order.
      if (isBoardSlot) {
        const nextBoardSlot = BOARD_SLOTS.find((slot) => !updated[slot]);
        setSelectedSlot(nextBoardSlot);
      }

      return updated;
    });
  };

  // Toggle selection for a slot on the table/overlay.
  const handleSlotClick = (slotId: SlotId) => {
    if (assignedCards[slotId]) {
      setAssignedCards((prev) => {
        if (BOARD_SLOTS.includes(slotId)) {
          const remaining = BOARD_SLOTS.filter(
            (slot) => slot !== slotId && prev[slot],
          ).map((slot) => prev[slot]);
          const updated = { ...prev };
          BOARD_SLOTS.forEach((slot, index) => {
            if (remaining[index]) {
              updated[slot] = remaining[index];
            } else {
              delete updated[slot];
            }
          });
          setSelectedSlot(BOARD_SLOTS.find((slot) => !updated[slot]));
          return updated;
        }

        const updated = { ...prev };
        delete updated[slotId];
        setSelectedSlot(slotId);
        return updated;
      });
      return;
    }

    if (BOARD_SLOTS.includes(slotId)) {
      const firstEmptyBoardSlot = BOARD_SLOTS.find(
        (slot) => !assignedCards[slot],
      );
      setSelectedSlot(firstEmptyBoardSlot);
      return;
    }

    setSelectedSlot((prev) => (prev === slotId ? undefined : slotId));
  };

  // Used card list for disabling them in the deck.
  const usedCards = Object.values(assignedCards).filter(
    (cardId): cardId is CardId => Boolean(cardId),
  );

  return (
    <div className={styles.shell}>
      <PokerTable
        assignedCards={assignedCards}
        selectedSlot={selectedSlot}
        onSlotClick={handleSlotClick}
      />
      <DeckPanel usedCards={usedCards} onCardClick={handleCardClick} />
      <RankStats />
      <PlayerStats />
      <ResetButton />
    </div>
  );
}
