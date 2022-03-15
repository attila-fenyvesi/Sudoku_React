import React, { useContext } from 'react';
import { GameContext } from '../../utils/GameContext';
import GameLogic from '../../utils/GameLogic';
import { checkPosInArray } from '../../utils/Helpers';

export type Position = {
  x: number;
  y: number;
};

const GridCell = (position: Position) => {
  const { state } = useContext(GameContext);
  const { selectCell, eraseNumber, availableNumbers } = GameLogic();

  const value: number = state.grid[position.y][position.x];

  let hints: number[] = [];
  if (state.showHints && value === 0) {
    hints = availableNumbers(state.grid, position);
  }

  const hintElements: any[] = [];
  for (let i = 1; i <= 9; ++i) {
    const visible: boolean = hints.includes(i);
    const className: string = visible ? 'visible' : '';
    const key: string = `hint-${position.y}${position.x}${i}`;
    hintElements.push(
      <div key={key} className={className}>
        {i}
      </div>
    );
  }

  const valueClasses: string[] = ['value cell-content'];
  if (checkPosInArray(position, state.fixedCells)) {
    valueClasses.push('fixed');
  }
  if (
    state.selectedCell &&
    state.selectedCell.x === position.x &&
    state.selectedCell.y === position.y
  ) {
    valueClasses.push('selected');
  }

  const onSelect = () => {
    selectCell(position);
  };

  const onDelete = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    eraseNumber(position);
  };

  return (
    <div className="grid-cell">
      <div className="hint-block cell-content">{hintElements}</div>
      <div
        className={valueClasses.join(' ')}
        onClick={onSelect}
        onContextMenu={onDelete}
      >
        {value === 0 ? '' : value}
      </div>
    </div>
  );
};

export default GridCell;
