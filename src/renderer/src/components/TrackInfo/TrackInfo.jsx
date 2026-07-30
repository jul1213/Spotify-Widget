import Marquee from '../Marquee/Marquee'
import './TrackInfo.css'

function TrackInfo({ track }) {
    const trackName = track?.item?.name ?? "Nothing playing"
    const artistName = track?.item?.artists?.[0]?.name ?? ''
    const albumArtUrl = track?.item?.album?.images?.[0]?.url

    return (
        <div className='track-container'>
            <div
                className='album-cover'
                style={{ backgroundImage: albumArtUrl ? `url(${albumArtUrl})` : 'none' }}
            />
            <div className='text-container'>
                <Marquee className='track-name'>{trackName}</Marquee>
                <span className='artist-name'>{artistName}</span>
            </div>
        </div>
    )
}

export default TrackInfo