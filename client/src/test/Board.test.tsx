import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Board from "../components/PokerTable/Board/Board";

describe("Board", () => {
  it("renders five board slots", () => {
    render(
      <Board
        assignedCards={{}}
        selectedSlot={undefined}
        onSlotClick={vi.fn()}
      />,
    );

    expect(screen.getAllByRole("button")).toHaveLength(5);
  });

  it("renders assigned board cards", () => {
    render(
      <Board
        assignedCards={{
          "board-1": "Ah",
          "board-2": "Kd",
          "board-3": "Qc",
        }}
        selectedSlot={undefined}
        onSlotClick={vi.fn()}
      />,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons[0].textContent).toBe("A♥");
    expect(buttons[1].textContent).toBe("K♦");
    expect(buttons[2].textContent).toBe("Q♣");
  });

  it("calls onSlotClick when a slot is clicked", async () => {
    const user = userEvent.setup();
    const onSlotClick = vi.fn();

    render(
      <Board
        assignedCards={{}}
        selectedSlot={undefined}
        onSlotClick={onSlotClick}
      />,
    );

    await user.click(screen.getAllByRole("button")[0]);

    expect(onSlotClick).toHaveBeenCalledWith("board-1");
  });
});
