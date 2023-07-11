import {useNetwork} from "@thirdweb-dev/react";

export function useTokenAddress(): string {
    const network =  useNetwork()
    if (network[0].data.chain?.chainId == 11155111) {
        return "0xBd850307ed15848fece6a1A438A187a6FFEF9628"
    }
    return ""
}

export function useRewardTokenAddress(): string {
    const network =  useNetwork()
    if (network[0].data.chain?.chainId == 11155111) {
        return "0xea4ad5E11f319A82644f8EF5C34b43C6a140B517"
    }
    return ""
}

export function useStakingAddress(): string {
    const network =  useNetwork()
    if (network[0].data.chain?.chainId == 11155111) {
        return "0x3f876d7462B5D71D4D95cD3c9B3b6a59D7dDC353"
    }
    return ""
}

export function useCurrentNetwork(): number | undefined {
    const network =  useNetwork()
    return network[0].data.chain?.chainId
}

export function useConnectedToSupportedNetwork(): boolean {
    const network = useCurrentNetwork()
    return (network != undefined && (network == 1 || network == 11155111))
}
