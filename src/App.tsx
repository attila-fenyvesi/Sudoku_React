import { Route, Routes } from 'react-router-dom';
import { Game, MainMenu } from './routes';
import { GameContextProvider } from './utils/GameContext';

function App() {
  return (
    <div id="ruler">
      <div id="app-wrapper">
        <div id="app">
          <GameContextProvider>
            <Routes>
              <Route path="/" element={<MainMenu />} />
              <Route path="/game" element={<Game />} />
            </Routes>
          </GameContextProvider>
        </div>
      </div>
    </div>
  );
}

export default App;
