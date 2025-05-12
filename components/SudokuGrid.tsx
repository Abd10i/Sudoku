interface SudokuGridProps {
  board: number[][];
  isPrewritten: boolean[][];
  conflicts: boolean[][];
  selectedNumber: number | null;
  onCellChange: (row: number, col: number, value: string) => void;
  onCellClick: (row: number, col: number) => void;
}

const SudokuGrid: React.FC<SudokuGridProps> = ({
  board,
  isPrewritten,
  conflicts,
  selectedNumber,
  onCellChange,
  onCellClick
}) => {
  return (
    <div className="sudoku-board">
      {board.map((row, rowIndex) => (
        <div className="sudoku-row" key={rowIndex}>
          {row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="text"
              value={cell !== 0 ? cell : ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^[1-9]$/.test(value)) {
                  onCellChange(rowIndex, colIndex, value);
                }
              }}
              onClick={() => onCellClick(rowIndex, colIndex)}
              readOnly={isPrewritten[rowIndex][colIndex]}
              className={`sudoku-cell ${
                isPrewritten[rowIndex][colIndex] ? "prewritten" : ""
              } ${
                conflicts[rowIndex][colIndex] ? "incorrect" : ""
              } ${
                cell !== 0 && selectedNumber === cell ? "highlight" : ""
              }`}
              maxLength={1}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
export default SudokuGrid;