export function Subject({subjectIcon, subjectName, coeff, subjectDesc, linkToProgram}){
    return(
        <section class="subject">
            <div class="subject-head">
                <div class="icon">
                    <span class="material-icons">{subjectIcon || "science"}</span>
                    <h2>{subjectName}</h2>
                </div>
                <div class="coeff">{coeff}</div>
            </div>
            <div class="subject-desc">
                <p>{subjectDesc}</p>
            </div>
            <div class="subject-actions">
                <a href={linkToProgram}>More Info</a>
            </div>
        </section>
    )
}