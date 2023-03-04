import logo from './logo.svg';
import './App.css';
/*
global chrome
*/


function App() {
  let goodIngredients = ["water", "nectar","pollen"];
  let badIngredients = ["formaldehyde", "suflate","pthalate"];
  // modifies the ingredients so that they fit well on the screen
  for(var i = 0; i<badIngredients.length; i++)
  {
    if(badIngredients[i].length > 6)
    {
      badIngredients[i] = "x " + badIngredients[i].substring(0,7) + "...";
    }
    else
    {
      badIngredients[i] = "x " + badIngredients[i];
    }
  }
  for(var i = 0; i<goodIngredients.length; i++)
  {
    if(goodIngredients[i].length > 6)
    {
      goodIngredients[i] = '✓ ' + goodIngredients[i].substring(0,7) + "...";
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
     <div className = "App-bear-hover">
      <img className = "App-bear-image" src = "greenbear.PNG" alt = "bear"/>
      <div className>
        {
          chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
            console.log(tabs[0].url);
          })
        };
        
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
