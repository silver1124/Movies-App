import React,{useState, useEffect, useCallback} from 'react';
import MoviesList from './components/MoviesList';
import AddMovies from './components/AddMovies';
import './App.css';
function App() {
  const [movies, setMovies]=useState([])
  const [isLoading, setIsLoading]= useState(false);
  const [error, setError]= useState(null);
  const [cancelLoadTimer, setcancelLoadTimer]= useState(null);
  const fetchMoviesHandler = useCallback(async ()=>{
    setIsLoading(true);
    setError(null);
    try{
      
    const response= await fetch("https://react-movieapp-demo-default-rtdb.firebaseio.com/movies.json/")
    if(!response.ok){
      throw new Error(`Something went wrong... Retrying`);
    }
    const data= await response.json();
    const loadedData= [];
    for( let key in data){
      loadedData.push({
        id: key,
        title: data[key].title,
        openingText: data[key].openingText,
        releaseDate: data[key].releaseDate
      })
    }
      setMovies(loadedData);
    } catch (error){
      setError(error.message);
      const retryLoadTimer = setTimeout(fetchMoviesHandler, 5000);
      setIsLoading(true);
      setcancelLoadTimer(retryLoadTimer);
    }
    setIsLoading(false);
  },[]);
  useEffect(()=>{
    fetchMoviesHandler();
  },[]);
  async function addMovieHandler(movie) {
    const response= await fetch("https://react-movieapp-demo-default-rtdb.firebaseio.com/movies.json/", {
      method: 'POST',
      body: JSON.stringify(movie),
      headers:{
        'Content-Type' : 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);
  }

  async function onDeleteMovie(id){
    try{
      const movieData= await fetch(`https://react-movieapp-demo-default-rtdb.firebaseio.com/movies/${id}.json//`, {
        method: 'GET'
    });
    if(movieData.ok){
      const movieDetails= await movieData.json();
       let details= {
          Title: movieDetails.title,
          Opening_Text: movieDetails.openingText,
          Release_Date: movieDetails.releaseDate
        }
        console.log(details);
    }

      const res= await fetch(`https://react-movieapp-demo-default-rtdb.firebaseio.com/movies/${id}.json//`, {
        method: 'DELETE'
    });
    if (res.ok) {
      setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
    } else {
      throw new Error('Failed to Delete The Movie')
    }
    } catch(err){
      setError(err.message);
    }
}

  const handleCancelRetry = () => {
    if (cancelLoadTimer) {
      clearTimeout(cancelLoadTimer);
      setcancelLoadTimer(null);
    }
    setIsLoading(false);
  };

  let content = <p><b>Found No Movies.</b></p>;
  if(movies.length>0){
    content= <MoviesList movies={movies} onDeleteHandler={onDeleteMovie}/>
  }
  if(error){
    content= <p><b>{error}</b></p>
  }
  if(isLoading){
    content= <p><b>Loading...PLease wait a while...</b></p>;
  }
  return (
    <React.Fragment>
    <section>
        <AddMovies onAddMovie={addMovieHandler} />
      </section>
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