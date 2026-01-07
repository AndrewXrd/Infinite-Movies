import React from 'react'
import "../css/NavBar.css"
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'

function NavBar() {
  return (
    <nav className='navbar'>
      <div className='navbar-brand'>
        <img src={logo} className='logo' />
        <Link to='/' className='title-infi'>Infinity Movies</Link>
      </div>
      <div className='navbar-links'>
        <Link to='/' className='nav-link'>Home</Link>
        <Link to='/fav' className='nav-link'>Favorites</Link>
      </div>
    </nav>
  )
}

export default NavBar