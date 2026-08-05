import './WidgetControls.css'
import SettingsIcon from '../../assets/settings.svg?react'
import CloseIcon from '../../assets/cross.svg?react'

function WidgetControls() {
    const handleSettings = () => console.log("settings clicked")
    const handleClose = () => window.windowControls.close()

    return (
        <div className='hot-zone'>
            <div className="title-bar">
                <div className="section left">
                    <button className="settings-btn" onClick={handleSettings}>
                        <SettingsIcon />
                    </button>
                </div>

                <div className="section right">
                    <button className="close-btn" onClick={handleClose}>
                        <CloseIcon />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default WidgetControls