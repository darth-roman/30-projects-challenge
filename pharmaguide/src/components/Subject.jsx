export function Subject({subjectIcon, subjectName, coeff, subjectDesc, relatedSubjects}){
    return(
        <section className="subject">
            <div className="subject-head">
                <div className="icon">
                    <span className="material-icons">{subjectIcon || "science"}</span>
                    <h2>{subjectName}</h2>
                </div>
                <div className="coeff">{coeff} Coeff</div>
            </div>
            <div className="subject-desc">
                <p>{subjectDesc}</p>
            </div>
            <div className="subject-actions">
                {/* <a href={linkToProgram}>More Info</a> */}
                <strong><p>Connected To (Next Years):</p></strong>
                {relatedSubjects.split(",").map(sub => <li>🔬 {sub}</li>)}
            </div>
        </section>
    )
}