import './Screen.css'
import TrackInfo from '../TrackInfo/TrackInfo'
import ProgressBar from '../ProgressBar/ProgressBar'
import QueueView from '../QueueView/QueueView'

function Screen({ isLoggedIn, onLogin, track, showQueue, queueData, refetchQueue }) {
    return (
        <div className="screen-container" >
            <div className="screen-display">
                {isLoggedIn ? (
                    <>
                        <div className='now-playing-panel'>
                            <TrackInfo track={track} />
                            <ProgressBar track={track} />
                        </div>
                        <div className={`queue-panel ${showQueue ? 'queue-visible' : ''}`}>
                            <QueueView queueData={queueData} refetchQueue={refetchQueue} contextUri={track?.context?.uri ?? null} />
                        </div>
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