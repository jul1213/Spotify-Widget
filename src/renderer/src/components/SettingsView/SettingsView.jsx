import './SettingsView.css'
import { PRESET_COLOURS } from '../../constants'

function SettingsView({ onSelectColor, activeColor, onClose }) {
    return (
        <div className="settings-overlay" onClick={onClose}>
            <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
                <p className="settings-label">Pick a color</p>
                <div className="color-row">
                    {PRESET_COLOURS.map((preset) => (
                        <button
                            key={preset.name}
                            className={`color-swatch ${activeColor === preset.name ? 'active' : ''}`}
                            style={{
                                background: `linear-gradient(145deg, ${preset.light}, ${preset.dark})`
                            }}
                            onClick={() => onSelectColor(preset)}
                            aria-label={preset.name}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SettingsView