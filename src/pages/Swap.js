import Header from "../components/Header"
import Footer from "../components/Footer"
import {ConnectWallet} from "@thirdweb-dev/react"
import { SwapWidget } from '@uniswap/widgets'
import '@uniswap/widgets/fonts.css'
import { useSigner } from "@thirdweb-dev/react"

function Swap() {
    const signer = useSigner()
    const provider = signer?.provider
    return (
        <div>
            <div className="contentWrapper">
                <Header/>
                <h1>Swap</h1>
                <ConnectWallet dropdownPosition={{side: "bottom", align: "center"}}/>
                <div className="Uniswap">
                    <SwapWidget provider={provider} />
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Swap;