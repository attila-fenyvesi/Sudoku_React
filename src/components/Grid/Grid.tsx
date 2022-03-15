import React, { useContext } from 'react';
import GridBlock from '../GridBlock';
import { Position } from '../GridCell/GridCell';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { GameContext } from '../../utils/GameContext';
import GameLogic from '../../utils/GameLogic';

const Grid = () => {
  const { state } = useContext(GameContext);
  const { setNumber } = GameLogic();

  const gridBlocks: any = [];

  for (let y = 0; y < 3; ++y) {
    for (let x = 0; x < 3; ++x) {
      const props: Position = {
        x: x,
        y: y,
      };
      const key: string = `gridBlock-${y}${x}`;
      gridBlocks.push(<GridBlock key={key} {...props} />);
    }
  }

  const onKeyPress = (key: string, e: object) => {
    setNumber(key);
  };

  return (
    <div id="grid-wrapper">
      <div id="grid">{gridBlocks}</div>
      <KeyboardEventHandler
        handleKeys={['1', '2', '3', '4', '5', '6', '7', '8', '9']}
        onKeyEvent={onKeyPress}
        isDisabled={state.selectedCell === null}
      />
    </div>
  );
};

export default Grid;
