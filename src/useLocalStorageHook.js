import { useState,useEffect } from "react";

export function useLocalStorage(initialState,key){
    const [value,setValue]=useState(function(){
        const watchedMovies=localStorage.getItem(key);
        console.log(watchedMovies)
        return watchedMovies? JSON.parse(watchedMovies) :initialState;
        
    })
    useEffect(function(){
      localStorage.setItem(key,JSON.stringify([...value]));
     },[value,key])
     return [value,setValue];
}