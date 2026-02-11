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
  PLAYER_HAND_SLOTS,
  PLAYER_HAND_SLOT_PAIRS,
} from "../../types/slots";

// App-level shell that wires table interactions, backend odds calls, and stats display
export default function AppShell() {
  // "Hero" is player 1 (the user). We use these slot IDs to gate auto-calculation
  const [heroSlotA, heroSlotB] = PLAYER_HAND_SLOT_PAIRS[0];

  // Type guards help TS know which slot group we are dealing with
  const isBoardSlot = (slotId: SlotId): slotId is BoardSlot =>
    BOARD_SLOTS.includes(slotId as BoardSlot);

  const isPlayerHandSlot = (slotId: SlotId): slotId is PlayerHandSlot =>
    PLAYER_HAND_SLOTS.includes(slotId as PlayerHandSlot);

  // Currently active slot to receive the next dealt card from the deck
  const [selectedSlot, setSelectedSlot] = useState<SlotId | undefined>();

  // Map of slot id -> assigned card id for both hand and board slots
  const [assignedCards, setAssignedCards] = useState<
    Partial<Record<SlotId, CardId>>
  >({});

  // When a deck card is clicked, snap it into the active slot and advance
  const handleCardClick = (id: CardId) => {
    if (!selectedSlot) {
      // Ignore deck clicks until a slot is selected
      return;
    }

    setAssignedCards((prev) => {
      // Board clicks always fill the first empty board slot
      const isBoardSelection = isBoardSlot(selectedSlot);
      const firstEmptyBoardSlot = BOARD_SLOTS.find((slot) => !prev[slot]);
      const targetSlot = isBoardSelection ? firstEmptyBoardSlot : selectedSlot;

      if (!targetSlot) {
        // No available target, so keep the prior assignment map
        return prev;
      }

      // Persist the assignment for the active slot
      const updated = {
        ...prev,
        [targetSlot]: id,
      };

      // Auto-advance within the same player's two-card hand
      if (isPlayerHandSlot(targetSlot)) {
        const currentIndex = PLAYER_HAND_SLOTS.indexOf(targetSlot);
        const nextHandSlot = PLAYER_HAND_SLOTS.slice(currentIndex + 1).find(
          (slot) => !updated[slot],
        );

        // After filling all 16 player slots, move to the first open board slot.
        setSelectedSlot(
          nextHandSlot ?? BOARD_SLOTS.find((slot) => !updated[slot]),
        );
      }

      // Auto-advance along the board in left-to-right order
      if (isBoardSelection) {
        // Keep the board selection on the next empty slot
        const nextBoardSlot = BOARD_SLOTS.find((slot) => !updated[slot]);
        setSelectedSlot(nextBoardSlot);
      }

      return updated;
    });
  };

  // Toggle selection for a slot on the table/overlay
  const handleSlotClick = (slotId: SlotId) => {
    if (assignedCards[slotId]) {
      // Clicking a filled slot removes the card (returns it to the deck)
      setAssignedCards((prev) => {
        if (isBoardSlot(slotId)) {
          // Shift remaining board cards left after a removal
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
          // Keep selection on the next empty board slot
          setSelectedSlot(BOARD_SLOTS.find((slot) => !updated[slot]));
          return updated;
        }

        const updated = { ...prev };
        delete updated[slotId];
        // Keep selection on the cleared slot for quick re-deal
        setSelectedSlot(slotId);
        return updated;
      });
      return;
    }

    if (isBoardSlot(slotId)) {
      // Board selections always target the first empty board slot
      const firstEmptyBoardSlot = BOARD_SLOTS.find(
        (slot) => !assignedCards[slot],
      );
      setSelectedSlot(firstEmptyBoardSlot);
      return;
    }

    setSelectedSlot((prev) => (prev === slotId ? undefined : slotId));
  };

  // Used card list for disabling them in the deck
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
