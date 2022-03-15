import React from 'react';
import GridCell from '../GridCell';
import { Position } from '../GridCell/GridCell';

const GridBlock = (gridPosition: Position) => {
  const gridCells: any[] = [];
  for (let y = 0; y < 3; ++y) {
    for (let x = 0; x < 3; ++x) {
      const position: Position = {
        x: gridPosition.x * 3 + x,
        y: gridPosition.y * 3 + y,
      };
      const key: string = `gridCell-${position.y}${position.x}`;

      gridCells.push(<GridCell key={key} {...position} />);
    }
  }

  return <div className="grid-block">{gridCells}</div>;
};

export default GridBlock;
