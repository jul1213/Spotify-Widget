import './Screen.css'
import TrackInfo from '../TrackInfo/TrackInfo'
import ProgressBar from '../ProgressBar/ProgressBar'

function Screen() {
    return (
        <div className="screen-container" >
            <div className="screen-display">
                <TrackInfo />
                <ProgressBar />
            </div>
        </div>
    )
}

export default Screen