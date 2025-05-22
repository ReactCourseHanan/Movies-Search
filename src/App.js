import { useEffect, useState } from "react";
import Stars from './starsComponent.js';

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];
//----------------MAIN COMPONENT JSX---------------------------
function Main({children}){
  return  <main className="main">
{children}

</main>
}
const KEY='701c42da'
export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading,setIsLoading]=useState(false);
  const [isNewMovieDetailsLoaded,setisNewMovieDetailsLoaded]=useState(false);
  const [errorMessage,setErrorMessage]=useState('');
  const [selectedId,setSelectedId]=useState(null);
  const [movieDetails,setMovieDetails]=useState(null);
  const [userRating,setUserRating]=useState(null);
  // const [isError,setIsError]=useState(false);
  function closeMovie(){
    setMovieDetails(null);
    setSelectedId(null);
      }
 //--------------handle selectedId------------------------
 function handleSetSelectedId(id){
  setSelectedId(id);
  if(id===selectedId) setSelectedId(null);
 }
 //---------------------- handle movie details--------------------
 function handleDeleteMovie(id){
  setWatched((watched)=>watched.filter((movie)=>movie.imdbID!==id))
 }
 //------------------handle watced--------------------------
 function handleWatchedMovies(newMovie,userRating){
  // e.preventDefault();
  newMovie.userRating=userRating;
  setWatched((watched)=>[...watched,newMovie])
  setSelectedId(null);
 }
 useEffect(function(){
 
  async function getMovieDetails(){
    
    setisNewMovieDetailsLoaded(true);
   
    const response= await fetch(`http://www.omdbapi.com/?i=${selectedId}&apikey=${KEY}`);
    const data=await response.json();
  setMovieDetails(data);
  setisNewMovieDetailsLoaded(false)
  }
  getMovieDetails();
  
 },[selectedId])
  useEffect(function(){
    const controller=new AbortController();
   async function fetchMovies(){

     try{ 
      if(query.length<3){
        setMovies([]);
        setErrorMessage("");
        return;
      }
      setIsLoading(true);
    const response=await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`,{signal:controller.signal}).catch(erro=>{ throw new Error('Something went wrong.please check the internet connection')});
    const data =await response.json();
    if(data.Response==='False') throw new Error("Movie Not Found")
    setMovies(data.Search);
    
     } catch (error){
      // console.log(error);
      // console.log(error.message);
      setErrorMessage(error.message);
      // setIsError(true);
     } finally {
      setIsLoading(false);
     }
  } 
  fetchMovies();
  return function(){
    controller.abort();
  }
},[query])
return (
  <>
     
      <NavBar>
      <Logo />
      <InputText query={query} setQuery={setQuery} />

      <ResultsComponent movies={movies} />
       </NavBar> 
      
<Main >
  {/* <Box element={<MovieListItem movies={movies} />} />
  <Box element={<><MoviesSummary watched={watched} />
  <WatchedMovieList watched={watched} /></>}/> */}
<Box >
  {!isLoading &&!errorMessage && <MovieListItem movies={movies} handleSetSelectedId={handleSetSelectedId} /> }
  {errorMessage && <ErrorMessage message={errorMessage}/>}

  {isLoading&&<Loader />}
  
  </Box>
<Box>
  { selectedId? <MovieDetails movieDetails={movieDetails} setMovieDetails={setMovieDetails} isLoading={isNewMovieDetailsLoaded} handleWatchedMovies={handleWatchedMovies} setUserRating={setUserRating} userRating={userRating} watched={watched} selectedId={selectedId} closeMovie={closeMovie} />:
  <>
  <MoviesSummary watched={watched} />
  <WatchedMovieList watched={watched} userRating={userRating} deleteMovie={handleDeleteMovie}/>
  </>
}
   </Box>
</Main>
  </>
);
}
//---------------------Movie Details--------------------------
function MovieDetails({movieDetails,setMovieDetails,isLoading,handleWatchedMovies,setUserRating,userRating,watched,selectedId,closeMovie}){
  let isWatched=watched.map((el)=>el.imdbID).includes(selectedId);
  const rating=watched?.find((movie)=>movie.imdbID===selectedId)?.userRating;
  useEffect(function(){
    function handleKeyDown(e){
        if(e.code==='Escape')
          closeMovie();
    }
    document.addEventListener('keydown',handleKeyDown)
    return function(){
    document.removeEventListener('keydown',handleKeyDown)
    }
    
  },[closeMovie]);
  useEffect(function(){
    if(!movieDetails?.Title) return;
    document.title=`Movie:${movieDetails?.Title}`;
    return function(){
      document.title='Use Popcorn'
    }
  },[movieDetails?.Title])
  function handleCloseMovie(){
setMovieDetails(null);
  }
  if(!movieDetails) return
 return <div className="details">
{isLoading ? <Loader />:<>
    <header>
      <button className="btn-back" onClick={handleCloseMovie}>&larr;</button>
      <img src={movieDetails?.Poster} alt={movieDetails?.Title} />
      <div className="details-overview">
        <h2>{movieDetails?.Title}</h2>
        <p>{movieDetails?.Released} &bull; {movieDetails?.Runtime}</p>
        <p>{movieDetails?.Genre}</p>
        <p><span>⭐</span>{movieDetails?.imdbRating}</p>

      </div>
    </header>
    <section>
    <div className="rating">
 {!isWatched ?<>     
<Stars starNum="10" color="yellow" key={movieDetails?.imdbID} onSetUserStars={setUserRating}/>
{userRating>0&&<button className="btn-add" onClick={()=>handleWatchedMovies(movieDetails,userRating)}>+ Add to watched list</button>}</>:<p>You have rated this movie {rating}</p>}
</div>
      <p><em>{movieDetails?.Plot}</em></p>
      <p> Starting {movieDetails?.Actors}</p>
      <p>Directors {movieDetails?.Director}</p>
    </section>
    </>}
  </div>
}
function NavBar({children}){
  return <nav className="nav-bar" >  
 
  {children}
  </nav>
}
//-----loader component-------
function Loader(){
  return <p className="loader">Loading...</p>
}
//-------Error message component-------
function ErrorMessage({message}){
  return <p className="error">:( {message}</p> 
}
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
//-------LOGO JSX-------------------------
function Logo(){
  return <div className="logo">
  <span role="img">🍿</span>
  <h1>usePopcorn</h1>
</div>
}
//-----------INPUT MOVIE JSX--------------------
function InputText({query,setQuery}){
  
  return <input
  className="search"
  type="text"
  placeholder="Search movies..."
  value={query}
  onChange={(e) => setQuery(e.target.value)}
/>
}
//---------------RESULTS COMPONENT----------------------
function ResultsComponent({movies}){
  return movies && <p className="num-results">
  Found <strong>{movies.length}</strong> results
</p>
}
//--------------------MOVIE LIST JSX(LEFT)--------------------------------
function Box({children}){
 
  const [isOpen1, setIsOpen1] = useState(true);
  return  <div className="box">
  <button
    className="btn-toggle"
    onClick={() => setIsOpen1((open) => !open)}
  >
    {isOpen1 ? "–" : "+"}
  </button>
  {isOpen1 && ( children
    
  )}
</div>
}
//----------------MOVIE LIST ITEM-------------------
function MovieListItem({movies,handleSetSelectedId}){
  return <ul className="list">
  {movies?.map((movie) => (
   <MoviesItem movie={movie} handleSetSelectedId={handleSetSelectedId} />
  ))}
</ul>
}
//------------------EACH MOVIE ITEM------------------------
function MoviesItem({movie ,handleSetSelectedId}){
  return  <li key={movie.imdbID} onClick={()=>handleSetSelectedId(movie.imdbID)}>
  <img src={movie.Poster} alt={`${movie.Title} poster`} />
  <h3>{movie.Title}</h3>
  <div>
    <p>
      <span>🗓</span>
      <span>{movie.Year}</span>
    </p>
  </div>
</li>
}
//------------------WATCHED MOVIE LIST--------------------------
// function WatchedMovieList(){
//   
 
//   const [isOpen2, setIsOpen2] = useState(true);

  
//   return <div className="box">
//   <button
//     className="btn-toggle"
//     onClick={() => setIsOpen2((open) => !open)}
//   >
//     {isOpen2 ? "–" : "+"}
//   </button>
//   {isOpen2 && (
//     <>
//       <MoviesSummary watched={watched} />

//       <ul className="list">
//         {watched.map((movie) => (
//           <WatchedMovieListItem movie={movie} />
//         ))}
//       </ul>
//     </>
//   )}
// </div>
// }
//-----------MOVIES SUMMARY---------------------------
function MoviesSummary({watched}){
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) =>Number(movie?.Runtime?.split(' ').at(0))));
  return <div className="summary">
  <h2>Movies you watched</h2>
  <div>
    <p>
      <span>#️⃣</span>
      <span>{watched.length} movies</span>
    </p>
    <p>
      <span>⭐️</span>
      <span>{avgImdbRating}</span>
    </p>
    <p>
      <span>🌟</span>
      <span>{avgUserRating}</span>
    </p>
    <p>
      <span>⏳</span>
      <span>{avgRuntime} min</span>
    </p>
  </div>
</div>
}
//------------WATCHED MOVIE LIST---------------------------------
function WatchedMovieList({watched,userRating,deleteMovie}){
 return <ul className="list">
       {watched.map((movie) => (
          <li key={movie.imdbID}>
  <img src={movie.Poster} alt={`${movie.Title} poster`} />
  <h3>{movie.Title}</h3>
  <div>
    <p>
      <span>⭐️</span>
      <span>{movie.imdbRating}</span>
    </p>
    <p>
      <span>🌟</span>
      <span>{movie.userRating}</span>
    </p>
    <p>
      <span>⏳</span>
      <span>{movie.Runtime}</span>
    </p>
    <button className="btn-delete" onClick={()=>deleteMovie(movie.imdbID)} >X</button>
  </div>
</li>
         ))}
       </ul>
}

