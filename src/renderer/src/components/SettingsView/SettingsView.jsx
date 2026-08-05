import './SettingsView.css'

const PRESET_COLOURS = [
    { name: 'mint', light: '#d6fcf2', dark: '#99bbb3' },
    { name: 'blush', light: '#fcdbe2', dark: '#b8949c' },
    { name: 'lavender', light: '#e4def8', dark: '#a197b2' },
    { name: 'butter', light: '#fbedaf', dark: '#ebd581' },
    { name: 'orange', light: '#f8c892', dark: '#e3a366' },
    { name: 'sky', light: '#9cc0e4', dark: '#8193bd' },
    { name: 'grey', light: '#f6f6f6', dark: '#bfbebe' },
    { name: 'black', light: '#474747', dark: '#333333' }
]

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