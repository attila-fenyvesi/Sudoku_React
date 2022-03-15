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

    let x_checked = -1;
    let y_checked = -1;

    for (let _ of range(15)) {
      registeredNumbers.clear();
      const rowProcess = _ % 2 === 0;

      if (rowProcess) y_checked++;
      else x_checked++;

      let x_checking = x_checked;
      let y_checking = y_checked;

      for (let i of range9) {
        if (rowProcess) x_checking = i;
        else y_checking = i;

        if (registeredNumbers.has(newGrid[y_checking][x_checking])) {
          const result = BAS(
            newGrid,
            registeredNumbers,
            { x: x_checking, y: y_checking },
            { x: x_checked, y: y_checked },
            rowProcess
          );

          // if (!result) {
          //   console.log('BAS 1 failed');

          //   const prevIdx = registeredNumbers.get(
          //     newGrid[y_checking][x_checking]
          //   );

          //   let x_prev = x_checking;
          //   let y_prev = y_checking;

          //   if (rowProcess) x_prev = prevIdx as number;
          //   else y_prev = prevIdx as number;

          //   // let result = BAS(
          //   //   newGrid,
          //   //   registeredNumbers,
          //   //   { x: x_prev, y: y_prev },
          //   //   { x: x_checked, y: y_checked },
          //   //   rowProcess
          //   // );
          //   // if (!result) {
          //   //   console.log('BAS 2 failed');
          //   //   console.log(
          //   //     { x: x_checked, y: y_checked },
          //   //     { x: x_prev, y: y_prev }
          //   //   );

          //   //   // result = PAS(
          //   //   //   newGrid,
          //   //   //   registeredNumbers,
          //   //   //   { x: x_prev, y: x_prev },
          //   //   //   rowProcess
          //   //   // );
          //   //   // if (!result) {
          //   //   //   console.log('PAS failed');
          //   //   // }
          //   // }
          // }
        } else {
          registeredNumbers.set(
            newGrid[y_checking][x_checking],
            rowProcess ? x_checking : y_checking
          );
        }
      }
    }

    dispatch({
      type: Action.INIT_GAME,
      newGrid: newGrid,
    });
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
            // console.log('Swap 2');
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
          // console.log('Swap 1');
          swapNumbers(grid, current, target);
          registeredNumbers.set(
            grid[current.y][current.x],
            rowProcess ? current.x : current.y
          );
          return true;
        }
      }
    }

    return false;
  };

  const PAS = (
    grid: number[][],
    registeredNumbers: Map<number, number>,
    startPos: Position,
    rowProcess: boolean
  ) => {
    // if (
    //   (rowProcess && (startPos.y === 2 || startPos.y === 5)) ||
    //   (!rowProcess && (startPos.x === 2 || startPos.x === 5))
    // ) {
    //   console.log('Edge');
    //   return false;
    // } else {

    const current = { ...startPos };

    for (let _ = 0; _ < 18; ++_) {
      const target = { ...current };
      if (rowProcess) target.y++;
      else target.x++;

      console.log(logObj(grid));
      console.log(
        rowProcess,
        current,
        grid[current.y][current.x],
        target,
        grid[target.y][target.x]
      );
      logMap(registeredNumbers);

      const targetValue = grid[target.y][target.x];
      let idx = registeredNumbers.get(targetValue);

      registeredNumbers.delete(grid[current.y][current.x]);
      registeredNumbers.set(targetValue, rowProcess ? target.x : target.y);
      swapNumbers(grid, current, target);

      logMap(registeredNumbers);

      if (idx === undefined) return true;

      if (rowProcess) current.x = idx;
      else current.y = idx;
    }
    // }

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
