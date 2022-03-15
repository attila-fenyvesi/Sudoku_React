import { Position } from '../components/GridCell';

const compPositions = (
  position_1: Position | null,
  position_2: Position | null
) => {
  return (
    position_1 &&
    position_2 &&
    position_1.x === position_2.x &&
    position_1.y === position_2.y
  );
};

const checkPosInArray = (position: Position, array: Position[]) => {
  return array.some((value: Position) => {
    return compPositions(value, position);
  });
};

const range = (
  param_1: number,
  param_2?: number,
  param_3?: number
): number[] => {
  const start = param_2 === undefined ? 0 : param_1;
  const end = param_2 === undefined ? param_1 : param_2;
  const step = param_3 === undefined ? 1 : Math.abs(param_3);

  if (
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    !Number.isInteger(step)
  ) {
    throw new Error('Only integer parameters are accepted!');
  }

  const difference = end - start;
  if (difference === 0) {
    return [start];
  }

  const keys = Array(Math.ceil((Math.abs(difference) + 1) / step)).keys();

  return Array.from(keys).map((x) => {
    const increment = end > start ? x : -x;
    return start + increment * step;
  });
};

const shuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

const logMap = (map: Map<any, any>) => {
  console.log(JSON.stringify(Array.from(map.entries())));
};

const logMapAsObj = (map: Map<any, any>) => {
  console.log(JSON.parse(JSON.stringify(Array.from(map.entries()))));
};

const logObj = (obj: any) => {
  console.log(JSON.parse(JSON.stringify(obj)));
};

export {
  checkPosInArray,
  compPositions,
  range,
  shuffle,
  logMap,
  logMapAsObj,
  logObj,
};
