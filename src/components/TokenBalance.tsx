import "./TokenBalane.css"
import {useAddress, useTokenBalance} from "@thirdweb-dev/react";
import {useTokenAddress} from "../hooks/useAddresses";
import {useTokenInfo} from "../hooks/useERC20";
import './TokenBalane.css'

type TokenBalanceProps = {
    tokenAddress: string,
    walletAddress?: string
}

export default function TokenBalance({tokenAddress, walletAddress}: TokenBalanceProps) {
    const {tokenInfo, loading} = useTokenInfo(tokenAddress, walletAddress)

    return (
        <div className="tokenBalance box">
            <h3 className="flexItem">{tokenInfo.name}</h3>
            { loading ? (
                <div>loading</div>
            ) : (
                <div>{tokenInfo.formattedBalance} {tokenInfo.symbol}</div>
            )}
        </div>
    )
}

