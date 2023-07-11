import {useTokenAddress} from "./useAddresses";
import {useSigner} from "@thirdweb-dev/react";
import React from "react";
const { ethers } = require("ethers");


// The ERC-20 Contract ABI, which is a common contract interface
const ERC20Abi = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function balanceOf(address) view returns (uint)",
    "function transfer(address to, uint amount)",
    "event Transfer(address indexed from, address indexed to, uint amount)"
];

export type TokenInfo = {
    name: string,
    symbol: string,
    decimals: number,
    balance: BigInt,
    formattedBalance: string
}

function TokenInfoZero(): TokenInfo {
    return {
        name: "",
        symbol: "",
        decimals: 0,
        balance: BigInt(0),
        formattedBalance: ""
    }
}

export function useTokenInfo(tokenAddress: string, walletAddress?: string) {
    const [tokenInfo, setTokenInfo] = React.useState(TokenInfoZero())
    const [loading, setLoading] = React.useState(false)
    const [reload, setReload] = React.useState(true)
    const provider = useSigner()?.provider

    React.useEffect(() => {
        async function loadTokenInfo() {
            try {
                if (!walletAddress || !provider) {
                    setLoading(false)
                    setTokenInfo(TokenInfoZero)
                    return TokenInfoZero()
                }
                setLoading(true)
                const contract = new ethers.Contract(tokenAddress, ERC20Abi, provider)
                const decimals = await contract.decimals()
                const balance = await contract.balanceOf(walletAddress)
                const formattedBalance = ethers.utils.formatUnits(balance, decimals)
                const tokenInfo = {
                    name: await contract.name(),
                    symbol: await contract.symbol(),
                    decimals: decimals,
                    balance: balance,
                    formattedBalance: formattedBalance,
                }
                setTokenInfo(tokenInfo)
                setLoading(false)
                return tokenInfo

            } catch (error) {
                console.info("balance fetch error", error)
                setLoading(false);
                return TokenInfoZero
            }
        }
        if (walletAddress !== "" && reload) {
            loadTokenInfo()
            setReload(false)

        }
    }, [walletAddress, tokenAddress, provider, reload]);

    return {
        tokenInfo: tokenInfo,
        reload: ()=>{ setReload(true) },
        loading: loading
    };
}


