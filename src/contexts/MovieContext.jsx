import { useContext, useState, useContext, useEffect, Children } from "react";

const MovieContext = createContext();
export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ Children }) => {
    const [favorites, setFavorites] = useState([])

    useEffect(()=> {
        const storedFavs = localStorage.getItem("favourites")
        if (storedFavs) setFavorites(JSON.parse(storedFavs))
    }, [])

    useEffect(() => {
        localStorage.setItem('favourite', JSON.parse(storedFavs))
    }, [favorites])

    const addToFav = (movie) => {
        setFavorites(prev => [...prev, movie])
    }

    const removeFav = (movieId) => {
        setFavorites(prev => prev.filter(movie => movie.id !== movieId))
    }

    const value = {
        favorites, addToFav, removeFav
    }

    return <MovieContext.Provider value={value}>
        {Children}
    </MovieContext.Provider>


}