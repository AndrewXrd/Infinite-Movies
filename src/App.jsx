
import Home from './pages/Home'
import './css/App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Favourite from './pages/Fav'
import MovieDetail from './pages/MovieDetail'
import NavBar from './components/NavBar'
import ChatBot from './components/ChatBot'

//npm run dev

function App() {
  const [searchQuery, setSearchQuery] = useState("")
  const [aiMovies, setAiMovies] = useState(null)
  const navigate = useNavigate() // Need to wrap App in Router or move Router up? 
  // Wait, Router is in main.jsx usually. If App is inside Router, useNavigate works.
  // Checking main.jsx... User provided snippets show internal Router usage in App? No, user showed Routes. 
  // Let's assume BrowserRouter is in main.jsx. If not, useNavigate might fail if called outside context.
  // Actually, in standard Vite React template, <BrowserRouter> wraps <App /> in main.jsx.

  const handleMoviesRecommended = (movies) => {
    setAiMovies(movies)
    setSearchQuery("") // Clear search query to show AI results
    // Navigation to home is handled by user or we can force it?
    // We can't navigate here easily if we are not inside Router context contextually... 
    // Wait, if <App> is the root component rendered by main.jsx inside <BrowserRouter>, then `navigate` works.
    // If <Routes> is inside App, then App itself is likely valid.
    // Let's check viewed file App.jsx again... It has Routes.
    // It doesn't import BrowserRouter. So BrowserRouter must be in main.jsx.
    // navigate("/"); // Force go to home to show results
  }

  return (
    <div>
      <NavBar searchQuery={searchQuery} setSearchQuery={(query) => {
        setSearchQuery(query)
        setAiMovies(null) // Clear AI results when user manually searches
      }} />
      <main className="main-content">
        <Routes>
          <Route path='/' element={<Home searchQuery={searchQuery} aiMovies={aiMovies} />} />
          <Route path='/fav' element={<Favourite />} />
          <Route path='/movie/:id' element={<MovieDetail />} />
        </Routes>
      </main>
      <ChatBot onMoviesRecommended={handleMoviesRecommended} />
    </div>
  )
}

export default App
