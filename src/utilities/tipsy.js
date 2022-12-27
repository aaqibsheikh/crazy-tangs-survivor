import whiteListProof from '../abi/wlProofs.json';
import tdProof from '../abi/tdProofs.json';

export function tierWhiteListProof(account) {
  let obj = {tier: "", proof: []};
  for(let i = 0; i < whiteListProof.length; i++) {
    if(whiteListProof[i].address === account) {

      obj = {tier: whiteListProof[i].data, proof: whiteListProof[i].proof};
    }
  }
  return obj;
}

export function tierDiamondProof(account) {
  let obj = {tier: "", proof: []};
  for(let i = 0; i < tdProof.length; i++) {
    if(tdProof[i].address === account) {

      obj = {tier: parseInt(tdProof[i].data), proof: tdProof[i].proof};
    }
  }
  return obj;
}