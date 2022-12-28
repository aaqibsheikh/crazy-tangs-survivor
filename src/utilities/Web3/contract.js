import React, { useEffect, useState } from 'react';
import { useCall, useCalls, useEthers } from '@usedapp/core';
import { Contract, utils } from 'ethers';

import CONTRCT_ABI from '../../abi/abi.json';
import { CONTRACT_ADDRESS } from '../Constants/index';

const ContractInterface = new utils.Interface(CONTRCT_ABI);
const CTSContract = new Contract(
  CONTRACT_ADDRESS,
  ContractInterface
);

export function useGetCurrentPrice()  {
  const [currentPrice, setCurrentPrice] = useState(undefined);
  const [pending, setPending] = useState(false);

  const { value, error } =
    useCall(
      {
        contract: CTSContract,
        method: 'cost',
        args: [],
      }
    ) ?? {};
  useEffect(() => {
    setPending(true);
    if (value) {
      console.log('value',value)
      setCurrentPrice(utils.formatEther(value?.[0]));
      setPending(false);
    }
    if (error) {
      console.error(error.message);
      setPending(false);
      setCurrentPrice(undefined);
    }
    console.log('WHAT AM I GETTING', value, error)
  }, [value, error]);

  return { currentPrice, error, pending };
}

export function useGetTotalSupply()  {
  const [totalSupply, setTotalSupply] = useState(undefined);
  const [pending, setPending] = useState(false);

  const { value, error } =
    useCall(
      {
        contract: CTSContract,
        method: 'totalSupply',
        args: [],
      }
    ) ?? {};
  useEffect(() => {
    setPending(true);
    if (value) {
      setTotalSupply(value?.[0].toNumber());
      setPending(false);
    }
    if (error) {
      console.error(error.message);
      setPending(false);
      setTotalSupply(undefined);
    }
    // console.log('WHAT AM I GETTING', value, error)
  }, [value, error]);

  return { totalSupply, error, pending };
}


export function useGetMaxSupply()  {
  const [maxSupply, setMaxSupply] = useState(undefined);
  const [pending, setPending] = useState(false);

  const { value, error } =
    useCall(
      {
        contract: CTSContract,
        method: 'maxSupply',
        args: [],
      }
    ) ?? {};
  useEffect(() => {
    setPending(true);
    if (value) {
      setMaxSupply(value?.[0].toNumber());
      setPending(false);
    }
    if (error) {
      console.error(error.message);
      setPending(false);
      setMaxSupply(undefined);
    }
    // console.log('WHAT AM I GETTING', value, error)
  }, [value, error]);

  return { maxSupply, error, pending };
}

