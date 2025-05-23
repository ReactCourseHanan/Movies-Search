import { useEffect } from "react";
export function useEventListner(event,eventFn){
    useEffect(function(){
        function handleKeyDown(e){
            if(e?.code?.toLowerCase()===event?.toLowerCase())
              eventFn();
        }
        document.addEventListener('keydown',handleKeyDown)
        return function(){
        document.removeEventListener('keydown',handleKeyDown)
        }
        
      },[eventFn,event]);
}