import React, { FC, useState, useEffect } from "react";
import "./App.css";
import CurrencyList from "currency-list";

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
    <select value={selectedCurrency} onChange={onChange}>
      <option value="" disabled hidden>
        {placeholder}
      </option>
      {Object.keys(currencyList).map((keyName) => (
        <option key={keyName} value={keyName}>
          {keyName}
        </option>
      ))}
    </select>
  );
};

function App() {
  const [baseCurrency, setBaseCurrency] = useState<string>("");
  const [baseAmount, setBaseAmount] = useState<number>(0);
  const [targetCurrency, setTargetCurrency] = useState<string>("");
  const [targetAmount, setTargetAmount] = useState<number>(0);
  const [rate, setRate] = useState<number>(1); //Let's not multiply by zero
  const exchangeRate = `${process.env.REACT_APP_ALPHA_URL}/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${baseCurrency}&to_currency=${targetCurrency}&apikey=${process.env.REACT_APP_ALPHA_KEY}`;

  const currencyList = CurrencyList.getAll("en_US");

  const sendIt = async () => {
    try {
      await fetch(exchangeRate)
        .then((response) => response.json()) //need this or we ll just get a promise
        .then((data) =>
          setRate(data["Realtime Currency Exchange Rate"]["5. Exchange Rate"])
        );
    } catch (error) {
      console.log("😱 Error: ", error);
    }
  };

  /**
   * Force number input only on amount
   */
  const onTargetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      setBaseAmount(e.target.valueAsNumber);
    }
  };

  useEffect(() => {
    setTargetAmount(baseAmount * rate);
  }, [baseAmount, rate]);

  return (
    <div className="App">
      <h1>Base</h1>
      <input
        type="number"
        name="windspeed"
        value={baseAmount}
        onChange={onTargetAmountChange}
        className="autocomplete-input windspeed"
      />
      <CurrencyDropDown
        placeholder="Select your base currency"
        currencyList={currencyList}
        selectedCurrency={baseCurrency}
        onChange={(event) => {
          event.preventDefault();
          setBaseCurrency(event.target.value);
        }}
      />
      <h1>Target</h1>
      <CurrencyDropDown
        placeholder="Select your target currency"
        currencyList={currencyList}
        selectedCurrency={targetCurrency}
        onChange={(event) => {
          event.preventDefault();
          setTargetCurrency(event.target.value);
        }}
      />
      <button onClick={sendIt}>Get rate</button>
      <h1>
        {isNaN(targetAmount) || rate === 1 ? null : targetAmount.toFixed(2)}
      </h1>
    </div>
  );
}

export default App;
