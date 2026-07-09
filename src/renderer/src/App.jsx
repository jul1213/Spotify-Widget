import TitleBar from './components/TitleBar/TitleBar'
import './App.css'

function App() {
  return (
    <div className="widget-container">
      <TitleBar />
      <div className="player-content">
        <p>Hello Spotify Widget!</p>
      </div>
    </div>
  )
}

export default App