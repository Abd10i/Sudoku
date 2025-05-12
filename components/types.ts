export type BoardState = number[][];
export type BooleanMatrix = boolean[][];

export interface GameControlsProps {
  initializeGame: () => void;
  solvePuzzle: () => void;
  giveHint: () => void;
  hintsRemaining: number;
  children: React.ReactNode;
}

export interface SudokuGridProps {
  board: BoardState;
  isPrewritten: BooleanMatrix;
  conflicts: BooleanMatrix;
  selectedNumber: number | null;
  handleCellChange: (row: number, col: number, value: string) => void;
}