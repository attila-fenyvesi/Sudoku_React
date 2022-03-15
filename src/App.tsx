import Footer from './components/Footer';
import Grid from './components/Grid';
import { GameContextProvider } from './utils/GameContext';

function App() {
  return (
    <GameContextProvider>
      <div id="ruler">
        <div id="app-wrapper">
          <div id="app">
            <Grid />
            <Footer />
          </div>
        </div>
      </div>
    </GameContextProvider>
  );
}

export default App;
