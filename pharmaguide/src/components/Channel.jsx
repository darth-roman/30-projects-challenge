export function Channel({imgSrc, channelName, channelDesc, channelUrl, subject}){
    return(
        <div className="channel">
            <div className="channel-image">
                <img src={imgSrc} alt="" loading="lazy"/>
            </div>
            <div className="channel-deets">
                <h3><a href={channelUrl} target="_blank">{channelName}</a></h3>
                <small>{subject}</small>
                <p>
                    {channelDesc}
                </p>
                <a href={channelUrl} target="_blank">Go Visit</a>
            </div>
        </div>
    )
}