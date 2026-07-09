import './TitleBar.css'

function TitleBar() {
    const handleMinimize = () => window.windowControls.minimize()
    const handleClose = () => window.windowControls.close()

    return (
        <div className="title-bar">
            <div className="drag-region" />
            <div className="controls">
                <button onClick={handleMinimize}>–</button>
                <button onClick={handleClose}>✕</button>
            </div>
        </div>
    )
}

export default TitleBar