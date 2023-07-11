import {useNetwork} from "@thirdweb-dev/react";

export function useTokenAddress(): string {
    const network =  useNetwork()
    if (network[0].data.chain?.chainId == 11155111) {
        return "0xb99A2FdeA0ec54a74F600b22F8A5A815899C7089"
    }
    return ""
}

export function useRewardTokenAddress(): string {
    const network =  useNetwork()
    if (network[0].data.chain?.chainId == 11155111) {
        return "0x6713edB937e510D6Fbe022bf836205cE44C6D079"
    }
    return ""
}

export function useStakingAddress(): string {
    const network =  useNetwork()
    if (network[0].data.chain?.chainId == 11155111) {
        return "0xC84E686c7fF71475f055D44De6C324Da3Dd39818"
        //"0x38a16Dc497767118f36ec0Fc34b9167368aA8284"
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
