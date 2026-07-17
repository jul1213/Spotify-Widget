import './TrackInfo.css'

function TrackInfo() {
    return (
        <div className='track-container'>
            <div className='album-cover' />
            <div className='text-container'>
                <span className='track-name'>Track Name</span>
                <span className='artist-name'>Artist Name</span>
            </div>
        </div>
    )
}

export default TrackInfo