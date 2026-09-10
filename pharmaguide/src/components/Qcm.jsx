export function Qcm({ qcmName, rating, qcmUrl }){
    return(
        <div className="qcm">
            <div className="qcm-head">
                <div className="cover">
                    <span className="material-icons">book</span>
                </div>
                <div className="deets">
                    <h3 className="title">
                        <a href={qcmUrl} target="_blank">{qcmName}</a>
                    </h3>
                    <p>
                        <span className="material-icons">star</span>
                        {rating}/5
                    </p>
                </div>
            </div>
            <div className="qcm-link">
                <a href={qcmUrl} target="_blank">Visit Page</a>
            </div>
        </div>
    )
}
