export function Drive({driveName, driveUrl, year}){
    return(
        <div className="drive-link">
            <div className="drive-icon">
                <span className="material-icons">school</span>
            </div>
            <div className="drive-deets">
                <a href={driveUrl}>{driveName}</a>
                <p>({year})</p>
            </div>
        </div>
    )
}