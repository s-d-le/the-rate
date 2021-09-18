import React, { FC } from "react";

interface ICurrencyDropDown {
  placeholder: string;
  currencyList: {};
  selectedCurrency: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CurrencyDropDown: FC<ICurrencyDropDown> = ({
  placeholder,
  currencyList,
  selectedCurrency,
  onChange,
}) => {
  return (
    <div className="select-container">
      <select
        value={selectedCurrency}
        onChange={onChange}
        className="select-list"
        data-testid="dropdown"
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {Object.keys(currencyList).map((keyName) => (
          <option key={keyName} value={keyName}>
            {keyName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencyDropDown;
