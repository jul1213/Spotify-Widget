import './PlayerControls.css'
import rewindIcon from '../../assets/rewind.svg'
import skipIcon from '../../assets/skip.svg'
import playIcon from '../../assets/play.svg'
import queueIcon from '../../assets/queue.svg'

function PlayerControls({ isPlaying }) {
    const handleSkip = () => window.spotifyControls.skip()
    const handlePrev = () => window.spotifyControls.prev()
    const handleQueue = () => console.log("queue clicked")
    const handleSelect = () => console.log("select clicked")

    const handlePlayPause = () => {
        if (isPlaying) {
            window.spotifyControls.pause()
        } else {
            window.spotifyControls.play()
        }
    }

    return (
        <div className="click-wheel">
            <button className="centre-button" onClick={handleSelect} />
            <button className="play-button" onClick={handlePlayPause}>
                <img src={playIcon} />
            </button>
            <button className="skip-button" onClick={handleSkip}>
                <img src={skipIcon} />
            </button>
            <button className="rewind-button" onClick={handlePrev}>
                <img src={rewindIcon} />
            </button>
            <button className="queue-button" onClick={handleQueue}>
                <img src={queueIcon} />
            </button>
        </div>
    )
}

export default PlayerControls