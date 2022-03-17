import { useContext } from 'react';
import { GameContext } from './GameContext';
import { Action } from './GameReducer';
import { Position } from '../components/GridCell';
import { compPositions, range } from './Helpers';
import { Difficulty } from '../classes';

const GameLogic = () => {
  const { state, dispatch } = useContext(GameContext);

  const toggleHints = () => {
    dispatch({
      type: Action.TOGGLE_HINTS,
    });
  };

  const startNewGame = (difficulty: Difficulty) => {
    dispatch({
      type: Action.INIT_GAME,
      difficulty: difficulty,
    });
  };

  const selectCell = (position: Position) => {
    if (state.sudoku.mask[position.y][position.x] === 1) return;

    if (compPositions(state.selectedCell, position)) {
      dispatch({
        type: Action.DESELECT_CELLS,
      });
    } else {
      dispatch({
        type: Action.SELECT_CELL,
        selectedCell: position,
      });
    }
  };

  const setNumber = (key: string) => {
    dispatch({
      type: Action.SET_NUMBER,
      number: Number(key),
    });

    if (isGridFilled())
      if (state.sudoku.isGridUnique(true)) {
        dispatch({
          type: Action.FINISH_GAME,
        });
        const time = state.timer.time;
        const minutes = String(Math.floor(time / 60)).padStart(2, '0');
        const seconds = String(time % 60).padStart(2, '0');
        alert(
          `Congratulations! You've solved the puzzle in ${minutes}:${seconds}`
        );
      } else {
        alert("Something isn't right. The grid is not unique!");
      }
  };

  const eraseNumber = (position: Position) => {
    if (state.sudoku.mask[position.y][position.x] === 1) return;

    dispatch({
      type: Action.ERASE_NUMBER,
      selectedCell: position,
    });
  };

  const clear = () => {
    dispatch({
      type: Action.CLEAR_CELLS,
    });
  };

  const availableNumberInRow = (position: Position) => {
    let numbers: Set<number> = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (let i = 0; i < 9; ++i) {
      numbers.delete(state.sudoku.grid[position.y][i]);
    }

    return numbers;
  };

  const availableNumberInColumn = (position: Position) => {
    let numbers: Set<number> = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (let i = 0; i < 9; ++i) {
      numbers.delete(state.sudoku.grid[i][position.x]);
    }

    return numbers;
  };

  const availableNumberInGridBlock = (position: Position) => {
    let numbers: Set<number> = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    const blockFirstCell = {
      x: Math.floor(position.x / 3) * 3,
      y: Math.floor(position.y / 3) * 3,
    };

    for (let y = blockFirstCell.y; y < blockFirstCell.y + 3; ++y) {
      for (let x = blockFirstCell.x; x < blockFirstCell.x + 3; ++x) {
        numbers.delete(state.sudoku.grid[y][x]);
      }
    }

    return numbers;
  };

  const availableNumbers = (position: Position) => {
    const row: Set<number> = availableNumberInRow(position);
    const column: Set<number> = availableNumberInColumn(position);
    const block: Set<number> = availableNumberInGridBlock(position);

    const rowColIntersect: number[] = [...row].filter((value) =>
      column.has(value)
    );

    return rowColIntersect.filter((value) => block.has(value));
  };

  const isGridFilled = (): boolean => {
    for (let y of range(8)) {
      for (let x of range(8)) {
        if (state.sudoku.grid[y][x] === 0) return false;
      }
    }
    return true;
  };

  return {
    startNewGame,
    toggleHints,
    selectCell,
    setNumber,
    eraseNumber,
    clear,
    availableNumberInGridBlock,
    availableNumbers,
  } as {
    startNewGame: (difficulty: Difficulty) => void;
    toggleHints: () => void;
    selectCell: (position: Position) => void;
    setNumber: (key: string) => void;
    eraseNumber: (position: Position) => void;
    clear: () => void;
    availableNumberInGridBlock: (position: Position) => Set<number>;
    availableNumbers: (position: Position) => number[];
  };
};

export default GameLogic;
