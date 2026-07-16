import TitleBar from './components/TitleBar/TitleBar'
import './App.css'
import PlayerControls from './components/PlayerControls/PlayerControls'

function App() {
  return (
    <div className="widget-container">
      <TitleBar />
      <div className="player-content">
        <PlayerControls />
      </div>
    </div>
  )
}

export default App