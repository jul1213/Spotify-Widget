import './QueueView.css'

function QueueView({ queueData }) {
    const upNext = queueData?.queue ?? []
    return (
        <div className='queue-container'>
            <div className='queue-title'>Up Next</div>
            <div className='queue-list'>
                {upNext.map((track, index) => (
                    <div className='queue-item' key={index}>
                        <span className='queue-track-name'>{track.name}</span>
                        {' - '}
                        <span className='queue-artist-name'>{track.artists?.[0]?.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default QueueView