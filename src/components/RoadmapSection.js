import "./RoadmapSection.css"
import RocketLeft from "../images/rocket-left.svg"
import RocketRight from "../images/rocket-right.svg"
import Nutz from "../images/roadmap-nutz.svg"

const RoadmapSection = () => {
    return (
        <section className="roadmapSection section">
            <div className="roadmapHeader">
                <img className="flexItem" src={RocketLeft}/>
                <h1 className="flexItem">Roadmap</h1>
                <img className="flexItem" src={RocketRight}/>
            </div>
            <div className="roadmapBody">
                <div className="roadmapBodyItem">
                    <h3>QA - ABCD</h3>
                    <ul>
                        <li>Inception of the idea</li>
                        <li>Market research</li>
                        <li>Interviewing other founders and key people in the space</li>
                    </ul>
                    <img src={Nutz}/>
                </div>
                <div className="roadmapBodyItem">
                    <h3>QB - ABCD</h3>
                    <ul>
                        <li>Website and brand development</li>
                        <li>Bringing more people to the team</li>
                        <li>Establishing a community</li>
                        <li>Official launch of the peanutz token</li>
                        <li>Listing on Uniswap</li>
                        <li>DAO and governance system in development</li>
                    </ul>
                </div>
                <div className="roadmapBodyItem">
                    <h3>QC - ABCD</h3>
                    <ul>
                        <li>Starting and aggressive marketing campaign</li>
                        <li>Exchange listing</li>
                        <li>Collaboration with other players in the industry </li>
                        <li>Peanutz DAO and governance set in place</li>
                    </ul>
                </div>
                <div className="roadmapBodyItem">
                    <h3>QD - ABCD</h3>
                    <ul>
                        <li>Creating a Peanutz aggregator</li>
                        <li>Adding more DeFi features</li>
                        <li>Adding structure into Peanutz DAO with pools focused on specific niches in the blockchain space</li>
                        <li>Peanutz Labs set in place</li>
                        <li>And a lot more...</li>
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default RoadmapSection