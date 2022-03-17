/**
 * Sudoku grid generator and solver (not yet implemented).
 * The generator algorithm is based on the algorithm created by
 * Mark Fredrick Graves, Jr. (https://github.com/mfgravesjr)
 */

import { shuffle, range, randomIntInterval } from '../utils/Helpers';

export enum Difficulty {
  EASY = 4,
  MEDIUM = 3,
  HARD = 2,
  EVIL = 0,
}

type Position = {
  x: number;
  y: number;
};

class Sudoku {
  grid: number[][] = [
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
  mask: number[][] = [
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

  private currentPosition: Position = { x: 0, y: 0 };
  private targetPosition: Position = { x: 0, y: 0 };
  private checkedRowsAndCols: Position = { x: -1, y: -1 };
  private processingRow: boolean = false;
  private registeredNumbers: Map<number, number> = new Map();

  constructor() {}

  clearGrid() {
    this.applyMask();
  }

  generate(difficulty: Difficulty) {
    const range9 = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    this.resetGrid();
    this.fillGridWithRandomNumbers();
    this.registeredNumbers.clear();

    for (let _ = 0; _ <= 15; ++_) {
      this.registeredNumbers.clear();
      this.processingRow = _ % 2 === 0;
      this.setCheckedRowsAndColumns(_);
      this.currentPosition = { ...this.checkedRowsAndCols };

      for (let i of range9) {
        this.setCurrentPosition(i);

        if (this.registeredNumbers.has(this.getCurrentValue())) {
          if (!this.BAS()) {
            const prevIdx = this.registeredNumbers.get(this.getCurrentValue());

            if (prevIdx === undefined) throw 'Number registry is corrupted!';

            this.registerCurrentValue();
            this.setCurrentPosition(prevIdx);
            this.BAS();
          }
        } else {
          this.registerCurrentValue();
        }
      }

      if (this.registeredNumbers.size < 9) {
        for (let i of range9) {
          this.setCurrentPosition(i);
          const idx = this.registeredNumbers.get(this.getCurrentValue());
          if (idx && idx !== i) {
            this.PAS();
            break;
          }
        }
      }

      if (_ === 15 && !this.isGridUnique()) _ = -1;
    }

    const difficultyMap: Map<Difficulty, number> = new Map();
    difficultyMap.set(Difficulty.EASY, 5);
    difficultyMap.set(Difficulty.MEDIUM, 4);
    difficultyMap.set(Difficulty.HARD, 3);

    const scanRowOrCol = (idx: number, isRowScan: boolean): Set<number> => {
      const indexes: Set<number> = new Set();

      for (let i of range9) {
        const x = isRowScan ? i : idx;
        const y = isRowScan ? idx : i;
        if (this.mask[y][x] > 0) indexes.add(i);
      }

      return indexes;
    };

    if (difficulty === Difficulty.EVIL) {
      for (let i of range(25)) {
        const randInt = randomIntInterval(0, 80);
        const x = randInt % 9;
        const y = Math.floor(randInt / 9);
        this.mask[y][x] = 1;
      }
    } else {
      for (let _ of range(17)) {
        const isRowScan = _ % 2 === 0;
        const rowColIdx = Math.floor(_ / 2);
        const scan = scanRowOrCol(rowColIdx, isRowScan);

        const difficultySize = difficultyMap.get(difficulty) as number;
        const optimalScanSize = difficultySize - randomIntInterval(0, 1);
        while (scan.size < optimalScanSize) {
          const randInt = randomIntInterval(0, 8);
          if (!scan.has(randInt)) {
            scan.add(randInt);
          }
        }

        for (let i of scan) {
          const x = isRowScan ? i : rowColIdx;
          const y = isRowScan ? rowColIdx : i;
          this.mask[y][x] = 1;
        }
      }
    }

    this.applyMask();
  }

  private BAS = () => {
    let swappableCells: Position[] = [];

    if (this.isCurrentPosWithinChecked()) {
      swappableCells = this.getSwappableRowColCells();
    } else {
      swappableCells = this.getSwappableBoxCells();
    }

    for (this.targetPosition of swappableCells) {
      if (!this.registeredNumbers.has(this.getTargetValue())) {
        this.swapNumbers();
        this.registerCurrentValue();
        return true;
      }
    }

    return false;
  };

  private PAS = () => {
    for (let _ = 0; _ < 18; ++_) {
      this.targetPosition = { ...this.currentPosition };

      if (this.processingRow) this.targetPosition.y++;
      else this.targetPosition.x++;

      let idx = this.registeredNumbers.get(this.getTargetValue());

      this.registeredNumbers.set(
        this.getTargetValue(),
        this.getTargetCoordinate()
      );
      this.swapNumbers();

      if (idx === undefined) return;

      this.setCurrentPosition(idx);
    }

    console.log('%c PAS FAILED ', 'background: black; color: yellow');
  };

  private fillGridWithRandomNumbers = () => {
    const range3 = [0, 1, 2];

    for (let grid_y of range3) {
      for (let grid_x of range3) {
        let numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (let y of range3) {
          for (let x of range3) {
            this.grid[grid_y * 3 + y][grid_x * 3 + x] = numbers.pop();
          }
        }
      }
    }
  };

  private setCheckedRowsAndColumns = (iterationIndex: number) => {
    this.checkedRowsAndCols.x = Math.ceil(iterationIndex / 2) - 1;
    this.checkedRowsAndCols.y = Math.floor(iterationIndex / 2);
  };

  private setCurrentPosition = (value: number) => {
    if (this.processingRow) {
      this.currentPosition.x = value;
    } else {
      this.currentPosition.y = value;
    }
  };

  private getCurrentValue = (): number => {
    return this.grid[this.currentPosition.y][this.currentPosition.x];
  };

  private getTargetValue = (): number => {
    return this.grid[this.targetPosition.y][this.targetPosition.x];
  };

  private getCurrentCoordinate = (): number => {
    return this.processingRow ? this.currentPosition.x : this.currentPosition.y;
  };

  private getTargetCoordinate = () => {
    return this.processingRow ? this.targetPosition.x : this.targetPosition.y;
  };

  private registerCurrentValue = () => {
    this.registeredNumbers.set(
      this.getCurrentValue(),
      this.getCurrentCoordinate()
    );
  };

  private getBoxStart = (cellPosition: Position): Position => {
    const x = Math.floor(cellPosition.x / 3) * 3;
    const y = Math.floor(cellPosition.y / 3) * 3;
    return { x: x, y: y };
  };

  private getBoxEnd = (cellPosition: Position): Position => {
    const x = Math.floor(cellPosition.x / 3) * 3 + 2;
    const y = Math.floor(cellPosition.y / 3) * 3 + 2;
    return { x: x, y: y };
  };

  private getSwappableBoxCells = (): Position[] => {
    let result: Position[] = [];

    const boxStart = this.getBoxStart(this.currentPosition);
    const boxEnd = this.getBoxEnd(this.currentPosition);

    const x_min = Math.max(boxStart.x, this.checkedRowsAndCols.x + 1);
    const y_min = Math.max(boxStart.y, this.checkedRowsAndCols.y + 1);
    const x_max = boxEnd.x;
    const y_max = boxEnd.y;

    if (x_min > x_max || y_min > y_max) return result;

    for (let y of range(y_min, y_max)) {
      for (let x of range(x_min, x_max)) {
        result.push({ x: x, y: y });
      }
    }

    return result;
  };

  private getSwappableRowColCells = (): Position[] => {
    let result: Position[] = [];

    const boxEnd = this.getBoxEnd(this.currentPosition);

    for (let i of [1, 2]) {
      const coordinate = this.processingRow
        ? {
            ...this.currentPosition,
            y: this.currentPosition.y + i,
          }
        : {
            ...this.currentPosition,
            x: this.currentPosition.x + i,
          };
      if (boxEnd.x >= coordinate.x && boxEnd.y >= coordinate.y) {
        result.push(coordinate);
      }
    }

    return result;
  };

  private isCurrentPosWithinChecked = (): boolean => {
    return (
      this.currentPosition.x <= this.checkedRowsAndCols.x &&
      this.currentPosition.y <= this.checkedRowsAndCols.y
    );
  };

  private swapNumbers = () => {
    [
      this.grid[this.targetPosition.y][this.targetPosition.x],
      this.grid[this.currentPosition.y][this.currentPosition.x],
    ] = [
      this.grid[this.currentPosition.y][this.currentPosition.x],
      this.grid[this.targetPosition.y][this.targetPosition.x],
    ];
  };

  private isRowUnique = (rowIdx: number): boolean => {
    let numbers: Set<number> = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (let number of this.grid[rowIdx]) numbers.delete(number);

    return numbers.size === 0;
  };

  private isColumnUnique = (colIdx: number): boolean => {
    let numbers: Set<number> = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (let i = 0; i < 9; ++i) numbers.delete(this.grid[i][colIdx]);

    return numbers.size === 0;
  };

  private isBoxUnique = (boxIdx: Position): boolean => {
    let numbers: Set<number> = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (let y = 0; y < 3; ++y) {
      for (let x = 0; x < 3; ++x) {
        numbers.delete(this.grid[y + boxIdx.y * 3][x + boxIdx.x * 3]);
      }
    }

    return numbers.size === 0;
  };

  isGridUnique = (printResult: boolean = false): boolean => {
    const invalidRows: number[] = [];
    for (let i of range(8)) {
      if (!this.isRowUnique(i)) {
        invalidRows.push(i);
      }
    }

    const invalidColumns: number[] = [];
    for (let i of range(8)) {
      if (!this.isColumnUnique(i)) {
        invalidColumns.push(i);
      }
    }

    const invalidBoxes: Position[] = [];
    for (let y of [0, 1, 2]) {
      for (let x of [0, 1, 2]) {
        const boxCoordinate: Position = { x: x, y: y };
        if (!this.isBoxUnique(boxCoordinate)) {
          invalidBoxes.push(boxCoordinate);
        }
      }
    }

    if (printResult) {
      console.log('Invalid ROWs:');
      console.log(invalidRows);
      console.log('Invalid COLUMNSs:');
      console.log(invalidColumns);
      console.log('Invalid BOXes:');
      console.log(invalidBoxes);
    }

    return (
      invalidBoxes.length === 0 &&
      invalidColumns.length === 0 &&
      invalidRows.length === 0
    );
  };

  private applyMask = () => {
    for (let y of range(8)) {
      for (let x of range(8)) {
        this.grid[y][x] *= this.mask[y][x];
      }
    }
  };

  private resetGrid = () => {
    for (let y of range(8)) {
      for (let x of range(8)) {
        this.grid[y][x] = 0;
        this.mask[y][x] = 0;
      }
    }
  };
}

export default Sudoku;
