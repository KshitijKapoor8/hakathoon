import logo from './logo.svg';
import './App.css';
/*
global chrome
*/


function App() {
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
        {
          chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
            console.log(tabs[0].url);
          })
        };
        
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
