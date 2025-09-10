export const COLS = 10;
export const ROWS = 20;
export const BLOCK_SIZE = 28;
export const FPS = 60;

export type Shape = {
  name: string;
  blocks: Array<Array<number>>;
};

export const SHAPES: Shape[] = [
  {
    name: 'I',
    blocks: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  },
  {
    name: 'J',
    blocks: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
  {
    name: 'L',
    blocks: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
  {
    name: 'O',
    blocks: [
      [1, 1],
      [1, 1],
    ],
  },
  {
    name: 'S',
    blocks: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
  },
  {
    name: 'T',
    blocks: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
  {
    name: 'Z',
    blocks: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
  },
];
