import axios from "axios";
import { useState, useEffect } from "react";
import "./App.css";
import bitcoin from "./assets/bitcoin.png";
import euro from "./assets/euro.png";
import dolar from "./assets/dolar.png";

function App() {
  // Estado para os dados do Bitcoin
  const [btcData, setBtcData] = useState({
    high: "0",
    low: "0",
    vol: "0",
    last: "0",
    buy: "0",
    sell: "0",
    open: "0",
    date: 0,
    pair: "",
  });

  // Estado para os dados do Dólar
  const [usdData, setUsdData] = useState({
    code: "",
    codein: "",
    name: "",
    high: "0",
    low: "0",
    varBid: "0",
    pctChange: "0",
    bid: "0",
    ask: "0",
    timestamp: "0",
    create_date: "",
  });

  // Estado para os dados do Euro
  const [eurData, setEurData] = useState({
    code: "",
    codein: "",
    name: "",
    high: "0",
    low: "0",
    varBid: "0",
    pctChange: "0",
    bid: "0",
    ask: "0",
    timestamp: "0",
    create_date: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      // Faz as duas requisições em paralelo
      const [btcResponse, usdResponse, eurResponse] = await Promise.all([
        axios.get("https://www.mercadobitcoin.net/api/BTC/ticker/"),
        axios.get("https://economia.awesomeapi.com.br/json/last/USD-BRL"),
        axios.get("https://economia.awesomeapi.com.br/json/last/EUR-BRL"),
      ]);

      setBtcData(btcResponse.data.ticker);
      setUsdData(usdResponse.data.USDBRL);
      setEurData(eurResponse.data.EURBRL);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Carrega os dados imediatamente
    fetchData();

    // Configura o intervalo para atualizar a cada 5 segundos
    const intervalId = setInterval(fetchData, 5000);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar dados: {error.message}</div>;

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  // Calcula o valor do Bitcoin em dólares
  const btcInUsd = parseFloat(btcData.last) / parseFloat(usdData.bid);

  return (
    <>
      <h1>Mercados - React</h1>

      <div className="ticker-container">
        <div className="ticker-data">
          <div className="ticker-header">
            <h2>Cotação Bitcoin</h2>
            <span>
              <img src={bitcoin} />
            </span>
          </div>
          <p>Par: {btcData.pair}</p>
          <p>
            Último preço:{" "}
            <span className="lastp1">
              R$
              {parseFloat(btcData.last).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
            </span>
          </p>

          <p className="lastp">
            Em dólares: ${" "}
            {btcInUsd.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>

          <p>
            Compra: R${" "}
            {parseFloat(btcData.buy).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p>
            Venda: R${" "}
            {parseFloat(btcData.sell).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p>
            Máxima: R${" "}
            {parseFloat(btcData.high).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p>
            Mínima: R${" "}
            {parseFloat(btcData.low).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p>Volume: {parseFloat(btcData.vol).toLocaleString("pt-BR")} BTC</p>
          <p className="last">Última atualização: {formatDate(btcData.date)}</p>
        </div>

        <div className="ticker-data">
          <div className="ticker-header">
            <h2>Cotação Dólar</h2>
            <span>
              <img src={dolar} />
            </span>
          </div>
          <p>Par: {usdData.name}</p>
          <p>
            Compra:{" "}
            <span className="lastp1">
              R${" "}
              {parseFloat(usdData.bid).toLocaleString("pt-BR", {
                minimumFractionDigits: 4,
                maximumFractionDigits: 4,
              })}
            </span>
          </p>
          <p>
            Venda: R${" "}
            {parseFloat(usdData.ask).toLocaleString("pt-BR", {
              minimumFractionDigits: 4,
              maximumFractionDigits: 4,
            })}
          </p>
          <p>
            Máxima: R${" "}
            {parseFloat(usdData.high).toLocaleString("pt-BR", {
              minimumFractionDigits: 4,
              maximumFractionDigits: 4,
            })}
          </p>
          <p>
            Mínima: R${" "}
            {parseFloat(usdData.low).toLocaleString("pt-BR", {
              minimumFractionDigits: 4,
              maximumFractionDigits: 4,
            })}
          </p>
          <p>
            Variação: {parseFloat(usdData.varBid).toLocaleString("pt-BR")} (
            {parseFloat(usdData.pctChange).toLocaleString("pt-BR")}%)
          </p>
          <p className="last">
            Última atualização:{" "}
            {new Date(usdData.timestamp * 1000).toLocaleString()}
          </p>
        </div>

        <div className="ticker-data">
          <div className="ticker-header">
            <h2>Cotação Euro</h2>
            <span>
              <img src={euro} />
            </span>
          </div>
          <p>Par: {eurData.name}</p>
          <p>
            Compra:{" "}
            <span className="lastp1">
              R${" "}
              {parseFloat(eurData.bid).toLocaleString("pt-BR", {
                minimumFractionDigits: 4,
                maximumFractionDigits: 4,
              })}
            </span>
          </p>
          <p>
            Venda: R${" "}
            {parseFloat(eurData.ask).toLocaleString("pt-BR", {
              minimumFractionDigits: 4,
              maximumFractionDigits: 4,
            })}
          </p>
          <p>
            Máxima: R${" "}
            {parseFloat(eurData.high).toLocaleString("pt-BR", {
              minimumFractionDigits: 4,
              maximumFractionDigits: 4,
            })}
          </p>
          <p>
            Mínima: R${" "}
            {parseFloat(eurData.low).toLocaleString("pt-BR", {
              minimumFractionDigits: 4,
              maximumFractionDigits: 4,
            })}
          </p>
          <p>
            Variação: {parseFloat(eurData.varBid).toLocaleString("pt-BR")} (
            {parseFloat(eurData.pctChange).toLocaleString("pt-BR")}%)
          </p>
          <p className="last">
            Última atualização:{" "}
            {new Date(eurData.timestamp * 1000).toLocaleString()}
          </p>
        </div>
      </div>

      <p className="update-notice">Atualizando a cada 5 segundos...</p>
    </>
  );
}

export default App;
