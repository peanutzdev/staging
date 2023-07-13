import "./StakeLP.css"
import {ethers} from "ethers";
import React, {useEffect, useState} from "react";
import {REFRESH_INTERVAL} from "../constants";
import Header from "../components/Header";
import {ConnectWallet, useAddress, useSigner} from "@thirdweb-dev/react";
import {toast, ToastContainer} from "react-toastify";
import Footer from "../components/Footer";
import {
    useConnectedToSupportedNetwork,
    useIncentiveKey,
    useIncentiveTuple,
    useNFTPositionManagerAddress,
    useNFTStakerAddress,
    useTokenAddress,
    useUnhashedIncentiveKey,
    useWETHAddress
} from "../hooks/useAddresses";
import {useLPTokenIds, useStakedLPTokenIds, useUnclaimedRewards} from "../hooks/useStakeLP";
import ERC721 from "../abis/ERC721.json"
import {useTokenInfo} from "../hooks/useERC20";
const { abi: NonfungiblePositionManager } = require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json")
const { abi: UniswapV3Staker } = require("@uniswap/v3-staker/artifacts/contracts/UniswapV3Staker.sol/UniswapV3Staker.json")




export default function StakeLP() {
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
                    <StakeLPConnected/>
                )}
                <ToastContainer />
            </div>
            <Footer/>
        </div>
    );
}

function StakeLPConnected() {
    const signer = useSigner()!
    const provider = signer.provider!
    const signerAddress = useAddress()
    const erc20TokenAddress = useTokenAddress()
    const lpPair = {token0: useWETHAddress(), token1: useTokenAddress()}
    const {tokenIds, reload, loading}
        = useLPTokenIds(useNFTPositionManagerAddress() , useAddress()!, provider, lpPair)
    const {tokenIds: stakedTokenIds, reload: stakedReload, loading:stakedLoading}
        = useStakedLPTokenIds(useNFTPositionManagerAddress(), useNFTStakerAddress(), useAddress()!, lpPair, provider)
    const tokenIdStrings = tokenIds.map((val) => val.toString())
    const stakedTokenIdStrings = stakedTokenIds.map((val) => val.toString())

    const formattedTokenIds= formatTokenIds(tokenIds)
    const formattedStakedTokenIds= formatTokenIds(stakedTokenIds)
    const unhashedIncentiveKey = useUnhashedIncentiveKey()
    const incencentiveTuple = useIncentiveTuple()
    const incentiveKey = useIncentiveKey()
    const positionManagerAddress = useNFTPositionManagerAddress()
    const stakerAddress = useNFTStakerAddress()

    const [tokenId, setTokenId] = useState<string>("")
    const [unstakeTokenId, setUnstakeTokenId] = useState<string>("")
    const [claimTokenId, setClaimTokenId] = useState<string>("")

    const {tokenInfo, reload: reloadToken, loading: tokenLoading } = useTokenInfo(useTokenAddress(), signerAddress)
    const {balance, formattedBalance, reload: reloadUnclaimed, loading: loadingUnclaimed}
        = useUnclaimedRewards(useIncentiveTuple(), claimTokenId, stakerAddress, tokenInfo.decimals, signer)

    useEffect(() => { setInterval(() => { reload(); stakedReload(); reloadUnclaimed() }, REFRESH_INTERVAL)}, [])

    function stake(tokenId: string) {
        const id = (tokenId !== "") ? tokenId : tokenIdStrings[0]
        const erc721Abi = [
            "function approve(address to, uint256 tokenId)",
            "function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data)"
        ]
        const erc721 = new ethers.Contract(positionManagerAddress, erc721Abi, signer)
        erc721.approve(stakerAddress, id).then(() => {
            toast("🎉 Approved " + id)
            erc721.safeTransferFrom(signerAddress, stakerAddress, id, unhashedIncentiveKey).then(()=> {
                toast("🎉 Staked " + id)
                reload()
                stakedReload()
            }, (error: Error) => {
                console.error(error)
                toast("🛑 😭 Something went wrong " + error)
            })
        }, (error: Error) => {
            console.error(error)
            toast("🛑 😭 Something went wrong " + error)
        })
    }

    async function unstake(tokenId: string) {
        const id = (tokenId !== "") ? tokenId : stakedTokenIdStrings[0]
        const staker = new ethers.Contract(stakerAddress, UniswapV3Staker, signer)
        const unstakeCall = staker.interface.encodeFunctionData(
            "unstakeToken((address,address,uint256,uint256,address),uint256)",
            [incencentiveTuple, tokenId]
        )
        const withdrawCall = staker.interface.encodeFunctionData(
            "withdrawToken(uint256,address,bytes)",
            [tokenId, signerAddress, []]
        )
        staker.multicall([unstakeCall, withdrawCall]).then(
            () => { toast("🎉 Unstaked " + tokenId)},
            (err: Error) => { toast("🛑 😭 Something went wrong " + err)}
        )
    }

    async function claimReward(tokenId: string) {
        console.log("[CLAIM REWARDS]", tokenId)
        const staker = new ethers.Contract(stakerAddress, UniswapV3Staker, signer)
        // const weiAmount = ethers.utils.parseUnits(amount, 18)
        staker.claimReward(erc20TokenAddress, signerAddress, "0").then(
            () => { toast("🎉 Claimed rewards")},
            (err: Error) => { toast("🛑 😭 Something went wrong " + err)}
        )
    }

    return (
        <div className="stakeLPConnected">
            <div className="stakeLPBalancesContainer">
                <div className="stakeLPBalancesItem box">
                    <h3>Unstaked LP tokens</h3>
                    {formattedTokenIds}
                </div>
                <div className="stakeLPBalancesItem box">
                    <h3>Staked LP tokens</h3>
                    {formattedStakedTokenIds}
                </div>
            </div>
            <div className="stakeLPControlsContainer">
                <div className="stakeLPControlsItem box">
                    <div className="stakeLPControlsSubItem">
                        <h3>Stake LP</h3>
                        <select
                            value={tokenId}
                            onChange={(e) => setTokenId(e.target.value)}
                        >
                            {tokenIdStrings.map((val, idx) => {
                                return (<option key={idx} value={val}>{val}</option>)
                            })}
                        </select>
                        <button onClick={ ()=> stake(tokenId) }>Stake</button>
                    </div>
                    <div className="stakeLPControlsSubItem">
                        <h3>Unstake LP</h3>
                        <select
                            value={unstakeTokenId}
                            onChange={(e) => setUnstakeTokenId(e.target.value)}
                        >
                            {stakedTokenIdStrings.map((val, idx) => {
                                return (<option key={idx} value={val}>{val}</option>)
                            })}
                        </select>
                        <button onClick={ ()=> unstake(unstakeTokenId) }>Unstake</button>
                    </div>
                </div>
                <div className="stakeLPControlsItem box">
                    <div className="stakeLPControlsSubItem">
                        <h3>Claim rewards</h3>
                        {(claimTokenId !== "") ? "Unclaimed rewards: " + formattedBalance + " " + tokenInfo.symbol : "" }
                        <select
                            value={claimTokenId}
                            onChange={(e) => setClaimTokenId(e.target.value)}
                        >
                            {stakedTokenIdStrings.map((val, idx) => {
                                return (<option key={idx} value={val}>{val}</option>)
                            })}
                        </select>
                        <button onClick={ ()=> claimReward(claimTokenId) }>Claim all</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function formatTokenIds(tokenIds: bigint[]): string {
    if (tokenIds.length == 0) return ""
    return tokenIds
        .map(v => v.toString())
        .reduce((acc: string, v: string): string => acc + ", " + v)
}