import { useState, useEffect, useCallback } from 'react'
import TitleBar from './components/WidgetControls/WidgetControls'
import './App.css'
import PlayerControls from './components/PlayerControls/PlayerControls'
import Screen from './components/Screen/Screen'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(null)
  const [showQueue, setShowQueue] = useState(false)
  const [queueData, setQueueData] = useState(null)

  const handleLogin = async () => {
    // const tokens = await window.spotifyControls.login()
    // console.log('Got tokens:', tokens)
    await window.spotifyControls.login()
    setIsLoggedIn(true)   // flip state once login succeeds
  }

  useEffect(() => {
    if (!isLoggedIn) return

    const fetchTrack = async () => {
      const data = await window.spotifyControls.getCurrentTrack()
      console.log('Fetched track data:', data)
      setCurrentTrack(data)
    }

    fetchTrack()    // fetch immediately on login
    const interval = setInterval(fetchTrack, 4000)

    return () => clearInterval(interval)    // cleanup if component unmounts or if isLoggedIn changes
  }, [isLoggedIn])

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = await window.spotifyControls.checkAuth()
      console.log('Startup auth check:', loggedIn)
      setIsLoggedIn(loggedIn)
    }
    checkAuth()
  }, [])


  const toggleQueue = () => setShowQueue(prev => !prev)
  const fetchQueue = useCallback(async () => {
    const data = await window.spotifyControls.getQueue()
    console.log('Fetched queue data:', data)
    setQueueData(data)
  }, [])

  useEffect(() => {
    if (!showQueue) return

    fetchQueue()    // fetch immediately when queue view opens
    const interval = setInterval(fetchQueue, 5000)

    return () => clearInterval(interval)
  }, [showQueue, fetchQueue])

  return (
    <div className="widget-container">
      <TitleBar />
      <div className="player-content">
        <Screen isLoggedIn={isLoggedIn} onLogin={handleLogin} track={currentTrack} showQueue={showQueue} queueData={queueData} refetchQueue={fetchQueue} />
        <PlayerControls isPlaying={currentTrack?.is_playing ?? false} onToggleQueue={toggleQueue} />
      </div>
    </div>
  )
}

export default App