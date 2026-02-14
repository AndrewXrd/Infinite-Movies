import React from 'react'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'
import '../css/NavBar.css'

function NavBar({ searchQuery, setSearchQuery }) {
  return (
    <nav className='navbar'>
      <div className='navbar-brand'>
        <img src={logo} className='navbar-logo' alt="Infinity Movies Logo" />
        <Link to='/' className='navbar-title' onClick={() => setSearchQuery("")}>Infinity Movies</Link>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search for movies..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className='navbar-links'>
        <Link to='/' className='nav-link' onClick={() => setSearchQuery("")}>Home</Link>
        <Link to='/fav' className='nav-link'>Favorites</Link>
      </div>
    </nav>
  )
}

export default NavBar