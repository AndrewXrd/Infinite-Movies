
import Home from './pages/Home'
import './css/App.css'
import { Routes, Route } from 'react-router-dom'
import Favourite from './pages/Fav'
import NavBar from './components/NavBar'

//npm run dev

function App() {

  return (
    <div>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/fav' element={<Favourite />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
