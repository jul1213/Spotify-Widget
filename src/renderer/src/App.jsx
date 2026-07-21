import { useState } from 'react'
import TitleBar from './components/TitleBar/TitleBar'
import './App.css'
import PlayerControls from './components/PlayerControls/PlayerControls'
import Screen from './components/Screen/Screen'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = async () => {
    const tokens = await window.spotifyControls.login()
    console.log('Got tokens:', tokens)
    setIsLoggedIn(true)   // flip state once login succeeds
  }

  return (
    <div className="widget-container">
      <TitleBar />
      <div className="player-content">
        <Screen isLoggedIn={isLoggedIn} onLogin={handleLogin} />
        <PlayerControls />
      </div>
    </div>
  )
}

export default App