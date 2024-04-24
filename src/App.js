import logo from './logo.svg';
import './App.css';
import EmailClient from './components/emailBody';
import NavigationBar from './components/navBar';

function App() {
 
  return (
   
    <div className="App">
         <NavigationBar/>
         <br/>
         <br/>
          <EmailClient/>
    </div>
  );
}

export default App;
