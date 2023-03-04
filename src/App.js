/*global chrome*/
import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';


function App() {
  const [currentURL, setCurrentURL] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [score, setScore] = useState(0);
  const [name, setName] = useState(""); 

  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    setCurrentURL(tabs[0].url);
    console.log(currentURL)
  });

  

  useEffect(() => {
    if(currentURL.includes("amazon")) {
      axios.get('http://localhost:5000/products/')
      .then(response => {
          for(var i = 0; i<response.length; i++) {
            if(response[i].link == currentURL) {
              setIngredients(response[i].ingredients);
              setScore(response[i].score);
              setName(response[i].name);
              break;
            }
          }
          // console.log(name + "\n" + ingredients);
        }
      ).catch((error) => {
        console.log("hje")
        console.log(error);
      })

      if(ingredients.length == 0) {
        axios.post('http://localhost:5000/products/add', {params: {link: currentURL}})
        .then(response => {
            setIngredients(response.ingredients);
            setScore(response.score);
            setName(response.name);
            console.log(name + "\n" + ingredients);
          }).catch((error) => {
            console.log("hje")
            console.log(error);
          })
      }
    } else {
      // console.log("not amazon");
    }
  },[currentURL]);

  let goodIngredients = ["a", "b"];
  let badIngredients = ["formaldehyde", "idk"];
  for(var i = 0; i<badIngredients.length; i++)
  {
    badIngredients[i] = "x " + badIngredients[i];
  }

  return (
    <div className="App">
     <div className="App-name">
      nectar
     </div>
     <div className = "App-bear-hover">
      <img className = "App-bear-image" src = "greenbear.PNG" alt = "bear"/>
      <div className>
        83/100
      </div>
     </div>
      <body>
        <ul className = 'App-display-good'>
          {goodIngredients.map((value, index) => {
          return <li key={index}>{value}</li>
        })}
        </ul>

        <ul className = 'App-display-bad'>
          {badIngredients.map((value, index) => {
          return <li key={index}>{value}</li>
        })}
        </ul>
      

      </body>
       
    </div>

  );
}
export default App;
