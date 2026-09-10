export function Link({linkIcon, linkName, linkUrl, country, faculty, subjects}){
    return(
        <div className="influencer">
            <div className="image">
                <span className="material-icons">{linkIcon}</span>
            </div>
            <div className="deets">
                <h4><a href={linkUrl}>{linkName}</a></h4>
                <p><strong>{subjects}</strong></p>
                <p>{country} / {faculty}</p>
            </div>
        </div>
    )
}