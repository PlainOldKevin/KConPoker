import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CardSlot from "../components/PokerTable/CardSlot/CardSlot";

describe("CardSlot", () => {
  it("renders a placeholder when empty", () => {
    render(<CardSlot onClick={vi.fn()} />);

    expect(screen.getByRole("button").textContent).toBe("—");
  });

  it("renders a card label when value is provided", () => {
    render(<CardSlot value="Ah" onClick={vi.fn()} />);

    expect(screen.getByRole("button").textContent).toBe("A♥");
  });

  it("marks slot as active when selected", () => {
    render(<CardSlot value="Kd" isActive onClick={vi.fn()} />);

    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe(
      "true",
    );
  });
});
