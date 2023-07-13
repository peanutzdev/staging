import {useNetwork} from "@thirdweb-dev/react";
import {ethers} from "ethers";
import {defaultAbiCoder} from "@ethersproject/abi/src.ts/abi-coder";

export function useWETHAddress(): string {
    return (useIsSepolia())
        ? "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"
        : ""
}

export function useTokenAddress(): string {
    return (useIsSepolia())
        ? "0xBd850307ed15848fece6a1A438A187a6FFEF9628"
        : ""
}

export function useRewardTokenAddress(): string {
    return (useIsSepolia())
        ? "0xea4ad5E11f319A82644f8EF5C34b43C6a140B517"
        : ""
}

export function useStakingAddress(): string {
    return (useIsSepolia())
        ? "0x3f876d7462B5D71D4D95cD3c9B3b6a59D7dDC353"
        : ""
}

export function useNFTPositionManagerAddress(): string {
    return (useIsSepolia())
        ? "0x1238536071E1c677A632429e3655c799b22cDA52"
        : ""
}

export function useNFTStakerAddress(): string {
    return (useIsSepolia())
        ? "0x9883A5FB331f99cC280b98277723593B8C9De8cA"
        : ""
}

export function useCurrentNetwork(): number | undefined {
    const network =  useNetwork()
    return network[0].data.chain?.chainId
}

export function useConnectedToSupportedNetwork(): boolean {
    const network = useCurrentNetwork()
    return (network != undefined && (network == 1 || network == 11155111))
}


// Unhashed incentive key will use this as data for staking via the NFT position manager:
export function useUnhashedIncentiveKey() {
    let rewardTokenAddress: string = useTokenAddress()
    let poolAddress: string = usePoolAddress()
    let start: number = (useIsSepolia()) ? 1689140527 : 0
    let end: number = (useIsSepolia()) ? 1702349712 : 0
    let refundeeAddress: string = useDeployerAddress()

    const result = ethers.utils.defaultAbiCoder.encode(
        ["tuple(address,address,uint256,uint256,address)"],
        [useIncentiveTuple()]
    )
    return result
}

export function useIncentiveTuple() {
    let rewardTokenAddress: string = useTokenAddress()
    let poolAddress: string = usePoolAddress()
    let start: number = (useIsSepolia()) ? 1689140527 : 0
    let end: number = (useIsSepolia()) ? 1702349712 : 0
    let refundeeAddress: string = useDeployerAddress()
    return [rewardTokenAddress, poolAddress, start, end, refundeeAddress]
}

export function useIncentiveKey() {
    return ethers.utils.keccak256(useUnhashedIncentiveKey())
}

export function usePoolAddress(): string {
    return (useIsSepolia())
        ? "0xc64499fB35c22840c29211D064574b67F5D03301"
        : ""
}

export function useDeployerAddress(): string {
    return (useIsSepolia())
        ? "0x7978500bBBfF8C720bc951c2Ac37C9385cb42b9B"
        : ""
}

export function useIsSepolia(): boolean {
    const network = useNetwork()
    return (network[0].data.chain?.chainId == 11155111)
}