import { useMovieContext } from "../contexts/MovieContext"
import { useNavigate } from "react-router-dom"
import "../css/MovieCard.css"

function MovieCard({ movie }) {
    const { isFavorite, addToFav, removeFav } = useMovieContext()
    const favorite = isFavorite(movie.id)
    const navigate = useNavigate()

    function onFavoriteClick(e) {
        e.stopPropagation() // Prevent card click
        e.preventDefault()
        if (favorite) removeFav(movie.id)
        else addToFav(movie)
    }

    function onCardClick() {
        navigate(`/movie/${movie.id}`)
    }

    return (
        <div className="movie-card" onClick={onCardClick}>
            <div className="movie-poster-container">
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="movie-poster"
                />

                {/* Overlay Gradient */}
                <div className="movie-overlay" />

                {/* Favorite Button - Top Right */}
                <button
                    className={`favorite-btn ${favorite ? "active" : ""}`}
                    onClick={onFavoriteClick}
                >
                    <span className="favorite-icon">♥</span>
                </button>

                {/* Rating Badge - Top Left */}
                <div className="rating-badge">
                    <span>★</span>
                    <span>{movie.vote_average?.toFixed(1)}</span>
                </div>
            </div>

            <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <div className="movie-footer">
                    <span>{movie.release_date?.split("-")[0]}</span>
                </div>
            </div>
        </div>
    )
}

export default MovieCard
