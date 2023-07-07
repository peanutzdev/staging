import Header from "../components/Header";
import Footer from "../components/Footer";
// import { SwapWidget } from '@uniswap/widgets'
// import '@uniswap/widgets/fonts.css'

function Swap() {
    return (
        <div>
            <div className="contentWrapper">
                <Header/>
                {/*<div className="Uniswap">*/}
                {/*    <SwapWidget />*/}
                {/*</div>*/}
                <h1>Swap</h1>
            </div>
            <Footer/>
        </div>
    );
}

export default Swap;