/*global chrome*/
import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';



function App() {
  const [currentURL, setCurrentURL] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [name, setName] = useState("");
  const [flags, setFlags] = useState([]);
  const [bearState, setBearState] = useState(0.0);
  
  function bearPic() {
    if(bearState == 0) {
      return <img className = "App-bear-image" src = "greybear.PNG" alt = "bear"/>
    } else if(bearState <= 1) {
      return <img className = "App-bear-image" src = "redbear.PNG" alt = "bear"/>
    } else if(bearState <= 2) {
      return <img className = "App-bear-image" src = "orangebear.PNG" alt = "bear"/>
    } else if(bearState < 3.6) {
      return <img className = "App-bear-image" src = "yellowbear.PNG" alt = "bear"/>
    } else if(bearState <= 4) {
      return <img className = "App-bear-image" src = "greenbear.PNG" alt = "bear"/>
    }
  }

    function sustainTitle() {
      if(bearState == 0) {
        return <div className = "App-sustain-title">not enough data</div>
      } else if(bearState <= 1) {
        return  <div className = "App-sustain-title">this looks dangerous</div>
      } else if(bearState <= 2) {
        return  <div className = "App-sustain-title">i don't like this</div>
      } else if(bearState < 3.6) {
        return  <div className = "App-sustain-title">kinda sus?</div>
      } else if(bearState <= 4) {
        return  <div className = "App-sustain-title">i love this!</div>
      }
    }


  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    setCurrentURL(tabs[0].url);
    console.log(currentURL)
  });

  

  useEffect(() => {
    var ifFound = false;
    if(currentURL.includes("amazon")) {
      axios.get('http://localhost:5000/products/')
      .then(response => {
        // console.log(response)
          for(var i = 0; i<response.data.length; i++) {
            // console.log(response.data[i].link)
            if(response.data[i].link == currentURL) {
              ifFound = true;
              setIngredients(response.data[i].ingredients);
              setBearState(response.data[i].score);
              setName(response.data[i].name);
              setFlags(response.data[i].flags);
              break;
            }
          }
          // console.log(name + "\n" + ingredients);

          if (!ifFound) {
            axios.post('http://localhost:5000/products/add', {link: currentURL})
            .then(response => {
                setIngredients(response.ingredients);
                setBearState(response.score);
                setName(response.name);
                setFlags(response.flags);
              }).catch((error) => {
                console.log("post")
                console.log(error);
              })
          }
        }
      ).catch((error) => {
        console.log("get")
        console.log(error);
      })

      
    } else {
      // console.log("not amazon");
    }
  },[currentURL]);

  let goodIngredients = ["water", "baseball"];
  let badIngredients = ["formaldehyde", "idk"];
  for(var i = 0; i<badIngredients.length; i++)
  {
    if(badIngredients[i].length > 5)
    {
      badIngredients[i] = "x " + badIngredients[i].substring(0,6) + "...";
    }
    else
    {
      badIngredients[i] = "x " + badIngredients[i];
    }
  }
  for(var i = 0; i<goodIngredients.length; i++)
  {
    if(goodIngredients[i].length > 5)
    {
      goodIngredients[i] = '✓ ' + goodIngredients[i].substring(0,6) + "...";
    }
    else
    {
      goodIngredients[i] = '✓ ' + goodIngredients[i];
    }
  }

  return (
    <div className="App">
     <div className="App-name">
      nectar
     </div>
     <div className = 'App-sustain-title'>
      {sustainTitle()}
      </div>
     <div className = "App-bear-hover">
      {bearPic()}
      <div className>
        {bearState * 25}% bear-friendly.
      </div>
     </div>
     <nav className = "navigation">
        <div className='App-good'>
        <ul className = 'App-display-good'>
          {goodIngredients.map((value, index) => {
          return <li key={index}>{value}</li>
        })}
        </ul> 
        </div>
        <div class = 'App-bad'>
        <ul className = 'App-display-bad'>
          {badIngredients.map((value, index) => {
          return <li key={index}>{value}</li>
        })}
        </ul>
        </div> 
      </nav>
    </div>

  );
}
export default App;
