import './App.css'
import { Curriculum } from './pages/curriculum'
import { Switch, Route } from 'wouter'
import { Resources } from './pages/resources'
import { Navbar } from './components/Navbar'
import { Advices } from './pages/advices'




function App() {
  

  return (
    <>
      <header>
          <div id="logo">
              <span className="material-icons">local_pharmacy</span>
              <h2>PharmaGuide</h2>
          </div>
      </header>
      <main>
        <Switch>
          <Route path="/" component={Curriculum} />
          <Route path="/resources" component={Resources} />
          <Route path="/advice" component={Advices} />
        </Switch>
      </main>
      <footer>
        <Navbar />
      </footer>
    </>
    // <Curriculum />
  )
}

export default App
