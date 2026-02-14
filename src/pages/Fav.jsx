import "../css/Fav.css"
import { useMovieContext } from "../contexts/MovieContext"
import MovieCard from "../components/MovieCard"

function Favourite() {
    const { favorites } = useMovieContext()

    if (favorites) {
        return (
            <div className="favorites-container">
                <div className="favorites-header">
                    <h2 className="favorites-title">Your Favorite Movies</h2>
                </div>

                <div className="favorites-grid">
                    {favorites.map((movie) => (
                        <div key={movie.id} className="favorite-item">
                            <MovieCard movie={movie} />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="favorites-container">
            <div className="favorites-empty">
                <h2 className="empty-title">No Favorite Movies Yet</h2>
                <p className="empty-text">Start adding movies to your favorites and they will appear here!</p>
            </div>
        </div>
    )
}

export default Favourite