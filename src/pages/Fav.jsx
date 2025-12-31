import '../css/Fav.css'
import { useMovieContext } from '../contexts/MovieContext'
import MovieCard from '../components/MovieCard'


function Favourite() {
    const { favorites } = useMovieContext();

    if (favorites && favorites.length > 0) {
        return (
            <div className="favorites">
                <h2>Your Favorites</h2>
                <div className="movie-grid">
                    {favorites.map(movie => (
                        <MovieCard movie={movie} key={movie.id} />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="favorite-empty">
            <h2>Your Favourite list is empty</h2>
            <p>Add movies to your favourite list by clicking on the ♡ icon on the movie card.</p>
        </div>
    );
}

export default Favourite