import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { getMovieDetails } from "../services/api"
import "../css/MovieDetail.css"

function MovieDetail() {
    const { id } = useParams()
    const [movie, setMovie] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                setLoading(true)
                const data = await getMovieDetails(id)
                setMovie(data)
            } catch (err) {
                console.error(err)
                setError("Failed to fetch movie details.")
            } finally {
                setLoading(false)
            }
        }
        fetchMovieDetails()
    }, [id])

    if (loading) return <div className="detail-loading">Loading details...</div>
    if (error) return <div className="detail-error">{error}</div>
    if (!movie) return <div className="detail-error">Movie not found.</div>

    const backdropUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : null;

    return (
        <div className="movie-detail-container">
            {/* Background with overlay */}
            {backdropUrl && (
                <div
                    className="backdrop-image"
                    style={{ backgroundImage: `url(${backdropUrl})` }}
                />
            )}
            <div className="backdrop-overlay" />

            <div className="movie-detail-content">
                {/* Poster */}
                <div className="detail-poster-container">
                    {movie.poster_path ? (
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="detail-poster"
                        />
                    ) : (
                        <div className="no-poster">No Image</div>
                    )}
                </div>

                {/* Info */}
                <div className="detail-info">
                    <Link to="/" className="back-btn">
                        ← Back to Home
                    </Link>

                    <h1 className="detail-title">{movie.title}</h1>

                    <div className="detail-meta">
                        <span>{movie.release_date?.split("-")[0]}</span>
                        <span>•</span>
                        <span className="rating-star">
                            ★ {movie.vote_average?.toFixed(1)}
                        </span>
                        <span>•</span>
                        <span>{movie.runtime} min</span>
                    </div>

                    <div className="genres-list">
                        {movie.genres?.map(genre => (
                            <span key={genre.id} className="genre-tag">
                                {genre.name}
                            </span>
                        ))}
                    </div>

                    <p className="detail-overview">
                        {movie.overview}
                    </p>

                </div>
            </div>
        </div>
    )
}

export default MovieDetail
