import MovieCard from "../components/MovieCard"
import { useState, useEffect } from "react"
import {searchMovies, getPopularMovies} from "../services/api"
import "../css/Home.css"


function Home() {

    const[searchQuery, setSearchQuery] = useState("");
    const[moviesList, setMoviesList] = useState([]);
    const[error, setError] = useState(null);
    const[loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPopularMovies = async () => {
            try{
                const popularMovies = await getPopularMovies();
                setMoviesList(popularMovies);
            } catch (error) {
                console.log(error);
                setError("Failed to fetch popular movies.");
            }
            finally{
                setLoading(false);
            }
        }
        fetchPopularMovies();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        if (loading) return;
        setLoading(true);

        try{
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


    return (
        <div className="home">

            <form onSubmit={handleSearch} className="search-form">
                <input type="text" 
                    placeholder="Search Movie" 
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    />
                <button type="submit" className="search-btn">Search</button>
            </form>

            {error && <p className="error-message">{error}</p>}

            {loading ? (
            <p className="loading-message">Loading...</p>
            ) : (
            <div className="movie-grid">
                {moviesList.map((movieVariable) => 
                movieVariable.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                <MovieCard movie={movieVariable} key={movieVariable.id} />)}
            </div>
            )}
        </div>


    )

}

export default Home