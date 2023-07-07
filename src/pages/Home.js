import Header from "../components/Header";
import Hero from "../components/Hero";
import IntroSection from "../components/IntoSection";
import TokenomicsSection from "../components/TokenomicsSection";
import RoadmapSection from "../components/RoadmapSection";
import Footer from "../components/Footer";

function Home() {
    return (
        <div>
            <div className="contentWrapper">
                <Header/>
                <Hero/>
                <IntroSection/>
                <TokenomicsSection/>
                <RoadmapSection/>
            </div>
            <Footer/>
        </div>
    );
}

export default Home;