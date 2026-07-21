import './Screen.css'
import TrackInfo from '../TrackInfo/TrackInfo'
import ProgressBar from '../ProgressBar/ProgressBar'

function Screen({ isLoggedIn, onLogin }) {
    return (
        <div className="screen-container" >
            <div className="screen-display">
                {isLoggedIn ? (
                    <>
                        <TrackInfo />
                        <ProgressBar />
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