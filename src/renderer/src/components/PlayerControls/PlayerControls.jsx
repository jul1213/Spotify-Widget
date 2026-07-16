import './PlayerControls.css'
import rewindIcon from '../../assets/rewind.svg'
import skipIcon from '../../assets/skip.svg'
import playIcon from '../../assets/play.svg'
import queueIcon from '../../assets/queue.svg'

function PlayerControls() {
    return (
        <div className="click-wheel">
            <button className="centre-button" />
            <button className="rewind-button">
                <img src={rewindIcon} />
            </button>
            <button className="play-button">
                <img src={playIcon} />
            </button>
            <button className="skip-button">
                <img src={skipIcon} />
            </button>
            <button className="queue-button">
                <img src={queueIcon} />
            </button>
        </div>
    )
}

export default PlayerControls