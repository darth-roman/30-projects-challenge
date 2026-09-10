import { Qcm } from "../components/Qcm";
import { Subject } from "../components/Subject";
import { supabase } from "../utils/supabase"
import { useState, useEffect } from 'react'



export function Curriculum(){
    const [subjects, setSubjects] = useState([])
    const [qcms, setQCMS] = useState([])
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')

    async function fetchSubjects(){
        const { data, error } = await supabase.schema("public").from("subjects").select("*")
        if (error) {
            throw error
        }
        return data
    }

    async function fetchQCMs(){
        const { data, error } = await supabase.schema("public").from("qcms").select("*")
        if (error) {
            throw error
        }
        return data
    }

    useEffect(() => {
        let cancelled = false

        fetchSubjects().then((data) => {
            if (!cancelled) {
                setSubjects(data)
                setLoading(false)
            }
        }).catch((error) => {
            if (!cancelled) {
                console.error(error)
                setErrorMessage(error.message || 'Unable to load subjects.')
                setLoading(false)
            }
        })

        fetchQCMs().then((data) => {
            if (!cancelled) {
                setQCMS(data)
                setLoading(false)
            }
        }).catch((error) => {
            if (!cancelled) {
                console.error(error)
                setErrorMessage(error.message || 'Unable to load subjects.')
                setLoading(false)
            }
        })

        

        return () => {
            cancelled = true
        }
    }, [])
    return(
    <>
        <section id="welcome">
            <h2>Welcome to Pharmacy</h2>
            <p>
                First of all, congratulations 🥳🎉 for being accepted to this field,
                whether you chose to be here or sent to be here,
                you are in for a great adventure (+💶💶💶)
            </p>
            <p>
                My name is Abderrahmane, you can call me Roman,  and I am a 4th year student
                <p>
                    This is a small gift from me, and some other colleagues who helped collect 
                    some resources, to you!
                </p>
                <p>
                    This is a guide to your new journey, that is designed to help you find useful resources,
                    information about what will you study and advices from other students who have been in your shoes
                </p>
            </p>
            <p>
                And my favorite advice, comes from the Roman saying "<strong><em>Si vis pacem, para bellum</em></strong>", if you want peace, prepare for war!, so <strong>PREPARE FOR WAR</strong>
            </p>
            <div id="contributors"></div>
            <a href="https://darth-roman.github.io/" target="_blank" rel="noopener noreferrer">Visit My Website</a>

        </section>
        {/* <!-- These can be "pages" --> */}
        <div className="title">
            <span className="material-icons">map</span>
            <h2>Core Subjects</h2>
        </div>
        <section id="subjects">
            {loading && <p>Loading subjects...</p>}
            {!loading && errorMessage && <p>{errorMessage}</p>}
            {!loading && !errorMessage && subjects.length === 0 && <p>No subjects found.</p>}
            {!loading && !errorMessage && subjects.map((subject) => (
                <Subject
                    key={subject.id}
                    subjectIcon={subject.subject_icon}
                    subjectName={subject.subject_name}
                    coeff={subject.coeff}
                    subjectDesc={subject.subject_description}
                    linkToProgram={subject.link_to_program}
                    relatedSubjects={subject.connected_subjects}
                />
            ))}
        </section>

        <div className="title">
            <span className="material-icons">psychology</span>
            <h2>TDs and TPs</h2>
        </div>

        <section id="td-tp">
            <div id="lectures" className="info-sect">
                <div className="sect-head">
                    <span className="material-icons">book</span>
                    <h3>Lectures</h3>
                </div>
                <p>
                    Where you will have the main content of most subjects
                </p>
                <div>
                    <p>
                        These are VERY important, regardless of what other colleagues say about their importance (being un-important).
                    </p>
                    <p>
                        Usually attendance is not taken during lectures, but that doesn't make them less important
                    </p>
                </div>
            </div>
            <div id="td" className="info-sect">
                <div className="sect-head">
                    <span className="material-icons">book</span>
                    <h3>TDs (Travaux Derigees)</h3>
                </div>
                <div>
                    <p>
                        Here you will study in classrooms, less colleagues, in smaller groups.
                    </p>
                    <p>
                        Attendance here is <strong>COUNTED</strong>, and after a certain number of 
                        absences, you will be <strong>EXCLUDED</strong> (scary word), of the subject. take it as losing some rights of that subject
                    </p>
                    <p>
                        Usually, the rule is simple, <strong><em>5 Justified Absences</em></strong> OR <strong><em>3 UN-justified absences</em></strong>.
                        So, make sure to have <strong>LESS</strong> than 5 <strong>JUSTIFIED</strong> / 3 <strong>UN-JUSTIFIED</strong> absences (Easy, right?)
                    </p>
                    <p>
                        <strong>PS:</strong> Justification must be on paper, (medical certificate for example), not a verbal one, unless you can REALLY manipulate adminstration (lol)
                    </p>
                </div>
            </div>
            <div id="tp" className="info-sect">
                <div className="sect-head">
                    <span className="material-icons">book</span>
                    <h3>TPs (Travaux Pratiques)</h3>
                </div>
                <div>
                    <p>
                        Here you will study in labs, with the same group you have TD with.
                    </p>
                    <p>
                        Same rules for absences goes here
                    </p>
                    <p>
                        Lab coats are <strong>MANDATORY</strong>, even for subjects that doesn't seem to need one, it's protocol.
                    </p>
                    <p>
                        If you forget yours, you CAN ask nicely teachers to lend you one (our teachers are super nice)
                    </p>
                </div>
            </div>
        </section>

        <div className="title">
            <span className="material-icons">rule</span>
            <h2>Exams System</h2>
        </div>

        <section className="informative exams" >
            <ul>
                <li>
                    <p>
                        Exams in your first year are Semestrial or Once in a Year
                    </p>
                </li>
                <li>
                    <p>
                        Semestrial, meaning, you will pass one each semester (at least 2 in a year).
                        Like <strong>Organic Chemistry</strong>, <strong>General Chemistry</strong>, <strong>Cell Biology</strong> and <strong>Biostat/Biomath</strong>
                    </p>
                </li>
                <li>
                    <p>As for once in a year, like <strong>Anatomy</strong>, <strong>Physiology</strong> and <strong>SSH</strong></p>
                </li>

                <li>
                    <p>You may or may NOT have <strong>Practical Exams</strong>, where you will be tested on content you had on your TPs</p>
                </li>

                <li>
                    <p>Most, if not ALL, exams will be under the form of <strong>MCQs (Multiple Choices Questions)</strong></p>
                </li>
                <li>
                    <p>Don't let the form trick you, it requires focus and work as any other form of examination</p>
                </li>

                <li>
                    <p>While preparing for exams, you might need something we call here <strong>Cahiers de Controle</strong>, which are previous years exams, that you can buy and use to test yourself</p>
                </li>
                <li>
                    <p>
                        Take it as a Exams Bank, just on paper (you might find digital ones too).
                    </p>
                </li>

                <li>
                    <p>
                        I would highly recommend to use Constantine ones, since they have the closest to this year's exams
                    </p>
                </li>

                <li>
                    <p>
                        See below, the ones exist in our faculty (usually sold in the printing stores (EasyPrint or BestPrint) outside the University)
                    </p>
                </li>

                <li>
                    <p>
                        <strong>PS:</strong> Those might not be the only ones, but the ones i could collect, but, usually, they all can help, and most importantly, <strong>DON'T PICK MANY, so your won't feel overwhelmed</strong>
                    </p>
                </li>
            </ul>
        </section>

        <div className="title">
            <span className="material-icons">rule</span>
            <h2>Exams Books</h2>
        </div>

        <section id="qcms">
            {loading && <p>Loading QCMs...</p>}
            {!loading && errorMessage && <p>{errorMessage}</p>}
            {!loading && !errorMessage && qcms.length === 0 && <p>No QCMs found.</p>}
            {!loading && !errorMessage && qcms.map((qcm) => (
                <Qcm
                    key={qcm.id}
                    qcmName={qcm.qcm_name}
                    rating={qcm.rating}
                    qcmUrl={qcm.qcm_url}
                />
            ))}
        </section>
    </>
    )
}