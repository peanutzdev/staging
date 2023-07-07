import "./Footer.css"
import LogoSmImg from "../images/logoSm.svg";
import ImageButton from "./ImageButton";
import Twitter from "../images/twitter.svg";
import Telegram from "../images/telegram.svg";
import Discord from "../images/discord.svg";


const Footer = () => {
    const onNutzClicked = (e) => {
        console.log("nutz click")
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
        <footer className="footerSection">
            <div className="section">
                <div className="wrapper">
                    <ImageButton imageName={LogoSmImg} onClick={onNutzClicked} />
                    <ul>
                        <li><ImageButton id="twitterBtn" imageName={Twitter} onClick={onTwitterClicked}/></li>
                        <li><ImageButton id="telegramBtn" imageName={Telegram} onClick={onTelegramClicked}/></li>
                        <li><ImageButton id="discordBtn" imageName={Discord} onClick={onDiscordClicked}/></li>
                    </ul>
                    <div>
                        <p>Contract: 0x0000000000000000000000000000000000</p>
                        <p>Peanutz © 2023 hi@peanutz.com</p>
                    </div>
                </div>
                $peanutz coin has no association with Mr. Peanut the advertising logo and mascot of Planters, an American snack-food company owned by Hormel.
            </div>
        </footer>
    )
}

export default Footer