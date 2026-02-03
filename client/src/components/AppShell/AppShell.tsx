import { useState } from "react";
import styles from "./AppShell.module.css";
import PokerTable from "../PokerTable/PokerTable";
import DeckPanel from "../DeckPanel/DeckPanel";
import ResetButton from "../ResetButton/ResetButton";
import RankStats from "../RankStats/RankStats";
import PlayerStats from "../PlayerStats/PlayerStats";
import type { CardId } from "../../types/cards";
import type { BoardSlot, PlayerHandSlot, SlotId } from "../../types/slots";
import {
  BOARD_SLOTS,
  PLAYER_HAND_SLOT_PAIRS,
  PLAYER_HAND_SLOTS,
} from "../../types/slots";

// App-level shell that wires the table, deck, and stats components together.
export default function AppShell() {
  // v2: Type guards help TS know which slot group we are dealing with.
  const isBoardSlot = (slotId: SlotId): slotId is BoardSlot =>
    BOARD_SLOTS.includes(slotId as BoardSlot);
  const isPlayerHandSlot = (slotId: SlotId): slotId is PlayerHandSlot =>
    PLAYER_HAND_SLOTS.includes(slotId as PlayerHandSlot);
  // Currently active slot to receive the next dealt card from the deck.
  const [selectedSlot, setSelectedSlot] = useState<SlotId | undefined>();
  // Map of slot id -> assigned card id for both hand and board slots.
  const [assignedCards, setAssignedCards] = useState<
    Partial<Record<SlotId, CardId>>
  >({});

  // When a deck card is clicked, snap it into the active slot and advance.
  const handleCardClick = (id: CardId) => {
    if (!selectedSlot) {
      // v2: Ignore deck clicks until a slot is selected.
      return;
    }

    setAssignedCards((prev) => {
      // v2: Board clicks always fill the first empty board slot.
      const isBoardSelection = isBoardSlot(selectedSlot);
      const firstEmptyBoardSlot = BOARD_SLOTS.find((slot) => !prev[slot]);
      const targetSlot = isBoardSelection
        ? firstEmptyBoardSlot
        : selectedSlot;

      if (!targetSlot) {
        // v2: No available target, so keep the prior assignment map.
        return prev;
      }

      // Persist the assignment for the active slot.
      const updated = {
        ...prev,
        [targetSlot]: id,
      };

      // Auto-advance within the same player's two-card hand.
      if (isPlayerHandSlot(targetSlot)) {
        // v2: Find the two-card pair that contains this slot.
        const pair = PLAYER_HAND_SLOT_PAIRS.find((slots) =>
          slots.includes(targetSlot),
        );
        if (pair) {
          // v2: Jump to the other slot in the pair if it is empty.
          const nextSlot = pair.find(
            (slot) => slot !== targetSlot && !updated[slot],
          );
          setSelectedSlot(nextSlot);
        }
      }

      // Auto-advance along the board in left-to-right order.
      if (isBoardSelection) {
        // v2: Keep the board selection on the next empty slot.
        const nextBoardSlot = BOARD_SLOTS.find((slot) => !updated[slot]);
        setSelectedSlot(nextBoardSlot);
      }

      return updated;
    });
  };

  // Toggle selection for a slot on the table/overlay.
  const handleSlotClick = (slotId: SlotId) => {
    if (assignedCards[slotId]) {
      // v2: Clicking a filled slot removes the card (returns it to the deck).
      setAssignedCards((prev) => {
        if (isBoardSlot(slotId)) {
          // v2: Shift remaining board cards left after a removal.
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
          // v2: Keep selection on the next empty board slot.
          setSelectedSlot(BOARD_SLOTS.find((slot) => !updated[slot]));
          return updated;
        }

        const updated = { ...prev };
        delete updated[slotId];
        // v2: Keep selection on the cleared slot for quick re-deal.
        setSelectedSlot(slotId);
        return updated;
      });
      return;
    }

    if (isBoardSlot(slotId)) {
      // v2: Board selections always target the first empty board slot.
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
