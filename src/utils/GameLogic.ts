import { useContext } from 'react';
import { GameContext } from './GameContext';
import { Action } from './GameReducer';
import { Position } from '../components/GridCell';
import {
  checkPosInArray,
  compPositions,
  logMap,
  logObj,
  range,
  shuffle,
} from './Helpers';
import { trace } from 'console';

const GameLogic = () => {
  const { state, dispatch } = useContext(GameContext);

  const toggleHints = () => {
    dispatch({
      type: Action.TOGGLE_HINTS,
    });
  };

  const startNewGame = () => {
    dispatch({
      type: Action.CLEAR_GRID,
    });

    const range3 = [0, 1, 2];
    const range9 = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    const newGrid = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    for (let grid_y of range3) {
      for (let grid_x of range3) {
        let numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (let y of range3) {
          for (let x of range3) {
            newGrid[grid_y * 3 + y][grid_x * 3 + x] = numbers.pop();
          }
        }
      }
    }

    const registeredNumbers = new Map<number, number>();

    const checked: Position = {
      x: -1,
      y: -1,
    };

    // for (let _ of range(15)) {
    for (let _ = 0; _ <= 15; ++_) {
      registeredNumbers.clear();
      const rowProcess = _ % 2 === 0;

      if (rowProcess) checked.y++;
      else checked.x++;

      const checking = { ...checked };

      for (let i of range9) {
        if (rowProcess) checking.x = i;
        else checking.y = i;

        if (registeredNumbers.has(newGrid[checking.y][checking.x])) {
          const result = BAS(
            newGrid,
            registeredNumbers,
            { x: checking.x, y: checking.y },
            { x: checked.y, y: checked.y },
            rowProcess
          );

          if (!result) {
            const prevIdx = registeredNumbers.get(
              newGrid[checking.y][checking.x]
            );

            const prev = { ...checking };

            if (rowProcess) prev.x = prevIdx as number;
            else prev.y = prevIdx as number;

            registeredNumbers.set(
              newGrid[checking.y][checking.x],
              rowProcess ? checking.x : checking.y
            );

            let result = BAS(
              newGrid,
              registeredNumbers,
              { x: prev.x, y: prev.y },
              { x: checked.x, y: checked.y },
              rowProcess
            );

            if (!result) {
              registeredNumbers.set(
                newGrid[checking.y][checking.x],
                rowProcess ? checking.x : checking.y
              );
            }
          }
        } else {
          registeredNumbers.set(
            newGrid[checking.y][checking.x],
            rowProcess ? checking.x : checking.y
          );
        }
      }

      if (registeredNumbers.size < 9) {
        for (let i of range9) {
          if (rowProcess) checking.x = i;
          else checking.y = i;

          const idx = registeredNumbers.get(newGrid[checking.y][checking.x]);
          if (idx && idx !== i) {
            PAS(newGrid, registeredNumbers, checking, rowProcess);
            break;
          }
        }
      }

      if (_ === 15 && !isGridUnique(newGrid)) {
        _ = -1;
        checked.x = -1;
        checked.y = -1;
      }
    }

    dispatch({
      type: Action.INIT_GAME,
      newGrid: newGrid,
    });

    {
      console.log('');
      console.log('Checking rows:');
      const invalidRows: number[] = [];
      for (let i = 0; i < 9; ++i) {
        if (!isRowUnique(newGrid, i)) invalidRows.push(i);
      }
      console.log(invalidRows);

      console.log('Checking columns:');
      const invalidColumns: number[] = [];
      for (let i = 0; i < 9; ++i) {
        if (!isColumnUnique(newGrid, i)) invalidColumns.push(i);
      }
      console.log(invalidColumns);

      console.log('Checking boxes:');
      const invalidBoxes: Position[] = [];
      for (let y = 0; y < 3; ++y) {
        for (let x = 0; x < 3; ++x) {
          const pos: Position = { x: x, y: y };
          if (!isBoxUnique(newGrid, pos)) invalidBoxes.push(pos);
        }
      }
      console.log(invalidBoxes);
    }
  };

  const BAS = (
    grid: number[][],
    registeredNumbers: Map<number, number>,
    current: Position,
    checked: Position,
    rowProcess: boolean
  ) => {
    if (current.x <= checked.x && current.y <= checked.y) {
      const boxEnd = getBoxStart(current);
      boxEnd.x += 2;
      boxEnd.y += 2;

      const target = { ...current };

      for (let _ of [0, 1]) {
        if (rowProcess) target.y++;
        else target.x++;

        if (boxEnd.x >= target.x && boxEnd.y >= target.y) {
          if (!registeredNumbers.has(grid[target.y][target.x])) {
            // console.log(' --- Swap 2');
            swapNumbers(grid, current, target);
            registeredNumbers.set(
              grid[current.y][current.x],
              rowProcess ? current.x : current.y
            );
            return true;
          }
        }
      }
    } else {
      const swappableCells = getSwappableBoxCells(
        { x: current.x, y: current.y },
        { x: checked.x, y: checked.y }
      );

      for (let target of swappableCells) {
        const targetValue = grid[target.y][target.x];
        if (!registeredNumbers.has(targetValue)) {
          // console.log(' --- Swap 1');
          swapNumbers(grid, current, target);
          registeredNumbers.set(
            grid[current.y][current.x],
            rowProcess ? current.x : current.y
          );
          return true;
        }
      }
    }

    // console.log('%c BAS FAILED ', 'background: black; color: red');
    // console.log(current, rowProcess, grid[current.y][current.x]);

    return false;
  };

  const PAS = (
    grid: number[][],
    registeredNumbers: Map<number, number>,
    startPos: Position,
    rowProcess: boolean
  ) => {
    const current = { ...startPos };

    for (let _ = 0; _ < 18; ++_) {
      const target = { ...current };
      if (rowProcess) target.y++;
      else target.x++;

      const targetValue = grid[target.y][target.x];
      let idx = registeredNumbers.get(targetValue);

      registeredNumbers.set(targetValue, rowProcess ? target.x : target.y);
      swapNumbers(grid, current, target);

      if (idx === undefined) return true;

      if (rowProcess) current.x = idx;
      else current.y = idx;
    }

    console.log('%c PAS FAILED ', 'background: black; color: yellow');

    return false;
  };

  const getSwappableBoxCells = (
    position: Position,
    checked: Position
  ): Position[] => {
    let result: Position[] = [];

    const boxStart = getBoxStart(position);

    const x_min = Math.max(boxStart.x, checked.x + 1);
    const y_min = Math.max(boxStart.y, checked.y + 1);
    const x_max = boxStart.x + 2;
    const y_max = boxStart.y + 2;

    if (x_min > x_max || y_min > y_max) return result;

    for (let y of range(y_min, y_max)) {
      for (let x of range(x_min, x_max)) {
        result.push({ x: x, y: y });
      }
    }

    return result;
  };

  const getBoxStart = (position: Position): Position => {
    const x = Math.floor(position.x / 3) * 3;
    const y = Math.floor(position.y / 3) * 3;
    return { x: x, y: y };
  };

  const swapNumbers = (
    grid: number[][],
    current: Position,
    target: Position
  ) => {
    [grid[target.y][target.x], grid[current.y][current.x]] = [
      grid[current.y][current.x],
      grid[target.y][target.x],
    ];
  };

  const isRowUnique = (grid: number[][], rowIdx: number): boolean => {
    let numbers: Set<number> = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (let number of grid[rowIdx]) numbers.delete(number);

    return numbers.size === 0;
  };

  const isColumnUnique = (grid: number[][], colIdx: number): boolean => {
    let numbers: Set<number> = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (let i = 0; i < 9; ++i) numbers.delete(grid[i][colIdx]);

    return numbers.size === 0;
  };

  const isBoxUnique = (grid: number[][], boxIdx: Position): boolean => {
    let numbers: Set<number> = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (let y = 0; y < 3; ++y) {
      for (let x = 0; x < 3; ++x) {
        numbers.delete(grid[y + boxIdx.y * 3][x + boxIdx.x * 3]);
      }
    }

    return numbers.size === 0;
  };

  const isGridUnique = (grid: number[][]): boolean => {
    for (let i of range(8)) {
      if (
        !isBoxUnique(grid, { x: i % 3, y: Math.floor(i / 3) }) ||
        !isColumnUnique(grid, i) ||
        !isRowUnique(grid, i)
      ) {
        return false;
      }
    }
    return true;
  };

  const selectCell = (position: Position) => {
    if (checkPosInArray(position, state.fixedCells)) return;

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
  };

  const eraseNumber = (position: Position) => {
    if (checkPosInArray(position, state.fixedCells)) return;

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

  const availableNumberInRow = (grid: number[][], position: Position) => {
    let numbers: Set<number> = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (let i = 0; i < 9; ++i) {
      numbers.delete(state.grid[position.y][i]);
    }

    return numbers;
  };

  const availableNumberInColumn = (grid: number[][], position: Position) => {
    let numbers: Set<number> = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (let i = 0; i < 9; ++i) {
      numbers.delete(state.grid[i][position.x]);
    }

    return numbers;
  };

  const availableNumberInGridBlock = (grid: number[][], position: Position) => {
    let numbers: Set<number> = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    const blockFirstCell = {
      x: Math.floor(position.x / 3) * 3,
      y: Math.floor(position.y / 3) * 3,
    };

    for (let y = blockFirstCell.y; y < blockFirstCell.y + 3; ++y) {
      for (let x = blockFirstCell.x; x < blockFirstCell.x + 3; ++x) {
        numbers.delete(grid[y][x]);
      }
    }

    return numbers;
  };

  const availableNumbers = (grid: number[][], position: Position) => {
    const row: Set<number> = availableNumberInRow(grid, position);
    const column: Set<number> = availableNumberInColumn(grid, position);
    const block: Set<number> = availableNumberInGridBlock(grid, position);

    const rowColIntersect: number[] = [...row].filter((value) =>
      column.has(value)
    );

    return rowColIntersect.filter((value) => block.has(value));
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
    startNewGame: () => void;
    toggleHints: () => void;
    selectCell: (position: Position) => void;
    setNumber: (key: string) => void;
    eraseNumber: (position: Position) => void;
    clear: () => void;
    availableNumberInGridBlock: (
      grid: number[][],
      position: Position
    ) => Set<number>;
    availableNumbers: (grid: number[][], position: Position) => number[];
  };
};

export default GameLogic;
