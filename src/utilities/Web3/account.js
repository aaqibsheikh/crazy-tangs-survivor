import Web3 from "web3";

export async function checkMetaMaskEnable() {
  if(window.web3 === undefined) {
    return false;
  }

  if(window.ethereum === undefined) {
    return false
  }
  return true;

}
export async function getAccount() {
  const web3 = new Web3(window.ethereum);
  const accounts = await web3.eth.getAccounts()
  return accounts[0];
}

export async function connectWallet() {
  const ethereum = window.ethereum;
  if (ethereum) {
    const a = await ethereum.send('eth_requestAccounts')
    // console.log(a)
    return true
  }
  return false
}

export async function getChainId() {
  const web3 = new Web3(window.ethereum);
  return web3.eth.net.getId();
}

export async function getBalance(address) {
  const web3 = new Web3(window.ethereum);
  const balance = await web3.eth.getBalance(address);
  return balance;
};

export async function isValidChain() {
  const validChainId = process.env.REACT_APP_CHAIN;
  const currentChainId = await getChainId();
  return +validChainId === +currentChainId;
};
