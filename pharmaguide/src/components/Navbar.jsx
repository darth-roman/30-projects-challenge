import { useLocation } from "wouter";
import { Link } from "wouter";

export function Navbar(){

    const [location] = useLocation()
    
    
    return(
        <nav>
            <div className={`nav-item ${location === "/" ? "active" : ""}`}>
                <Link href={`/`}>
                    <span className="material-icons">book</span>Curriculum
                </Link> 
            </div>
            {/* <!-- <div class="nav-item active">
                <a href="#"><span class="material-icons">groups</span>Faculty</a>
            </div> --> */}
            <div className={`nav-item ${location === "/resources" ? "active" : ""}`}>
                <Link href="/resources">
                    <span className="material-icons">inventory</span>Resources
                </Link>
            </div>
            <div className={`nav-item ${location === "/advice" ? "active" : ""}`}>
                <Link href="/advice">
                    <span className="material-icons">lightbulb</span>Advice
                </Link>
            </div>
        </nav>
    )
}