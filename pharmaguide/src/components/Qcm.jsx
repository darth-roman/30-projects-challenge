export function Qcm({ qcmName, rating, qcmUrl }){
    return(
        <div class="qcm">
            <div class="qcm-head">
                <div class="cover">
                    <span class="material-icons">book</span>
                </div>
                <div class="deets">
                    <h3 class="title">{qcmName}</h3>
                    <p>
                        <span class="material-icons">star</span>
                        {rating}/5
                    </p>
                </div>
            </div>
            <div class="qcm-link">
                <a href={qcmUrl}>Visit Page</a>
            </div>
        </div>
    )
}
