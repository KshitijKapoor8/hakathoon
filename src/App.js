/*global chrome*/
import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

var currentURL;
function App() {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    currentURL = tabs[0].url;
  });
  return (
    <div className="App">
     <div className="App-name">
      nectar
     </div>
     <div className = "App-bear-hover">
      <img className = "App-bear-image" src = "yellowbear.PNG" alt = "bear"/>
      <div className>
        {
          chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
            console.log(tabs[0].url);
          })
        };
        
      </div>
     </div>
      <body className='App-body'>
        const goodIngredients = ["water", "vitaminc"];
        const badIngredients = ["formaldehyde, idk"];
      </body>
       
    </div>

  );
}
export default App;
