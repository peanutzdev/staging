import "./Stake.css"
import {useSigner, Web3Button} from "@thirdweb-dev/react"
import {useRewardTokenAddress, useStakingAddress, useTokenAddress} from "../hooks/useAddresses"
import {TokenInfo, useTokenInfo} from "../hooks/useERC20"
import React, {useEffect, useState} from "react"
import {BigNumberish, ethers} from "ethers"
import TokenStake from "../abis/TokenStake.json"
import ERC20 from "../abis/ERC20.json"
import {useReadContract} from "../hooks/useReadContract";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {REFRESH_INTERVAL} from "../constants";

type StakeProps = {
    tokenAddress: string,
    rewardTokenAddress: string,
    walletAddress?: string
}

export default function Stake({tokenAddress, rewardTokenAddress, walletAddress}: StakeProps) {
    const {tokenInfo, reload: reloadToken, loading: tokenLoading } = useTokenInfo(tokenAddress, walletAddress)
    const {tokenInfo: rewardTokenInfo, reload: reloadReward, loading: rewardLoading} = useTokenInfo(rewardTokenAddress, walletAddress)
    const signer = useSigner()
    const provider = signer?.provider
    const tokenStakeAddress = useStakingAddress()
    const contract = new ethers.Contract(tokenStakeAddress, TokenStake, provider)
    const {
        data: stakeInfo,
        reload: reloadStake,
        loading: loadingStake
    } = useReadContract(contract, "getStakeInfo", [walletAddress])

    const [stakeAmount, setStakeAmount] = useState<string>("0")
    const [unstakeAmount, setUnstakeAmount] = useState<string>("0")
    const [claimAmount, setClaimAmount] = useState<string>("0")

    function format(balance: BigNumberish, tokenInfo: TokenInfo): string {
        return ethers.utils.formatUnits(balance, tokenInfo.decimals) + " " + tokenInfo.symbol
    }

    function stakedBalance() {
        return (stakeInfo && stakeInfo[0])
            ? ethers.utils.formatUnits(stakeInfo[0], tokenInfo.decimals)
            : ""
    }

    function unclaimedBalance() {
        return (stakeInfo && stakeInfo[1])
            ? ethers.utils.formatUnits(stakeInfo[1], rewardTokenInfo.decimals)
            : ""
    }

    function stake(amount: string) {
        const erc20 = new ethers.Contract(tokenAddress, ERC20, signer)
        const weiAmount = ethers.utils.parseUnits(amount, tokenInfo.decimals)
        erc20.increaseAllowance(tokenStakeAddress, weiAmount)
            .then((result: boolean): void => {
                toast("Approved " + stakeAmount)
                const stake = new ethers.Contract(tokenStakeAddress, TokenStake, signer)
                stake.stake(weiAmount, {gasLimit: 300000}).then(()=> {
                    toast("🎉 Staked " + stakeAmount)
                    resetValue()
                }, (error: Error) => {
                    toast("🛑 😭 Something went wrong " + error)
                })
            }, (error: Error) => {
                toast("🛑 😭 Something went wrong " + error)
            });

    }

    function unstake(amount: string) {
        const weiAmount = ethers.utils.parseUnits(amount, tokenInfo.decimals)
        const stake = new ethers.Contract(tokenStakeAddress, TokenStake, signer)
        stake.withdraw(weiAmount, {gasLimit: 300000}).then(()=> {
            toast("🎉 Unstaked " + stakeAmount)
            resetValue()
        }, (error: Error) => {
            toast("🛑 😭 Something went wrong " + error)
        })
    }

    function claim(amount: string) {
        const stake = new ethers.Contract(tokenStakeAddress, TokenStake, signer)
        stake.claimRewards({gasLimit: 300000}).then(()=> {
            toast("🎉 Claimed " + amount)
            resetValue()
        }, (error: Error) => {
            toast("🛑 😭 Something went wrong " + error)
        })
    }

    function resetValue() {
        setStakeAmount("0")
        setUnstakeAmount("0")
        setClaimAmount("0")
    }

    useEffect(() => {
        setInterval(() => { reloadStake() }, REFRESH_INTERVAL)
    }, [])


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
                            <button onClick={ ()=> { setStakeAmount(tokenInfo.formattedBalance)} }>Max</button>
                        </div>
                        <button onClick={ ()=> stake(stakeAmount) }>Stake</button>
                    </div>

                    <div className="stakeControlsItem">
                        <div className="inputContainer">
                            <input
                                type="number"
                                max={tokenInfo.formattedBalance}
                                value={unstakeAmount}
                                onChange={(e) => setUnstakeAmount(e.target.value)}
                            />
                            <button onClick={ ()=> { setUnstakeAmount(stakedBalance())} }>Max</button>
                        </div>
                        <button onClick={ ()=> unstake(unstakeAmount) }>Unstake</button>
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
                                value={claimAmount}
                                onChange={(e) => setClaimAmount(e.target.value)}
                            />
                            <button onClick={()=> { setClaimAmount(unclaimedBalance())}}>Max</button>
                        </div>
                        <button onClick={ ()=> { claim(claimAmount)} }>Claim</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

