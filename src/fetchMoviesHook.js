import { useEffect,useState } from "react";
export function useMovies(query){
     const [movies, setMovies] = useState([]);
      const [errorMessage,setErrorMessage]=useState('');
      const [isLoading,setIsLoading]=useState(false);
      const KEY='701c42da'
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
    return {movies,errorMessage,isLoading,setMovies,setErrorMessage,setIsLoading}
}