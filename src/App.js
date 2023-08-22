import React,{useState} from 'react';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies]=useState([])
  const [isLoading, setIsLoading]= useState(false);
  const [error, setError] = useState(null);
  const [cancel, setCancel] = useState(null)

  const fetchMoviesHandler = async ()=>{
    setIsLoading(true);
    setError(null)
    try{
    const response= await fetch("https://swapi.dev/api/film/")
      if (!response.ok){
          throw new Error('Something went wrong... Retrying!');
      }
    const data= await response.json();
      const transformedData = data.results.map(movieData=>{
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date
        }
      })
      setMovies(transformedData);
    } catch (error) {
      setError(error.message)

      const retryHandler = setTimeout (fetchMoviesHandler, 5000);
      setIsLoading(true);
      setCancel(retryHandler)
    }
    setIsLoading(false);
  }
  const handleCancelRetry = () => {
    if (cancel) {
      clearTimeout(cancel);
      setCancel(null);
    }
    setIsLoading(false);
  };

  let content =<p>Found no movies</p>

  if(movies.length > 0){
    content = <MoviesList movies={movies} />
  }

  if(error){
    content = <p>{error}</p>
  }

  if(isLoading){
    content = <p>Loading...</p>
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
        <button onClick={handleCancelRetry}>Cancel Retry</button>
      </section>
      <section>
        {content}
      </section>
    </React.Fragment>
  );
}
export default App;