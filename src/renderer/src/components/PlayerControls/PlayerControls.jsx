import './PlayerControls.css'
import rewindIcon from '../../assets/rewind.svg'
import skipIcon from '../../assets/skip.svg'
import playIcon from '../../assets/play.svg'
import queueIcon from '../../assets/queue.svg'

function PlayerControls() {
    const handleRewind = () => console.log("rewind clicked")
    const handleSkip = () => console.log("skip clicked")
    const handlePlay = () => console.log("play clicked")
    const handleQueue = () => console.log("queue clicked")
    const handleSelect = () => console.log("select clicked")

    return (
        <div className="click-wheel">
            <button className="centre-button" onClick={handleSelect} />
            <button className="rewind-button" onClick={handleRewind}>
                <img src={rewindIcon} />
            </button>
            <button className="play-button" onClick={handlePlay}>
                <img src={playIcon} />
            </button>
            <button className="skip-button" onClick={handleSkip}>
                <img src={skipIcon} />
            </button>
            <button className="queue-button" onClick={handleQueue}>
                <img src={queueIcon} />
            </button>
        </div>
    )
}

export default PlayerControls