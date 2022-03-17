import { useContext } from 'react';
import GameLogic from '../../utils/GameLogic';
import { GameContext } from '../../utils/GameContext';
import Button from '../Button';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { state } = useContext(GameContext);
  const { toggleHints, clear } = GameLogic();

  return (
    <div id="footer">
      <Button
        label={state.showHints ? 'HIDE HINTS' : 'SHOW HINTS'}
        classes={state.showHints ? 'button btn-on' : 'button'}
        onClick={toggleHints}
      />

      <Link to="/">
        <Button label="MAIN MENU" />
      </Link>

      <Button label="CLEAR CELLS" onClick={clear} />
    </div>
  );
};

export default Footer;
