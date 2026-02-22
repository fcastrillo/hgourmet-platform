import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "@/components/storefront/SearchBar";

describe("SearchBar", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders search input with placeholder", () => {
    render(<SearchBar onSearch={vi.fn()} />);
    expect(
      screen.getByPlaceholderText("Buscar productos...")
    ).toBeInTheDocument();
  });

  it("has accessible label", () => {
    render(<SearchBar onSearch={vi.fn()} />);
    expect(screen.getByLabelText("Buscar productos")).toBeInTheDocument();
  });

  it("shows clear button only when input has text", () => {
    render(<SearchBar onSearch={vi.fn()} />);

    expect(
      screen.queryByLabelText("Limpiar búsqueda")
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Buscar productos"), {
      target: { value: "test" },
    });

    expect(screen.getByLabelText("Limpiar búsqueda")).toBeInTheDocument();
  });

  it("clears input when clear button is clicked", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={vi.fn()} />);

    const input = screen.getByLabelText("Buscar productos");
    fireEvent.change(input, { target: { value: "chocolate" } });
    expect(input).toHaveValue("chocolate");

    await user.click(screen.getByLabelText("Limpiar búsqueda"));
    expect(input).toHaveValue("");
  });

  it("calls onSearch with debounced value after 300ms", () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    // Clear initial mount call
    act(() => {
      vi.advanceTimersByTime(300);
    });
    onSearch.mockClear();

    fireEvent.change(screen.getByLabelText("Buscar productos"), {
      target: { value: "choc" },
    });

    // Before debounce
    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(
      onSearch.mock.calls.filter((args) => args[0] === "choc")
    ).toHaveLength(0);

    // After debounce
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(
      onSearch.mock.calls.filter((args) => args[0] === "choc")
    ).toHaveLength(1);
  });
});
