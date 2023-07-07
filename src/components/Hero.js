import './Hero.css'
import PnzHero from '../images//pnzhero.png';
import ImageButton from "./ImageButton";
import StakeImage from "../images//stake.svg"
import Twitter from "../images//twitter.svg"
import Telegram from "../images//telegram.svg"
import Discord from "../images//discord.svg"

const Hero = (props) => {

    const onStakeClicked = (e) => {
        console.log("hero click")
    }

    const onTwitterClicked = () => {
        console.log("twitter click")
    }

    const onTelegramClicked = () => {
        console.log("telegram click")
    }

    const onDiscordClicked = () => {
        console.log("discord click")
    }

    return (
        <div className="hero section">
            <div className="buttonsContainer">
                <div></div>
                <ImageButton id="stakeBtn" imageName={StakeImage} onClick={onStakeClicked}/>
                <ul>
                    <li><ImageButton id="twitterBtn" imageName={Twitter} onClick={onTwitterClicked}/></li>
                    <li><ImageButton id="telegramBtn" imageName={Telegram} onClick={onTelegramClicked}/></li>
                    <li><ImageButton id="discordBtn" imageName={Discord} onClick={onDiscordClicked}/></li>
                </ul>
            </div>
            <img src={PnzHero} alt="Peanutz logo" />

        </div>
    );
}

export default Hero;
