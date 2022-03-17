import { Link } from 'react-router-dom';
import { Difficulty } from '../classes';
import Button from '../components/Button';
import GameLogic from '../utils/GameLogic';

const MainMenu = () => {
  const { startNewGame } = GameLogic();

  return (
    <div id="main-menu">
      <header>
        SUDOKU <span>v1.0b</span>
      </header>
      <label>Select difficulty</label>
      <Link to="/game" onClick={() => startNewGame(Difficulty.EASY)}>
        <Button label="EASY" />
      </Link>
      <Link to="/game" onClick={() => startNewGame(Difficulty.MEDIUM)}>
        <Button label="MEDIUM" />
      </Link>
      <Link to="/game" onClick={() => startNewGame(Difficulty.HARD)}>
        <Button label="HARD" />
      </Link>
      <Link to="/game" onClick={() => startNewGame(Difficulty.EVIL)}>
        <Button label="EVIL" />
      </Link>
    </div>
  );
};

export default MainMenu;
