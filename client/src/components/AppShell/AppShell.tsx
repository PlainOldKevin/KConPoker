// Imports
import { useEffect, useMemo, useState } from "react";
import styles from "./AppShell.module.css";
import PokerTable from "../PokerTable/PokerTable";
import DeckPanel from "../DeckPanel/DeckPanel";
import ResetButton from "../ResetButton/ResetButton";
import PlayerStats from "../PlayerStats/PlayerStats";
import type { CardId } from "../../types/cards";
import type { OddsRequest, OddsResponse } from "../../types/odds";
import { evaluateOdds } from "../../services/oddsApi";
import type { BoardSlot, PlayerHandSlot, SlotId } from "../../types/slots";
import {
  BOARD_SLOTS,
  PLAYER_HAND_SLOTS,
  PLAYER_HAND_SLOT_PAIRS,
} from "../../types/slots";

// App-level shell that wires table interactions, backend odds calls, and stats display
export default function AppShell() {
  // Type guards help TS know which slot group we are dealing with
  const isBoardSlot = (slotId: SlotId): slotId is BoardSlot =>
    BOARD_SLOTS.includes(slotId as BoardSlot);

  const isPlayerHandSlot = (slotId: SlotId): slotId is PlayerHandSlot =>
    PLAYER_HAND_SLOTS.includes(slotId as PlayerHandSlot);

  // Active slot to receive the next dealt card from the deck (handle deck clicks)
  const [selectedSlot, setSelectedSlot] = useState<SlotId | undefined>();

  // Map of slot id -> assigned card id for both hand and board slots (Current table state)
  const [assignedCards, setAssignedCards] = useState<
    Partial<Record<SlotId, CardId>>
  >({});

  // "Hero" is player 1 (the user); these slot IDs gate auto-calculation
  const [heroSlotA, heroSlotB] = PLAYER_HAND_SLOT_PAIRS[0];

  // Only run backend odds when hero has a complete two-card hand
  const heroHasCompleteHand =
    Boolean(assignedCards[heroSlotA]) && Boolean(assignedCards[heroSlotB]);

  // Last backend response for odds calculations
  // This remains stable through invalid states while users edit cards
  const [lastValidOddsResponse, setLastValidOddsResponse] = useState<
    OddsResponse | undefined
  >();

  /* Function to build compute eligibility + API payload from current table state */
  // Derive backend request payload from assigned card slots
  const oddsRequest = useMemo<OddsRequest>(() => {
    // Build players in seat order, keeping only seats that currently have cards
    const players = PLAYER_HAND_SLOT_PAIRS.map(([slotA, slotB], index) => {
      const cards = [assignedCards[slotA], assignedCards[slotB]].filter(
        // Remove undefined values when one/both hand slots are empty
        (card): card is CardId => Boolean(card),
      );

      return {
        id: `player-${index + 1}`,
        cards,
      };
    }).filter((player) => player.cards.length > 0);

    // Board cards are sent in order (flop/turn/river slots)
    const board = BOARD_SLOTS.map((slot) => assignedCards[slot]).filter(
      (card): card is CardId => Boolean(card),
    );

    return { players, board };
  }, [assignedCards]);

  // Total players with 2 cards
  const completePlayerCount = oddsRequest.players.filter(
    (player) => player.cards.length === 2,
  ).length;

  // A "partial" player hand (exactly one card) means table state is in-between edits (thus re-calculation is avoided)
  const hasIncompletePlayer = oddsRequest.players.some(
    (player) => player.cards.length === 1,
  );

  // 0 cards on the board or at least a flop
  const isValidBoardCount = [0, 3, 4, 5].includes(oddsRequest.board.length);

  // Only request fresh odds when the table state is fully calculation-ready
  const canRequestOdds =
    heroHasCompleteHand &&
    completePlayerCount >= 2 &&
    !hasIncompletePlayer &&
    isValidBoardCount;

  // Auto-evaluate odds whenever table state is valid
  useEffect(() => {
    // If state is not calculation-ready, keep prior odds visible and skip reques
    if (!canRequestOdds) {
      return;
    }

    // Send request
    const runOdds = async () => {
      try {
        const response = await evaluateOdds(oddsRequest);
        /* Update displayed odds only when backend confirms a valid calculation
           If response is invalid, keep prior valid odds visible  */
        if (response.canCalculate) {
          setLastValidOddsResponse(response);
        }
      } catch {
        // Keep last known-good odds on transient network/backend errors
      }
    };

    runOdds();
  }, [canRequestOdds, oddsRequest]);

  // Derive current panel values from backend response
  const hero = lastValidOddsResponse?.players[0];
  const yourWinPct = hero ? hero.equityPct : 0;
  const yourTiePct = hero ? hero.tiePct : 0;
  const othersWinPct = hero ? 100 - yourWinPct - yourTiePct : 0;
  const othersTiePct = hero ? yourTiePct : 0;

  // When a deck card is clicked, assign it into currently selected slot and advance
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
      <PlayerStats
        yourWinPct={yourWinPct}
        yourTiePct={yourTiePct}
        othersWinPct={othersWinPct}
        othersTiePct={othersTiePct}
      />
      <ResetButton />
    </div>
  );
}
