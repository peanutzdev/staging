import "./TokenomicsSection.css"
import TokenomicsPieChart from "../images/tokenomics-pie-chart.svg"
import NutzLeft from "../images/nutz-left.svg"
import NutzRight from "../images/nutz-right.svg"

const TokenomicsSection = () => {
    return (
        <section className="tokenomicsSection section">
            <div className="tokenomicsHeader">
                <img className="flexItem" src={NutzLeft}/>
                <h1 className="flexItem">Tokenomics</h1>
                <img className="flexItem" src={NutzRight}/>
            </div>
            <div className="tokenomicsBody">
                <img src={TokenomicsPieChart}/>
                <div className="tokenomicsDetailsContainer">
                    <div className="tokenomicsDetailItem">
                        <h1>AA%</h1>
                        <p>LIQUIDITY POOL & LP TOKENS ARE BURNT</p>
                    </div>
                    <div className="tokenomicsDetailItem">
                        <h2>AA%</h2>
                        <p>USED FOR AIRDROP, EXCHANGES & MARKETING</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TokenomicsSection