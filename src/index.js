import ReactDOM from 'react-dom/client';
import React from 'react';
import './index.css';
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
// function Test(){
//   const [userStars,setUserStars]=useState(0);
//    return <div> 
//    <Stars color='magenta' starNum='4' onSetUserStars={setUserStars} />
//    <p>User has given {userStars} stars to the component</p>
//    </div>
// }
root.render(
  <React.StrictMode>
    <App />
    {/* <Stars starNum={5} color='#fee419' size='48px' messages={['Terriable','Bad','Good','Nice','Excellent'] } defaultRating={"4"} />
    <Stars starNum={'5'} />
    <Test /> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

