import "./Stake.css"
import {useSigner, Web3Button} from "@thirdweb-dev/react"
import {useRewardTokenAddress, useStakingAddress, useTokenAddress} from "../hooks/useAddresses"
import {TokenInfo, useTokenInfo} from "../hooks/useERC20"
import React, {useEffect, useState} from "react"
import {BigNumberish, ethers} from "ethers"
import TokenStake from "../abis/TokenStake.json"
import {useReadContract} from "../hooks/useReadContract";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type StakeProps = {
    tokenAddress: string,
    rewardTokenAddress: string,
    walletAddress?: string
}

export default function Stake({tokenAddress, rewardTokenAddress, walletAddress}: StakeProps) {
    const {tokenInfo, loading} = useTokenInfo(tokenAddress, walletAddress)
    const {tokenInfo: rewardTokenInfo, loading: rewardLoading} = useTokenInfo(rewardTokenAddress, walletAddress)
    const provider = useSigner()?.provider
    const contract = new ethers.Contract(useStakingAddress(), TokenStake, provider)
    const {
        data: stakeInfo,
        reload: reloadStake,
        loading: loadingStake} = useReadContract(
            contract,
        "getStakeInfo",
        [walletAddress]
    )

    const [stakeAmount, setStakeAmount] = useState<string>("0")
    const [unstakeAmount, setUnstakeAmount] = useState<string>("0")

    const notify = () => toast("Wow so easy!");

    useEffect(() => {
        setInterval(() => { reloadStake() }, 30000)
    }, [])

    function format(balance: BigNumberish, tokenInfo: TokenInfo): string {
        return ethers.utils.formatUnits(balance, tokenInfo.decimals) + " " + tokenInfo.symbol
    }

    function stake() {
        toast("Staking" + stakeAmount)
    }

    return (
        <div className="stakeControlsContainer">
            <div className="stakeControls box">
                Staked:
                { stakeInfo && stakeInfo[0] ? (format(stakeInfo[0], tokenInfo)) : ("")}
                <div className="stakeControlsItemsContainer">
                    <div className="stakeControlsItem">
                        <div className="inputContainer">
                            <input
                                type="number"
                                max={tokenInfo.formattedBalance}
                                value={stakeAmount}
                                onChange={(e) => setStakeAmount(e.target.value)}
                            />
                            <button onClick={stake}>Max</button>
                        </div>
                        <button onClick={stake}>Stake</button>
                    </div>
                    <div className="stakeControlsItem">
                        <div className="inputContainer">
                            <input
                                type="number"
                                max={tokenInfo.formattedBalance}
                                value={stakeAmount}
                                onChange={(e) => setStakeAmount(e.target.value)}
                            />
                            <button onClick={stake}>Max</button>
                        </div>
                        <button onClick={stake}>Unstake</button>
                    </div>
                </div>
            </div>
            <div className="claimRewards stakeControls box">
                Earned rewards:
                { stakeInfo && stakeInfo[1] ? (format(stakeInfo[1], rewardTokenInfo)) : ("")}
                <div className="stakeControlsItemsContainer">
                    <div className="stakeControlsItem">
                        <div className="inputContainer">
                            <input
                                type="number"
                                max={tokenInfo.formattedBalance}
                                value={stakeAmount}
                                onChange={(e) => setStakeAmount(e.target.value)}
                            />
                            <button onClick={stake}>Max</button>
                        </div>
                        <button onClick={stake}>Stake</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

