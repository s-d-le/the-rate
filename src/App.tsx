import React, { FC, useState } from "react";
import "./App.css";
import CurrencyList from "currency-list";

interface ICurrencyDropDown {
  currencyList: {};
  selectedCurrency: string;
}

const CurrencyDropDown: FC<ICurrencyDropDown> = ({
  currencyList,
  selectedCurrency,
}) => {
  return (
    <select value={selectedCurrency}>
      {Object.keys(currencyList).map((keyName) => (
        <option key={keyName} value="keyName">
          {keyName}
        </option>
      ))}
    </select>
  );
};

function App() {
  const [base, setBase] = useState<string>("");
  const [target, setTarget] = useState<string>("");
  const exchangeRate = `${process.env.REACT_APP_ALPHA_URL}/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${base}&to_currency=${target}&apikey=${process.env.REACT_APP_ALPHA_KEY}`;

  const currencyList = CurrencyList.getAll("en_US");

  const setCurrency = () => {};

  return (
    <div className="App">
      <h1>Base</h1>
      <CurrencyDropDown currencyList={currencyList} selectedCurrency={base} />
      <h1>Target</h1>
      <CurrencyDropDown currencyList={currencyList} selectedCurrency={target} />
    </div>
  );
}

export default App;
