import React, { FC, useState, useEffect } from "react";
import "./App.scss";
import CurrencyList from "currency-list";
import Chart from "react-google-charts";

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

function App() {
  const [baseCurrency, setBaseCurrency] = useState<string>("EUR");
  const [baseAmount, setBaseAmount] = useState<number>(0);
  const [targetCurrency, setTargetCurrency] = useState<string>("GBP");
  const [targetAmount, setTargetAmount] = useState<number>(0);
  const [rate, setRate] = useState<number>(1); //Let's not multiply by zero
  const [fxData, setFxData] = useState<{}>({}); //Pull stuff from FX_DAILY
  const [chartData, setChartData] = useState<Array<string[] | number[]>>([]); //2D array for GG chartdata

  const exchangeRate = `${process.env.REACT_APP_ALPHA_URL}/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${baseCurrency}&to_currency=${targetCurrency}&apikey=${process.env.REACT_APP_ALPHA_KEY}`;
  const timeSeries = `${process.env.REACT_APP_ALPHA_URL}/query?function=FX_DAILY&from_symbol=${baseCurrency}&to_symbol=${targetCurrency}&apikey=${process.env.REACT_APP_ALPHA_KEY}`;

  /**
   * Get iso currency list from the npm package
   */
  const currencyList = CurrencyList.getAll("en_US");

  /**
   * Cooking the FX data for chart
   * GG candle chart requires a 2d array for data
   * [
   *  [],[]
   * ]
   */
  const chartSorting = (fxData: {}) => {
    // Columns heading
    let chartArray: Array<string[] | number[]> = [
      ["day", "open", "high", "low", "close"],
    ];

    // Turn chart object into 2D chart array
    Object.entries(fxData).forEach(([date, rateObject], index) => {
      chartArray.push([date]);
      // @ts-ignore
      Object.entries(rateObject).forEach(([key, rate]) => {
        // @ts-ignore
        // Skip the first row as it is the columns heading
        chartArray[index + 1].push(parseFloat(rate));
      });
    });

    setChartData(chartArray);
  };

  /**
   * Call Alpha
   */
  const sendIt = async () => {
    /**
     * Get exchange rate
     */
    try {
      await fetch(exchangeRate)
        .then((response) => response.json()) //need this or we ll just get a promise
        .then((data) =>
          setRate(data["Realtime Currency Exchange Rate"]["5. Exchange Rate"])
        );
    } catch (error) {
      console.log("😱 Error: ", error);
    }

    /**
     * Get time series
     */
    try {
      await fetch(timeSeries)
        .then((response) => response.json()) //need this or we ll just get a promise
        .then((data) => setFxData(data["Time Series FX (Daily)"]));
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

  useEffect(() => {
    chartSorting(fxData);
  }, [fxData]);

  return (
    <div className="App">
      <h1>Base</h1>
      <input
        type="number"
        name="base-currency"
        value={baseAmount}
        onChange={onTargetAmountChange}
        className="base-input"
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
      <button onClick={sendIt}>Convert</button>
      <h1>
        {isNaN(targetAmount) || rate === 1 ? null : targetAmount.toFixed(2)}
      </h1>
      {chartData.length > 1 && (
        <Chart
          width={"100%"}
          height={350}
          chartType="CandlestickChart"
          loader={<div>Loading Chart</div>}
          data={chartData}
          options={{
            legend: "none",
          }}
          rootProps={{ "data-testid": "1" }}
        />
      )}
    </div>
  );
}

export default App;
