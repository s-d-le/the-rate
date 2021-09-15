import React, { FC, useState } from "react";
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
  const [base, setBase] = useState<string>("");
  const [target, setTarget] = useState<string>("");
  //Let's not multiply by zero
  const [rate, setRate] = useState<number>(1);
  const exchangeRate = `${process.env.REACT_APP_ALPHA_URL}/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${base}&to_currency=${target}&apikey=${process.env.REACT_APP_ALPHA_KEY}`;

  const currencyList = CurrencyList.getAll("en_US");

  const sendIt = async () => {
    try {
      await fetch(exchangeRate)
        .then((response) => console.log(response))
        .then((data) => console.log(data));
    } catch (error) {
      console.log("😱 Error: ", error);
    }
  };

  return (
    <div className="App">
      <h1>Base</h1>
      <CurrencyDropDown
        placeholder="Select your base currency"
        currencyList={currencyList}
        selectedCurrency={base}
        onChange={(event) => {
          event.preventDefault();
          setBase(event.target.value);
        }}
      />
      <h1>Target</h1>
      <CurrencyDropDown
        placeholder="Select your target currency"
        currencyList={currencyList}
        selectedCurrency={target}
        onChange={(event) => {
          event.preventDefault();
          setTarget(event.target.value);
        }}
      />
      <button onClick={sendIt}>Get rate</button>
    </div>
  );
}

export default App;
