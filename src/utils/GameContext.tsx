import React, { createContext, useReducer } from 'react';
import GameReducer, { GameState } from './GameReducer';

const initialState: GameState = {
  grid: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  fixedCells: [],
  showHints: false,
  selectedCell: null,
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
