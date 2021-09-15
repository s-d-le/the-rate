import React, { useState } from "react";
import "./App.css";
import CurrencyList from "currency-list";

function App() {
  const [base, setBase] = useState<string>("");
  const [target, setTarget] = useState<string>("");
  const exchangeRate = `${process.env.REACT_APP_ALPHA_URL}/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${base}&to_currency=${target}&apikey=${process.env.REACT_APP_ALPHA_KEY}`;

  const currencyList = CurrencyList.getAll("en_US");

  const currencyDropDown = () => {
    return (
      <>
        {Object.keys(currencyList).map((keyName) => (
          <li className="travelcompany-input" key={keyName}>
            <span className="input-label">Name: {keyName}</span>
          </li>
        ))}
      </>
    );
  };

  return (
    <div className="App">
      <h1>Hello there</h1>
      {currencyDropDown()}
    </div>
  );
}

export default App;
