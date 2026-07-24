import { useState, useEffect } from 'react'
import TitleBar from './components/TitleBar/TitleBar'
import './App.css'
import PlayerControls from './components/PlayerControls/PlayerControls'
import Screen from './components/Screen/Screen'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(null)

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
    const interval = setInterval(fetchTrack, 1000)

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


  return (
    <div className="widget-container">
      <TitleBar />
      <div className="player-content">
        <Screen isLoggedIn={isLoggedIn} onLogin={handleLogin} track={currentTrack} />
        <PlayerControls isPlaying={currentTrack?.is_playing ?? false} />
      </div>
    </div>
  )
}

export default App