import { render, screen, fireEvent } from "@testing-library/react";

import CurrencyDropdown from "./CurrencyDropdown";

describe("Test CurrencyDropdown Component", () => {
  const props = {
    placeholder: "test placeholder",
    currencyList: { USD: {} },
    selectedCurrency: "",
    onChange: jest.fn(),
  };

  it("should render", () => {
    const { container } = render(<CurrencyDropdown {...props} />);

    expect(container.firstChild).toBeTruthy();
  });

  it("should have currency list", () => {
    render(<CurrencyDropdown {...props} />);

    // This matches the currencyList in the mock props
    const dropdown = screen.getAllByText(Object.keys(props.currencyList)[0]);

    expect(dropdown[0]).toBeInTheDocument();
  });
});
