import React, { useEffect, useState } from 'react'
import { ChainId, useEthers, useContractFunction } from '@usedapp/core';
import { toast } from 'react-toastify'
import { Contract, utils } from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider'

import { useGetCurrentPrice, useGetMaxSupply, useGetTotalSupply } from '../utilities/Web3/contract'

import * as s from "../styles/globalStyles";
import styled from "styled-components";

import CONTRCT_ABI from '../abi/abi.json';
import { CONTRACT_ADDRESS } from '../utilities/Constants/index';

const ContractInterface = new utils.Interface(CONTRCT_ABI);
const CTSContract = new Contract(
    CONTRACT_ADDRESS,
    ContractInterface
);

const truncate = (input, len) =>
    input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: #37160F;
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
  @media (max-width: 767px) {
    display: none;
  }
`;

export const StyledButton2 = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  display: none;
  background-color: #37160F;
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
  @media (max-width: 767px) {
    display: block;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 75px;
  @media (min-width: 767px) {
    width: 100px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed #37160F;
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: #37160F;
  text-decoration: none;
`;

export default function Home() {

    const [disabled, setDisabled] = useState(false)
    const [selectedCount, setSelectedCount] = useState(1)
    const { activateBrowserWallet, account, activate, deactivate, chainId } = useEthers()
    const { currentPrice } = useGetCurrentPrice()
    const { maxSupply } = useGetMaxSupply()
    const { totalSupply } = useGetTotalSupply()
    console.log("currentPrice'", currentPrice)
    console.log("maxSupply'", maxSupply)
    console.log("totalSupply'", totalSupply)

    // transaction instance
    const { state, send } = useContractFunction(CTSContract, 'mint', { transactionName: 'Wrap' })

    useEffect(() => {
        if (state.status === 'PendingSignature') {
            toast.warning("Minting in progress... Please wait.", { autoClose: 6000 });
        }
        if (state.status === 'Success') {
            setDisabled(false)
            setSelectedCount(1)
            toast.success("Congratulations! Mint Successful.", { autoClose: 6000 });
        }
        if (state.status === 'Exception') {
            setDisabled(false)
            setSelectedCount(1)
            toast.error(state.errorMessage, { autoClose: 6000 });
        }
        if (state.status === 'Fail') {
            setDisabled(false)
            setSelectedCount(1)
            toast.error(state.errorMessage, { autoClose: 6000 });
        }

        delete state['status']
    }, [state]);

    const changeMintCount = (count) => {
        console.log('count select', count)
        setSelectedCount(count)
    }

    async function connectToWalletConnect() {
        try {
            localStorage.clear();
            const provider = new WalletConnectProvider({
                qrcode: true,
                bridge: 'https://bridge.walletconnect.org',
                rpc: {
                    [ChainId.Cronos]: process.env.REACT_APP_CRONOS_RPC,
                },
                chainId: ChainId.Cronos
            })
            await provider.enable()
            if (!(provider.chainId === 25)) {
                await switchNetwork(ChainId.Cronos)
            }
            await activate(provider)

            // // Subscribe to events that reload the app
            // provider.on("accountsChanged", reloadApp);
            // provider.on("chainChanged", reloadApp);
            // provider.on("disconnect", reloadApp);


        } catch (error) {
            console.error(error)
            toast.error(error.message, {
                position: 'bottom-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }
    }

    async function mintNFT() {
        if (disabled) return;
        if (!account) {
            toast.error("Connect your wallet first", { autoClose: 6000 });
            return;
        }

        if (chainId !== 25) {
            toast.error("Connect to Cronos Chain", { autoClose: 6000 });
            return;
        }
        try {

            let amount = 1; // 1 NFT per transaction can user mint

            let totalCost = currentPrice * amount;
            totalCost = floatToStr(totalCost);
            totalCost = totalCost.substring(0, 3)
            console.log(`totalCost ${utils.parseEther(totalCost)} || amount ${amount}`)
            send(amount, { value: utils.parseEther(totalCost) })

        } catch (error) {
            toast.error(error?.message)
            console.log('error', error?.message)
            setDisabled(false)
            setSelectedCount(1)
        }
    }
    function floatToStr(num) {
        return num.toString().indexOf('.') === -1 ? num.toFixed(1) : num.toString();
    }

    //   onClick={() => mintNFT()} disabled={disabled}













    // const dispatch = useDispatch();
    // const blockchain = useSelector((state) => state.blockchain);
    // const data = useSelector((state) => state.data);
    const [claimingNft, setClaimingNft] = useState(false);
    const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
    // const [mintAmount, setMintAmount] = useState(1);
    const [CONFIG, SET_CONFIG] = useState({
        CONTRACT_ADDRESS: "",
        SCAN_LINK: "",
        NETWORK: {
            NAME: "",
            SYMBOL: "",
            ID: 0,
        },
        NFT_NAME: "",
        SYMBOL: "",
        MAX_SUPPLY: 1,
        WEI_COST: 0,
        DISPLAY_COST: 0,
        GAS_LIMIT: 0,
        MARKETPLACE: "",
        MARKETPLACE_LINK: "",
        SHOW_BACKGROUND: false,
    });

    const claimNFTs = () => {
        //     let cost = CONFIG.WEI_COST;
        //     let gasLimit = CONFIG.GAS_LIMIT;
        //     let totalCostWei = String(cost * mintAmount);
        //     let totalGasLimit = String(gasLimit * mintAmount);
        //     console.log("Cost: ", totalCostWei);
        //     console.log("Gas limit: ", totalGasLimit);
        //     setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
        //     setClaimingNft(true);
        //     blockchain.smartContract.methods
        //         .mint(mintAmount)
        //         .send({
        //             gasLimit: String(totalGasLimit),
        //             to: CONFIG.CONTRACT_ADDRESS,
        //             from: blockchain.account,
        //             value: totalCostWei,
        //         })
        //         .once("error", (err) => {
        //             console.log(err);
        //             setFeedback("Sorry, something went wrong please try again later.");
        //             setClaimingNft(false);
        //         })
        //         .then((receipt) => {
        //             console.log(receipt);
        //             setFeedback(
        //                 `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        //             );
        //             setClaimingNft(false);
        //             dispatch(fetchData(blockchain.account));
        //         });
    }

    // const decrementMintAmount = () => {
    //     let newMintAmount = mintAmount - 1;
    //     if (newMintAmount < 1) {
    //         newMintAmount = 1;
    //     }
    //     setMintAmount(newMintAmount);
    // };

    // const incrementMintAmount = () => {
    //     let newMintAmount = mintAmount + 1;
    //     if (newMintAmount > 10) {
    //         newMintAmount = 10;
    //     }
    //     setMintAmount(newMintAmount);
    // };

    // const getData = () => {
    //     if (blockchain.account !== "" && blockchain.smartContract !== null) {
    //         dispatch(fetchData(blockchain.account));
    //     }
    // };

    const getConfig = async () => {
        const configResponse = await fetch("/config/config.json", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        const config = await configResponse.json();
        SET_CONFIG(config);
    };

    useEffect(() => {
        getConfig();
    }, []);

    return (
        <s.Screen>
            <s.Container
                flex={1}
                ai={"center"}
                style={{ padding: 24, backgroundColor: "var(--primary)" }}
                image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <StyledLogo alt={"logo"} src={"/config/images/logo.png"} />
                    <StyledLink style={{fontSize: '24px', fontWeight: 'bold'}} target={"_blank"} href="https://ezswap.vercel.app/">
                                    EZSWAP
                                </StyledLink>
                    <StyledLogo alt={"logo"} src={"/config/images/Logo_Tycoon-3.png"} />
                </div>
                <s.SpacerSmall />
                <s.TextTitle
                    style={{
                        textAlign: "center",
                        fontSize: 40,
                        fontWeight: "bold",
                        color: "var(--accent-text)",
                    }}
                >
                    Welcome to Crazy Tangs Survivor
                </s.TextTitle>
                <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
                    <s.Container flex={1} jc={"center"} ai={"center"}>
                        <StyledImg alt={"example"} src={"/config/images/preview.gif"} />
                    </s.Container>
                    <s.SpacerLarge />
                    <s.Container
                        flex={2}
                        jc={"center"}
                        ai={"center"}
                        style={{
                            backgroundColor: "var(--accent)",
                            padding: 24,
                            borderRadius: 24,
                            border: "4px dashed #37160F",
                            boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
                        }}
                    >
                        <s.TextTitle
                            style={{
                                textAlign: "center",
                                fontSize: 50,
                                fontWeight: "bold",
                                color: "var(--accent-text)",
                            }}
                        >
                            {totalSupply} / {maxSupply}
                        </s.TextTitle>
                        {
                            account && (
                                <>
                                    <s.TextDescription
                                        style={{
                                            textAlign: "center",
                                            color: "var(--primary-text)",
                                        }}
                                    >
                                        {truncate(account, 15)}
                                    </s.TextDescription>
                                    <s.SpacerSmall />
                                </>
                            )
                        }
                        {Number(totalSupply) >= maxSupply ? (
                            <>
                                <s.TextTitle
                                    style={{ textAlign: "center", color: "var(--accent-text)" }}
                                >
                                    The sale has ended.
                                </s.TextTitle>
                                <s.TextDescription
                                    style={{ textAlign: "center", color: "var(--accent-text)" }}
                                >
                                    You can still find {CONFIG.NFT_NAME} on
                                </s.TextDescription>
                                <s.SpacerSmall />
                                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                                    {CONFIG.MARKETPLACE}
                                </StyledLink>
                            </>
                        ) : (
                            <>
                                <s.TextTitle
                                    style={{ textAlign: "center", color: "var(--accent-text)" }}
                                >
                                    1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                                    {CONFIG.NETWORK.SYMBOL}.
                                </s.TextTitle>
                                <s.SpacerXSmall />
                                {account ? (
                                    <s.Container ai={"center"} jc={"center"}>
                                        {chainId != 25 && (
                                            <>
                                                <s.TextDescription
                                                    style={{
                                                        textAlign: "center",
                                                        color: "var(--accent-text)",
                                                    }}
                                                >
                                                    Connect to the {CONFIG.NETWORK.NAME} network
                                                </s.TextDescription>
                                                <s.SpacerSmall />
                                            </>
                                        )}
                                        <s.TextDescription
                                            style={{
                                                textAlign: "center",
                                                color: "var(--accent-text)",
                                            }}
                                        >
                                            {feedback}
                                        </s.TextDescription>
                                        <s.SpacerMedium />
                                        <div style={{ display: 'flex', }}>
                                            <StyledButton
                                                disabled={claimingNft ? 1 : 0}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    mintNFT();
                                                }}
                                            >
                                                {claimingNft ? "BUSY" : "BUY"}
                                            </StyledButton>
                                            <StyledButton
                                                style={{ marginLeft: '10px' }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    deactivate();
                                                }}
                                            >
                                                Disconnect
                                            </StyledButton>

                                        </div>

                                    </s.Container>
                                ) : (
                                    <>
                                        {/* <s.Container ai={"center"} jc={"center"} fd={"row"}>
                                            <StyledRoundButton
                                                style={{ lineHeight: 0.4 }}
                                                disabled={claimingNft ? 1 : 0}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    decrementMintAmount();
                                                }}
                                            >
                                                -
                                            </StyledRoundButton>
                                            <s.SpacerMedium />
                                            <s.TextDescription
                                                style={{
                                                    textAlign: "center",
                                                    color: "var(--accent-text)",
                                                }}
                                            >
                                                {mintAmount}
                                            </s.TextDescription>
                                            <s.SpacerMedium />
                                            <StyledRoundButton
                                                disabled={claimingNft ? 1 : 0}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    incrementMintAmount();
                                                }}
                                            >
                                                +
                                            </StyledRoundButton>
                                        </s.Container> */}
                                        <s.SpacerSmall />
                                        <s.Container ai={"center"} jc={"center"} fd={"row"}>
                                            <StyledButton
                                                disabled={claimingNft ? 1 : 0}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    activateBrowserWallet();
                                                }}
                                            >
                                                Connect
                                            </StyledButton>
                                            <StyledButton2
                                                disabled={claimingNft ? 1 : 0}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    connectToWalletConnect();
                                                }}
                                            >
                                                Connect
                                            </StyledButton2>
                                        </s.Container>
                                    </>
                                )}
                            </>
                        )}
                        <s.SpacerMedium />
                    </s.Container>
                    <s.SpacerLarge />
                    <s.Container flex={1} jc={"center"} ai={"center"}>
                        <StyledImg
                            alt={"example"}
                            src={"/config/images/preview.gif"}
                            style={{ transform: "scaleX(-1)" }}
                        />
                    </s.Container>
                </ResponsiveWrapper>
                <s.SpacerMedium />
                <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
                    <s.TextDescription
                        style={{
                            textAlign: "center",
                            color: "var(--primary-text)",
                        }}
                    >
                        Please make sure you are connected to the right network (
                        {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Please note:
                        Once you make the purchase, you cannot undo this action.
                    </s.TextDescription>
                </s.Container>
            </s.Container>
        </s.Screen>
    )
}
