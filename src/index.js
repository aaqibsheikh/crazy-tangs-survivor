import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from 'react-router-dom'
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./styles/reset.css";
import { ChainId, DAppProvider } from '@usedapp/core';

require('dotenv').config()

const config = {
  pollingInterval: 5000,
  autoConnect: true,
  readOnlyChainId: ChainId.CronosTestnet,
  readOnlyUrls: {
    [ChainId.CronosTestnet]: process.env.REACT_APP_CRONOS_RPC
  }
};

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <DAppProvider config={config}>
        <App />
      </DAppProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals()