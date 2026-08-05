import { useState, useEffect, useCallback } from 'react'
import WidgetControls from './components/WidgetControls/WidgetControls'
import './App.css'
import PlayerControls from './components/PlayerControls/PlayerControls'
import Screen from './components/Screen/Screen'
import SettingsView from './components/SettingsView/SettingsView'
import { PRESET_COLOURS } from './constants'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(null)
  const [showQueue, setShowQueue] = useState(false)
  const [queueData, setQueueData] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [activeColor, setActiveColor] = useState('mint')

  const handleLogin = async () => {
    await window.spotifyControls.login()
    setIsLoggedIn(true)   // flip state once login succeeds
  }

  const handleLogout = async () => {
    await window.spotifyControls.logout()

    setIsLoggedIn(false)
    setCurrentTrack(null)
    setQueueData(null)
    setShowQueue(false)
    setShowSettings(false)
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

  /* QUEUE VIEW */
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

  /* SETTINGS VIEW */
  useEffect(() => {
    const loadSavedColor = async () => {
      const settings = await window.appSettings.load()
      if (settings?.presetColor) {
        const preset = PRESET_COLOURS.find(p => p.name === settings.presetColor)
        if (preset) handleSelectColor(preset)
      }
    }
    loadSavedColor()
  })

  const handleSelectColor = (preset) => {
    setActiveColor(preset.name)
    document.documentElement.style.setProperty('--widget-light', preset.light)
    document.documentElement.style.setProperty('--widget-dark', preset.dark)
    window.appSettings.save({ presetColor: preset.name })
  }

  return (
    <div className="widget-container">
      <WidgetControls onSettingsClick={() => setShowSettings(true)} />
      <div className="player-content">
        <Screen isLoggedIn={isLoggedIn} onLogin={handleLogin} track={currentTrack} showQueue={showQueue} queueData={queueData} refetchQueue={fetchQueue} />
        <PlayerControls isPlaying={currentTrack?.is_playing ?? false} onToggleQueue={toggleQueue} />
      </div>

      {showSettings && (
        <SettingsView
          activeColor={activeColor}
          onSelectColor={handleSelectColor}
          onClose={() => setShowSettings(false)}
          onLogout={handleLogout}
        />
      )}
    </div>
  )
}

export default App