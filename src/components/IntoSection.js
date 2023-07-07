import "./IntroSection.css"
import PropTypes from "prop-types";
import MrPeanut from "../images/mrpeanut.png"
import MrPeanut2 from "../images/mrpeanut@2x.png"

const IntroSection = () => {
    return (
        <section className="introSection section">
            <div className="introSectionItem">
                <h1>Introducing Mr. Peanutz</h1>
                <img
                    id="introPeanutzImgSmall"
                    src={MrPeanut}
                    srcSet={`${MrPeanut2} 2x`}
                />
                <p>An audacious little legume with a big dream to crack the divide between meme coins and serious DeFi projects. He's seen the rest, now he's here to show how it's done. And you're invited to join his crew!</p>
                <p>Our project, Peanutz, rejects the idea of getting lost in the whirlwind of Dog Doge Moon Safe Shiba Rocket coins. Instead, we're planting the seeds for a new era in cryptocurrency, sprinkling the fun of meme coins with the hardcore crunch of DeFi.</p>
                <p>Launched with a sense of humor and a no-nonsense strategy, there's no presale, zero taxes, LP is burnt and contract renounced - Peanutz is a coin that's here to stick around, not just for a season but forever. Powered by the smooth, irresistible charm of Mr. Peanutz, we're churning up a storm in the crypto community. Join us, and let's spread the peanutty goodness all over the crypto universe with Peanutz! No more monkeying around, it's time to go nuts!</p>
            </div>
            <img
                className="introSectionItem"
                id="introPeanutzImg"
                src={MrPeanut}
                srcSet={`${MrPeanut2} 2x`}
            />
        </section>
    )
}

export default IntroSection