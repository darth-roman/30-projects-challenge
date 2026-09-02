export function AITool({title, toolUrl}){

    return(
        <div className="ai-tool">
            <div className="ai-head">
                <div className="logo">
                    <span className="material-icons">book</span>
                </div>
            </div>
            <div className="ai-link">
                <div className="deets">
                    <h3 className="title">{title}</h3>
                </div>
                <a href={toolUrl} target="_blank">Visit Page</a>
            </div>
        </div>
    )
}