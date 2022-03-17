import { Sudoku, Difficulty } from '../classes';
import { Position } from '../components/GridCell/GridCell';

export type GameState = {
  sudoku: Sudoku;
  showHints: boolean;
  selectedCell: Position | null;
  timer: {
    isRunning: boolean;
    time: number;
  };
};

export enum Action {
  INIT_GAME,
  FINISH_GAME,
  TOGGLE_HINTS,
  SELECT_CELL,
  DESELECT_CELLS,
  SET_NUMBER,
  ERASE_NUMBER,
  CLEAR_CELLS,
  CLEAR_GRID,
  TIMER_TICK,
}

type ReducerAction =
  | { type: Action.INIT_GAME; difficulty: Difficulty }
  | { type: Action.FINISH_GAME }
  | { type: Action.TOGGLE_HINTS }
  | { type: Action.SELECT_CELL; selectedCell: Position }
  | { type: Action.DESELECT_CELLS }
  | { type: Action.SET_NUMBER; number: number }
  | { type: Action.ERASE_NUMBER; selectedCell: Position }
  | { type: Action.CLEAR_CELLS }
  | { type: Action.CLEAR_GRID }
  | { type: Action.TIMER_TICK };

const GameReducer = (state: GameState, action: ReducerAction) => {
  const range = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const rangeShort = [0, 1, 2];

  switch (action.type) {
    case Action.INIT_GAME:
      state.sudoku.generate(action.difficulty);
      state.timer.time = 0;
      state.timer.isRunning = true;

      return { ...state };

    case Action.FINISH_GAME:
      state.timer.isRunning = false;

      return { ...state };

    case Action.TOGGLE_HINTS:
      return {
        ...state,
        showHints: !state.showHints,
      };

    case Action.SELECT_CELL:
      return {
        ...state,
        selectedCell: action.selectedCell,
      };

    case Action.DESELECT_CELLS:
      return {
        ...state,
        selectedCell: null,
      };

    case Action.SET_NUMBER:
      const cell: Position = state.selectedCell as Position;

      state.sudoku.grid[cell.y][cell.x] = action.number;

      return {
        ...state,
        selectedCell: null,
      };

    case Action.ERASE_NUMBER:
      const pos: Position = action.selectedCell;

      state.sudoku.grid[pos.y][pos.x] = 0;

      return {
        ...state,
        selectedCell: null,
      };

    case Action.CLEAR_CELLS:
      state.sudoku.clearGrid();
      return { ...state, selectedCell: null };

    case Action.CLEAR_GRID:
      return {
        ...state,
        fixedCells: [],
        showHints: false,
        selectedCell: null,
        timer: {
          isRunning: false,
          time: 0,
        },
      };

    case Action.TIMER_TICK:
      return {
        ...state,
        timer: {
          ...state.timer,
          time: state.timer.time + 1,
        },
      };

    default:
      return state;
  }
};

export default GameReducer;
