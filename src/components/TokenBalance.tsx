import "./TokenBalane.css"
import {useAddress, useTokenBalance} from "@thirdweb-dev/react";
import {useTokenAddress} from "../hooks/useAddresses";
import {useTokenInfo} from "../hooks/useERC20";
import './TokenBalane.css'
import {useEffect} from "react";
import {REFRESH_INTERVAL} from "../constants";

type TokenBalanceProps = {
    tokenAddress: string,
    walletAddress?: string
}

export default function TokenBalance({tokenAddress, walletAddress}: TokenBalanceProps) {
    const {tokenInfo, reload, loading} = useTokenInfo(tokenAddress, walletAddress)

    useEffect(() => { setInterval(() => { reload() }, REFRESH_INTERVAL)}, [])


    return (
        <div className="tokenBalance box">
            <h3 className="flexItem">{tokenInfo.name}</h3>
            { loading && tokenInfo.formattedBalance == "" ? (
                <div>loading</div>
            ) : (
                <div>{tokenInfo.formattedBalance} {tokenInfo.symbol}</div>
            )}
        </div>
    )
}

