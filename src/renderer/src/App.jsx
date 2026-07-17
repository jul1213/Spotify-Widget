import TitleBar from './components/TitleBar/TitleBar'
import './App.css'
import PlayerControls from './components/PlayerControls/PlayerControls'
import Screen from './components/Screen/Screen'

function App() {
  return (
    <div className="widget-container">
      <TitleBar />
      <div className="player-content">
        <Screen />
        <PlayerControls />
      </div>
    </div>
  )
}

export default App