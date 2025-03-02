import React, { useEffect, useState } from 'react';
import Search from './Components/Search';
import Spinner from './Components/Spinner';
import MovieCard from './Components/MovieCard';
import { useDebounce } from 'react-use';
import { updateSearchCount } from './appwrite';
import { getTrendingMovies } from './appwrite';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
} 

const App = () => {

  const [searchTerm, setSearchTerm] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const [movieList, setMovieList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [debouncedSearchTerm, setDebounceSearchTerm] = useState('');

  const [trendingMovies, setTrendingMovies] = useState([]);

  // Wait for 1000 ms Before it sets the search term
  useDebounce(() => setDebounceSearchTerm(searchTerm), 1000, [searchTerm]);

  const fetchMovies = async(query = '') => {

    setIsLoading(true);
    setErrorMessage('');


    try{
      const endPoint = query 
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` 
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endPoint, API_OPTIONS);

      // alert(response);
      
      if(!response.ok){
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      console.log(data);

      if(data.response === false){
        setErrorMessage(data.error || `Failed to fetch data`);
        setMovieList([]);

        return;
      }

      setMovieList(data.results || []);

      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0]);
      }

    }catch(error){

      console.error(`Error: ${error}`);

      setErrorMessage('An error occurred while fetching data');

    }finally {
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async () => {
    try{
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);

    }catch(error){
      console.error(`Error: ${error}`);
    }
  }

  // Getting Data from the API
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return(
    <main>
      <div className='pattern'/>

      <div className='wrapper'>
        
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1> Find <span className='text-gradient'>Movies</span> You Will Enjoy Without the Hassle</h1>

        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        {trendingMovies.length > 0 && (
          <section className = 'trending'>
            <h2> Trending Movies </h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p> {index + 1} </p>
                  <img src={movie.poster_url} alt={movie.title}/>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className='all-movies'>
          <h2> All Movies </h2>
          {/* {errorMessage && <p className='text-red-500'>{errorMessage}</p>} */}

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p> 
          ) : (
            <ul>
              {movieList.map((movie) => (
                // <p key={movie.id} className="text-white mt-10">{movie.title}</p>
                <MovieCard key={movie.id} movie={movie}/>
              ))}
            </ul>
          )}

        </section>

        {/* <h1 className = "text-white"> {searchTerm} </h1> */} // Display the search term

      </div>


    </main>
  
  )
};

export default App;