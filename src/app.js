import logo from './logo.svg';
import './app.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <img src={logo} className="app-logo" alt="logo" />
        <p>
          I can't believe it's not butter.
        </p>
      </header>
    </div>
  );
}

export default App;
