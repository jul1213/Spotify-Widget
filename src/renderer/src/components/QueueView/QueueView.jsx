import { useState } from 'react'
import './QueueView.css'

function QueueView({ queueData, refetchQueue, contextUri }) {
    const currentTrack = queueData?.currently_playing ?? null
    const upNext = queueData?.queue ?? []
    const [isSwitching, setIsSwitching] = useState(false)

    const handleTrackClick = async (track) => {
        if (isSwitching) return
        setIsSwitching(true)
        try {
            const result = await window.spotifyControls.playFromContext(contextUri, track.uri)

            if (result !== null) {
                setTimeout(() => refetchQueue?.(), 400)
            }
        } finally {
            setIsSwitching(false)
        }
    }

    return (
        <div className='queue-container'>
            <div className='queue-title'>Now Playing</div>
            <div className="current-track-info">
                <span className='current-track-name'>{currentTrack?.name ?? 'Nothing playing'}</span>
                {currentTrack && (
                    <span className='current-artist-name'>{currentTrack.artists?.[0]?.name}</span>
                )}
            </div>
            <div className='queue-title'>Up Next</div>
            <div className='queue-list'>
                {upNext.map((track, index) => (
                    <div className='queue-item' key={`${track.uri}-${index}`} onClick={() => handleTrackClick(track)}>
                        <span className='queue-track-name'>{track.name}</span>
                        <span className='queue-artist-name'>{track.artists?.[0]?.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default QueueView