import Header from "../components/Header";
import Footer from "../components/Footer";
import {ConnectWallet, useAddress, useSigner} from "@thirdweb-dev/react";
import {useRewardTokenAddress, useTokenAddress, useConnectedToSupportedNetwork} from "./../hooks/useAddresses";
import TokenBalance from "../components/TokenBalance";
import Stake from "../components/Stake";
import "./StakeToken.css"
import {ToastContainer} from "react-toastify";
import React from "react";

function StakeToken() {
    const signer = useSigner()
    const connectedToSupportedNetwork = useConnectedToSupportedNetwork()

    return (
        <div>
            <div className="contentWrapper">
                <Header/>
                <div className="walletConnect">
                    <ConnectWallet dropdownPosition={{side: "bottom", align: "center"}}/>
                </div>
                <h1>Stake token</h1>

                { !signer ? (
                    <h2>Connect wallet</h2>
                ) : !connectedToSupportedNetwork ? (
                    <h2>Unsupported network</h2>
                ) : (
                    <StakeTokenConnected/>
                )}
                <ToastContainer />
            </div>
            <Footer/>
        </div>
    );
}

function StakeTokenConnected() {
    const walletAddress = useAddress()
    const tokenAddress = useTokenAddress()
    const rewardTokenAddress = useRewardTokenAddress()

    return (
        <div className="stakeTokenContainer">
            <div className="balancesContainer">
                <TokenBalance tokenAddress={tokenAddress} walletAddress={walletAddress} />
                <TokenBalance tokenAddress={rewardTokenAddress} walletAddress={walletAddress} />
            </div>
            <Stake
                tokenAddress={tokenAddress}
                rewardTokenAddress={rewardTokenAddress}
                walletAddress={walletAddress}
            />
        </div>
    )
}

export default StakeToken;