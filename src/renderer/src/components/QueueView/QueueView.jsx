import './QueueView.css'

function QueueView() {
    const upNext = [
        { name: 'Promiscuous', artists: [{ name: 'Nelly Furtado' }, { name: 'Timberland' }] },
        { name: 'Rocketeer', artists: [{ name: 'Far East Movement' }, { name: 'Ruff Loaderz' }] },
        { name: 'Beacuse Of You', artists: [{ name: 'Ne-Yo' }] },
    ]
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