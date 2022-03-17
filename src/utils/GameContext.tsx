import React, { createContext, useReducer } from 'react';
import { Sudoku } from '../classes';
import GameReducer, { GameState } from './GameReducer';

const initialState: GameState = {
  sudoku: new Sudoku(),
  showHints: false,
  selectedCell: null,
  timer: {
    isRunning: false,
    time: 0,
  },
};

interface GameContextInterface {
  state: GameState;
  dispatch: React.Dispatch<any>;
}

const GameContext = createContext<GameContextInterface>({
  state: initialState,
  dispatch: () => null,
});

const GameContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(GameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export { GameContext, GameContextProvider };
