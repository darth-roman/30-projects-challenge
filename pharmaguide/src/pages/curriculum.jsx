import { Qcm } from "../components/Qcm";
import { Subject } from "../components/Subject";


export function Curriculum(){

    return(
    <>
        <div class="circle green-circle"></div>
        <div class="square red-square"></div>
        <section id="welcome">
            <h2>Welcome to Pharmacy</h2>
            <p>
                Your comprehensive, open-access
                companion for pharmacy studies.
                Explore curriculum maps, resource
                directories, and expert advice—all
                designed to help you navigate your
                academic journey with confidence.
                Created by a fellow student to simplify
                your learning experience.
            </p>

            <div id="contributors"></div>
            <a href="https://darth-roman.github.io/" target="_blank" rel="noopener noreferrer">Visit My Website</a>

        </section>
        {/* <!-- These can be "pages" --> */}
        <div class="title">
            <span class="material-icons">map</span>
            <h2>Core Subjects</h2>
        </div>
        <section id="subjects">
            <section class="subject">
                <div class="subject-head">
                    <div class="icon">
                        <span class="material-icons">local_florist</span>
                        <h2>Botany</h2>
                    </div>
                    <div class="coeff">4 Coeff</div>
                </div>
                <div class="subject-desc">
                    <p>Structure, bonding, and reactivity of organic compounds essential for drug synthesis.</p>
                </div>
                <div class="subject-actions">
                    <a href="#">More Info</a>
                </div>
            </section>
            <Subject
                subjectIcon="science"
                subjectName="General Chemistry"
                coeff="5 Coeff"
                subjectDesc="Fundamental principles of matter, reactions, and laboratory techniques for pharmacy practice."
                linkToProgram="#general-chemistry"
            />
        </section>

        <div class="title">
            <span class="material-icons">rule</span>
            <h2>Exams Books</h2>
        </div>

        <section id="qcms">
            <Qcm qcmName="Testini" rating="4.7" qcmUrl="#testini" />
            <Qcm qcmName="QCMS 25" rating="4.4" qcmUrl="#qcms-25" />
        </section>
        <div class="title">
            <span class="material-icons">psychology</span>
            <h2>TDs and TPs</h2>
        </div>

        <section id="td-tp">
            <div id="td" class="info-sect">
                <div class="sect-head">
                    <span class="material-icons">book</span>
                    <h3>TDs (Travaux Derigees)</h3>
                </div>
                <p>
                    Problem-solving and theoretical application sessions. Subjects like General Chemistry and Organic Chemistry heavily feature these to reinforce lecture concepts.
                </p>
            </div>
            <div id="tp" class="info-sect">
                <div class="sect-head">
                    <span class="material-icons">book</span>
                    <h3>TPs (Travaux Pratiques)</h3>
                </div>
                <p>
                    Problem-solving and theoretical application sessions. Subjects like General Chemistry and Organic Chemistry heavily feature these to reinforce lecture concepts.
                </p>
            </div>
        </section>
    </>
    )
}