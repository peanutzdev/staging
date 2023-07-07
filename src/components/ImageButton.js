import "./ImageButton.css"
import PropTypes from "prop-types";

const ImageButton = ({id, imageName, onClick}) => {
    return (
        <button
            id={id}
            className="ImageButton"
            onClick={onClick}
        >
            <img src={imageName} alt="button"/>
        </button>
    )
}

ImageButton.defaultProps = {
    id: undefined,
    imageName: undefined,
    onClick: (e) => {
        console.log("? Button pressed" + e)
    }
}

ImageButton.propTypes = {
    id: PropTypes.string,
    imageName: PropTypes.string,
    onClick: PropTypes.func
}

export default ImageButton