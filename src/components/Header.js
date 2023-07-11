import './Header.css';
import PropTypes from "prop-types";
import LogoSmImg from "../images/logoSm.svg";
import ImageButton from "./ImageButton";
import BuyImg from "../images//buy.svg"
import { ConnectWallet } from "@thirdweb-dev/react";


const Header = (props) => {
    const onBuyClick = (e) => {
        console.log("Buy clicked")
    }
    return (
        <header className="app-header section">
            <ImageButton imageName={LogoSmImg} onClick={onBuyClick} />
            <nav>
                <ul>
                    {props.nav.map(link => {
                        return (<li key={link.title}><a href={link.url}>{link.title}</a></li>)
                    })}
                </ul>
            </nav>
            <ImageButton imageName={BuyImg} onClick={onBuyClick} />
        </header>
    );
}

Header.defaultProps = {
    nav: [
        {title: "Peanutz", url: "#" },
        {title: "About", url: "#" },
        {title: "Tokenomatic", url: "#" },
        {title: "Roadmap", url: "#" },
        {title: "Tokens", url: "#" },
    ]
}

Header.propTypes = {
    nav: PropTypes.array
}

export default Header;
