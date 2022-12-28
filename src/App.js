import React, { useEffect, useState, useRef } from "react";

import WalletConnectProvider from '@walletconnect/web3-provider'
import { useEthers, ChainId } from '@usedapp/core'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import MyRouts from './routers/routes';


function App() {

  const {
    activateBrowserWallet,
    account,
    active,
    activate,
    deactivate,
    switchNetwork,
    chainId,
    error
  } = useEthers()

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }
  });

  
  useEffect(() => {
   
    const checkWalletConnectSession = async () => {
      if (window.localStorage.walletconnect) {
        const provider = new WalletConnectProvider({
          qrcode: true,
          bridge: 'https://bridge.walletconnect.org',
          rpc: {
            [ChainId.Cronos]: process.env.REACT_APP_CRONOS_RPC,
          },
          chainId: ChainId.Cronos
        })
        await provider.enable()
        await activate(provider)
      }
    }
    
    checkWalletConnectSession()
    if (account && active && ChainId.Cronos !== chainId) {
      toast.error('Connect to Cronos Chain and refresh page', {
        position: 'bottom-right',
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
    console.log(
      'process.env.REACT_APP_CRONOS_RPC',
      process.env.REACT_APP_CRONOS_RPC,
    )
  }, [chainId])


  return (
    <>
      <ToastContainer />
      <MyRouts />
    </>
  );
}

export default App;
