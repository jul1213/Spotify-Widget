import './Screen.css'
import TrackInfo from '../TrackInfo/TrackInfo'
import ProgressBar from '../ProgressBar/ProgressBar'

function Screen({ isLoggedIn, onLogin, track }) {
    return (
        <div className="screen-container" >
            <div className="screen-display">
                {isLoggedIn ? (
                    <>
                        <TrackInfo track={track} />
                        <ProgressBar track={track} />
                    </>
                ) : (
                    <button className='login-button' onClick={onLogin}>
                        Log in with Spotify
                    </button>
                )}
            </div>
        </div>
    )
}

export default Screen