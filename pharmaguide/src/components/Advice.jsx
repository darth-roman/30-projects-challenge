export function Advice({authorName, authorOccupation, adviceBody}){
    return (
        <>
        <section className="advice">
            <div className="advice-head">
                <div className="author">
                    <h2>{authorName}</h2>
                    <small>{authorOccupation}</small>
                </div>
                <div id="quote"><span className="material-icons">format_quote</span></div>
            </div>
            <div className="advice-body">
                <p>
                    {adviceBody}
                </p>
            </div>
        </section>

        </>
    )
}