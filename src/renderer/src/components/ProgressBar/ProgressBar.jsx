import './ProgressBar.css'

function ProgressBar({ track }) {
    const progressMs = track?.progress_ms ?? 0
    const durationMs = track?.item?.duration_ms ?? 0

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000)
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const progressPercent = durationMs > 0 ? (progressMs / durationMs) * 100 : 0

    return (
        <div className='progress-container'>
            <div className='progress-track'>
                <div className='progress-fill' style={{ width: `${progressPercent}%` }} />
            </div>
            <div className='progress-times'>
                <span className='time-current'>{formatTime(progressMs)}</span>
                <span className='time-end'>{formatTime(durationMs)}</span>
            </div>
        </div>
    )
}

export default ProgressBar