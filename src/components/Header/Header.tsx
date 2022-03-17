import { useEffect, useRef } from 'react';
import { useContext } from 'react';
import { GameContext } from '../../utils/GameContext';
import { Action } from '../../utils/GameReducer';

const Header = () => {
  const { state, dispatch } = useContext(GameContext);
  const timerRef: { current: NodeJS.Timeout | null } = useRef(null);

  useEffect(() => {
    if (!state.timer.isRunning) {
      return;
    }

    timerRef.current = setInterval(
      () => dispatch({ type: Action.TIMER_TICK }),
      1000
    );

    return () => {
      clearInterval(timerRef.current as NodeJS.Timeout);
      timerRef.current = null;
    };
  }, [state.timer.isRunning]);

  return (
    <header id="game-header">
      <span>Time: </span>
      <span>
        {String(Math.floor(state.timer.time / 60)).padStart(2, '0')}:
        {String(state.timer.time % 60).padStart(2, '0')}
      </span>
    </header>
  );
};

export default Header;
