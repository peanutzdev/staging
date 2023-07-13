import {ethers} from "ethers";
import React from "react";

const { abi: NonfungiblePositionManager } = require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json")
const { abi: UniswapV3Staker } = require("@uniswap/v3-staker/artifacts/contracts/UniswapV3Staker.sol/UniswapV3Staker.json")

export function useLPTokenIds(
    positionManagerAddress: string,
    address: string,
    provider: ethers.providers.Provider,
    lpPair?: LPPair
) {
    const [tokenIds, setTokenIds] = React.useState(Array<bigint>())
    const [loading, setLoading] = React.useState(false)
    const [reload, setReload] = React.useState(true)

    React.useEffect(()=> {
        async function load() {
            try {
                setLoading(true)
                let ids = await fetchLPTokenIds(positionManagerAddress, address, provider)
                if (lpPair) {
                    const infos = await fetchLPTokenInfos(ids, positionManagerAddress, provider)
                    const result = infos
                        .map((val, idx) => isLPFor(val, lpPair) ? ids[idx] : undefined)
                        .filter((val) => val !== undefined) as bigint[]
                    ids = result
                }
                setTokenIds(ids)
                setLoading(false)
            } catch (error) {
                setLoading(false);
                console.log("fetchLPTokenIds error", error)
            }
        }
        if (reload) {
            load()
            setReload(false)
        }
    }, [positionManagerAddress, address, provider, reload, lpPair]);

    return { tokenIds: tokenIds, reload: ()=>{ setReload(true) }, loading: loading };
}

export function useStakedLPTokenIds(
    positionManagerAddress: string,
    stakerAddress: string,
    address: string,
    lpPair: LPPair,
    provider: ethers.providers.Provider
) {
    const [tokenIds, setTokenIds] = React.useState(Array<bigint>())
    const [loading, setLoading] = React.useState(false)
    const [reload, setReload] = React.useState(true)

    React.useEffect(()=> {
        async function load() {
            try {
                setLoading(true)
                const ids = await fetchLPTokenIds(positionManagerAddress, stakerAddress, provider)
                const owners = await fetchStakedLPTokenOwners(ids, stakerAddress, provider)
                const owned = owners
                    .map((val, idx) => val === address ? ids[idx] : undefined)
                    .filter((val) => val !== undefined) as bigint[]
                const infos = await fetchLPTokenInfos(owned, positionManagerAddress, provider)
                const result = infos
                    .map((val, idx) => isLPFor(val, lpPair) ? owned[idx] : undefined)
                    .filter((val) => val !== undefined) as bigint[]

                setTokenIds(owned)
                setLoading(false)
            } catch (error) {
                setLoading(false);
                console.log("useStakedLPTokenIds error", error)
            }
        }
        if (reload) {
            load()
            setReload(false)
        }
    }, [positionManagerAddress, stakerAddress, address, lpPair, provider, reload]);

    return { tokenIds: tokenIds, reload: ()=>{ setReload(true) }, loading: loading };
}

export function useUnclaimedRewards(
    incentiveTuple: any[],
    tokenId: string,
    stakerAddress: string,
    rewardTokenDecimals: number,
    signer: ethers.Signer
) {
    const [balance, setBalance] = React.useState(BigInt(0))
    const [formattedBalance, setFormattedBalance] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [reload, setReload] = React.useState(true)

    React.useEffect(()=> {
        async function load() {
            try {
                setLoading(true)
                const result = await unclaimedRewards(incentiveTuple, tokenId, stakerAddress,signer)
                setBalance(balance)
                setFormattedBalance(ethers.utils.formatUnits(result, rewardTokenDecimals))
                setLoading(false)
            } catch (error) {
                setLoading(false);
                console.log("useStakedLPTokenIds error", error)
            }
        }
        if (reload) {
            load()
            setReload(false)
        }
    }, [incentiveTuple, tokenId, stakerAddress, rewardTokenDecimals, signer, reload]);

    return { balance: balance, formattedBalance: formattedBalance, reload: ()=>{ setReload(true) }, loading: loading };
}

async function unclaimedRewards(
    incentiveTuple: any[],
    tokenId: string,
    stakerAddress: string,
    signer: ethers.Signer
): Promise<bigint> {
    const staker = new ethers.Contract(stakerAddress, UniswapV3Staker, signer)
    const result = await staker.callStatic.getRewardInfo(incentiveTuple, tokenId)
    return result[0]
}

async function fetchLPTokenIds(
    positionManagerAddress: string,
    address: string,
    provider: ethers.providers.Provider
): Promise<bigint[]> {
    const positionManager = new ethers.Contract(
        positionManagerAddress,
        NonfungiblePositionManager,
        provider
    )
    const lpCount = await positionManager.balanceOf(address)
    const fetchRanges = ranges(1000, lpCount)
    let tokenIds: bigint[] = []
    while (fetchRanges.length > 0) {
        const range = fetchRanges.pop()!!
        let calls: string[] = []
        for (let i=range.start; i<range.end; i++) {
            const call = positionManager.interface.encodeFunctionData(
                "tokenOfOwnerByIndex(address,uint256)",
                [address, i]
            )
            calls.push(call)
        }
        // Process results get all token ids
        const results = await positionManager.callStatic.multicall(calls)
        for (let i=0; i<results.length; i++) {
            const result = positionManager.interface.decodeFunctionResult(
                "tokenOfOwnerByIndex(address,uint256)", results[i]
            )
            tokenIds.push(result[0])
        }
    }
    return tokenIds
}

export type LPTokenInfo = {
    nonce: bigint,
    operator: string,
    token0: string,
    token1: string,
    fee: bigint,
    tickLower: bigint,
    tickUpper: bigint,
    liquidity: bigint,
    feeGrowthInside0LastX128: bigint,
    feeGrowthInside1LastX128: bigint,
    tokensOwed0: bigint,
    tokensOwed1: bigint
}

export type LPPair = {
    token0: string,
    token1: string
}

export function isLPFor(tokenInfo: LPTokenInfo, lpPair: LPPair): boolean {
    return (
        (tokenInfo.token0 === lpPair.token0 && tokenInfo.token1 == lpPair.token1) ||
        (tokenInfo.token0 === lpPair.token1 && tokenInfo.token1 == lpPair.token0)
    )
}

async function fetchLPTokenInfos(
    tokenIds: bigint[],
    positionManagerAddress: string,
    provider: ethers.providers.Provider
): Promise<LPTokenInfo[]> {
    const positionManager = new ethers.Contract(
        positionManagerAddress,
        NonfungiblePositionManager,
        provider
    )
    const fetchRanges = ranges(1000, tokenIds.length)
    let tokenInfos: LPTokenInfo[] = []
    while (fetchRanges.length > 0) {
        const range = fetchRanges.pop()!!
        let calls: string[] = []
        for (let i=range.start; i<range.end; i++) {
            const call = positionManager.interface.encodeFunctionData(
                "positions(uint256)",
                [tokenIds[i]]
            )
            calls.push(call)
        }
        // Process results get all tokens infos
        const results = await positionManager.callStatic.multicall(calls)
        for (let i=0; i<results.length; i++) {
            const result = positionManager.interface.decodeFunctionResult(
                "positions(uint256)", results[i]
            )
            tokenInfos.push({
                nonce: result[0],
                operator: result[1],
                token0: result[2],
                token1: result[3],
                fee: result[4],
                tickLower: result[5],
                tickUpper: result[6],
                liquidity: result[7],
                feeGrowthInside0LastX128: result[8],
                feeGrowthInside1LastX128: result[9],
                tokensOwed0: result[10],
                tokensOwed1: result[11]
            })
        }
    }
    return tokenInfos
}

async function fetchStakedLPTokenOwners(
    tokenIds: bigint[],
    stakerAddress: string,
    provider: ethers.providers.Provider
): Promise<string[]> {
    const staker = new ethers.Contract(
        stakerAddress,
        UniswapV3Staker,
        provider
    )
    const fetchRanges = ranges(1000, tokenIds.length)
    let owners: string[] = []
    while (fetchRanges.length > 0) {
        const range = fetchRanges.pop()!!
        let calls: string[] = []
        for (let i=range.start; i<range.end; i++) {
            const call = staker.interface.encodeFunctionData(
                "deposits(uint256)",
                [tokenIds[i]]
            )
            calls.push(call)
        }
        // Process results get all tokens infos
        const results = await staker.callStatic.multicall(calls)
        for (let i=0; i<results.length; i++) {
            const result = staker.interface.decodeFunctionResult(
                "deposits(uint256)",
                results[i]
            )
            owners.push(result[0])
        }
    }
    return owners
}

type Range = {
    start: number,
    end: number
}

function ranges(rangeSize: number, count: number): Range[] {
    let ranges: Range[] = []
    let startIdx = 0
    let endIdx = 0
    while (endIdx < count) {
        startIdx = endIdx
        endIdx = (endIdx + 1000) > count ? count : endIdx + 1000
        ranges.push({start: startIdx, end: endIdx})
    }
    return ranges
}
