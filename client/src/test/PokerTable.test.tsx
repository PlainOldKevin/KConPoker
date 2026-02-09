import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PokerTable from "../components/PokerTable/PokerTable";

const baseProps = {
  assignedCards: {},
  selectedSlot: undefined,
  onSlotClick: vi.fn(),
};

describe("PokerTable", () => {
  it("renders the table branding", () => {
    render(<PokerTable {...baseProps} />);

    expect(screen.getByText("KConPoker.io")).toBeTruthy();
  });

  it("renders board and player slots", () => {
    render(<PokerTable {...baseProps} />);

    expect(screen.getAllByRole("button")).toHaveLength(21);
  });

  it("passes slot selection down to slots", () => {
    render(
      <PokerTable
        {...baseProps}
        selectedSlot="board-1"
        assignedCards={{ "board-1": "Ah" }}
      />,
    );

    const buttons = screen.getAllByRole("button");
    expect(
      buttons.some((button) => button.getAttribute("aria-pressed") === "true"),
    ).toBe(true);
  });
});
