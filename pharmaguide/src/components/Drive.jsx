export function Drive({driveName, driveUrl, year}){
    return(
        <div class="drive-link">
            <div class="drive-icon">
                <span class="material-icons">school</span>
            </div>
            <div class="drive-deets">
                <a href={driveUrl}>{driveName}</a>
                <p>({year})</p>
            </div>
        </div>
    )
}