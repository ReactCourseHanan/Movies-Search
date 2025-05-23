import { useEffect, useRef, useState } from "react";
import Stars from './starsComponent.js';
import { useMovies } from "./fetchMoviesHook.js";
import { useLocalStorage } from "./useLocalStorageHook.js";
import { useEventListner } from "./useEventListnerHook.js";


//----------------MAIN COMPONENT JSX---------------------------
function Main({children}){
  return  <main className="main">
{children}

</main>
}
const KEY='701c42da'
export default function App() {
  const [query, setQuery] = useState("");
  const [isNewMovieDetailsLoaded,setisNewMovieDetailsLoaded]=useState(false);
  const [selectedId,setSelectedId]=useState(null);
  const [movieDetails,setMovieDetails]=useState(null);
  const [userRating,setUserRating]=useState(null);
  const [watched, setWatched] = useLocalStorage([],'watched')

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
  // localStorage.setItem('watched',JSON.stringify([...watched,newMovie]));
  setSelectedId(null);
 }
//  useEffect(function(){
//   localStorage.setItem('watched',JSON.stringify([...watched]));
//  },[watched])
 const {movies,errorMessage,isLoading}=useMovies(query);
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
  const ratingsChanged=useRef(0);
  useEffect(function(){
   if(userRating) ratingsChanged.current++;
   
  },[userRating])
  movieDetails.ratingsChanged=ratingsChanged.current-1;
  useEventListner("escape",closeMovie);
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
  const ref=useRef(null);
  function active(ref){
    if(document.activeElement===ref?.current) return;
    ref?.current?.focus();
    setQuery('');
  }
  useEventListner("enter",active)
  // useEffect(function(){
  //   function callbackfn(e){
  //     if(e.code==="Enter"){
  //       if(document.activeElement===ref.current) return;
  //       ref.current.focus();
  //       setQuery('')
  //     }
  //   }
  //   document.addEventListener('keydown',callbackfn)
    
  // },[setQuery])
  return <input
  className="search"
  type="text"
  placeholder="Search movies..."
  ref={ref}
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

