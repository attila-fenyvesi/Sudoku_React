import { Position } from '../components/GridCell/GridCell';
import { checkPosInArray } from './Helpers';

export type GameState = {
  grid: number[][];
  fixedCells: Position[];
  showHints: boolean;
  selectedCell: Position | null;
};

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

export enum Action {
  INIT_GAME,
  TOGGLE_HINTS,
  SELECT_CELL,
  DESELECT_CELLS,
  SET_NUMBER,
  ERASE_NUMBER,
  CLEAR_CELLS,
  CLEAR_GRID,
}

type ReducerAction =
  | { type: Action.INIT_GAME; newGrid: number[][] }
  | { type: Action.TOGGLE_HINTS }
  | { type: Action.SELECT_CELL; selectedCell: Position }
  | { type: Action.DESELECT_CELLS }
  | { type: Action.SET_NUMBER; number: number }
  | { type: Action.ERASE_NUMBER; selectedCell: Position }
  | { type: Action.CLEAR_CELLS }
  | { type: Action.CLEAR_GRID };

const GameReducer = (state: GameState, action: ReducerAction) => {
  const range = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const rangeShort = [0, 1, 2];

  switch (action.type) {
    case Action.INIT_GAME:
      state.grid = action.newGrid;

      // for (let y = 0; y < 9; ++y) {
      //   for (let x = 0; x < 9; ++x) {
      //     if (state.grid[y][x] > 0) {
      //       state.fixedCells.push({ x: x, y: y });
      //     }
      //   }
      // }

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

      state.grid[cell.y][cell.x] = action.number;

      return {
        ...state,
        selectedCell: null,
      };

    case Action.ERASE_NUMBER:
      const pos: Position = action.selectedCell;

      state.grid[pos.y][pos.x] = 0;

      return {
        ...state,
        selectedCell: null,
      };

    case Action.CLEAR_CELLS:
      for (let y of range) {
        for (let x of range) {
          if (checkPosInArray({ x: x, y: y }, state.fixedCells)) continue;
          state.grid[y][x] = 0;
        }
      }

      return { ...state, selectedCell: null };

    case Action.CLEAR_GRID:
      return {
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

    default:
      return state;
  }
};

export default GameReducer;
