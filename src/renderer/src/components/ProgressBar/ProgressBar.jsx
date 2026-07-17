import './ProgressBar.css'

function ProgressBar() {
    return (
        <div className='progress-container'>
            <div className='progress-track'>
                <div className='progress-fill' />
            </div>
            <div className='progress-times'>
                <span className='time-current'>0:00</span>
                <span className='time-end'>3:24</span>
            </div>
        </div>
    )
}

export default ProgressBar