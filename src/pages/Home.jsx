import MovieCard from "../components/MovieCard"
import { useState, useEffect } from "react"
import { searchMovies, getPopularMovies } from "../services/api"
import { useNavigate } from "react-router-dom"
import "../css/Home.css"

function Home({ searchQuery, aiMovies }) {
    const [moviesList, setMoviesList] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch popular movies on mount
    useEffect(() => {
        const fetchPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies();
                setMoviesList(popularMovies);
            } catch (error) {
                console.log(error);
                setError("Failed to fetch popular movies.");
            } finally {
                setLoading(false);
            }
        }

        // Priority: AI Movies > Search Query > Popular Movies
        if (aiMovies && aiMovies.length > 0) {
            setMoviesList(aiMovies);
            setLoading(false);
            setError(null);
        } else if (!searchQuery) {
            fetchPopularMovies();
        }
    }, [aiMovies]); // Re-run when aiMovies changes

    // Search movies when searchQuery changes
    useEffect(() => {
        const fetchSearchResults = async () => {
            if (aiMovies) return; // Don't search if showing AI results

            if (!searchQuery.trim()) {
                // If search query is empty, revert to popular movies
                setLoading(true);
                try {
                    const popularMovies = await getPopularMovies();
                    setMoviesList(popularMovies);
                    setError(null);
                } catch (err) {
                    setError("Failed to fetch movies.")
                } finally {
                    setLoading(false);
                }
                return;
            }

            setLoading(true);
            try {
                const searchResults = await searchMovies(searchQuery);
                setMoviesList(searchResults);
                setError(null);
            } catch (error) {
                console.log(error);
                setError("Failed to fetch search results.");
            } finally {
                setLoading(false);
            }
        }

        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchSearchResults();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, aiMovies]); // Include aiMovies to prevent search overrides

    // Featured Movie (First in the list)
    const featuredMovie = moviesList.length > 0 ? moviesList[0] : null;

    // Determine Title
    let sectionTitle = "Popular Movies";
    if (aiMovies) sectionTitle = "AI Recommendations";
    else if (searchQuery) sectionTitle = `Search Results for "${searchQuery}"`;

    return (
        <div className="home-container">

            {/* Hero Section */}
            {!searchQuery && !aiMovies && featuredMovie && (
                <div className="hero-section"
                    style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})` }}>
                    <div className="hero-overlay"></div>
                    <div className="hero-content">
                        <h1 className="hero-title">{featuredMovie.title}</h1>
                        <p className="hero-description">{featuredMovie.overview}</p>
                        <div className="hero-buttons">
                            <button
                                onClick={() => navigate(`/movie/${featuredMovie.id}`)}
                                className="btn btn-primary"
                            >
                                Play Now
                            </button>
                            <button
                                onClick={() => navigate(`/movie/${featuredMovie.id}`)}
                                className="btn btn-secondary"
                            >
                                More Info
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Content Section */}
            <div className={`content-section ${aiMovies || searchQuery ? 'has-no-hero' : ''}`}>

                {/* Section Title */}
                <h2 className="section-title">
                    {sectionTitle}
                </h2>

                {error && <p className="error-message">{error}</p>}

                {loading ? (
                    <div className="loading-spinner-container">
                        <div className="loading-spinner"></div>
                    </div>
                ) : (
                    <div className="movies-grid">
                        {moviesList.map((movie) => (
                            <div key={movie.id} className="movie-grid-item">
                                <MovieCard movie={movie} />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && moviesList.length === 0 && (
                    <div className="no-movies">
                        No movies found.
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home