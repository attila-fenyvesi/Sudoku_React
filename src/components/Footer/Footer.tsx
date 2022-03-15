import React, { useContext } from 'react';
import GameLogic from '../../utils/GameLogic';
import { GameContext } from '../../utils/GameContext';

const Footer = () => {
  const { state } = useContext(GameContext);
  const { startNewGame, toggleHints, clear } = GameLogic();

  return (
    <div id="footer">
      <div
        className={state.showHints ? 'button btn-on' : 'button'}
        onClick={toggleHints}
      >
        {state.showHints ? 'HIDE HINTS' : 'SHOW HINTS'}
      </div>

      <div className="button" onClick={startNewGame}>
        NEW GAME
      </div>

      <div className="button" onClick={clear}>
        CLEAR CELLS
      </div>
    </div>
  );
};

export default Footer;
