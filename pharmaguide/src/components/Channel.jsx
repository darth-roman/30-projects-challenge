export function Channel({imgSrc, channelName, channelDesc, channelUrl}){
    return(
        <div className="channel">
            <div className="channel-image">
                <img src={imgSrc} alt="" />
            </div>
            <div className="channel-deets">
                <h3>{channelName}</h3>
                <p>
                    {channelDesc}
                </p>
                <a href={channelUrl} target="_blank">Go Visit</a>
            </div>
        </div>
    )
}