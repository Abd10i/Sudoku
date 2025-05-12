"use client";

interface ControlsProps {
  onSolve: () => void;
  onHint: () => void;
  hintsRemaining: number;
}

const Controls = ({ onSolve, onHint, hintsRemaining }: ControlsProps) => {
  return (
    <div className="button-group">
      <button onClick={onSolve} className="btn solve-btn">
        Solve Puzzle
      </button>
      <button 
        onClick={onHint} 
        className={`btn hint-btn ${hintsRemaining <= 0 ? 'disabled' : ''}`}
        disabled={hintsRemaining <= 0}
      >
        Get Hint ({hintsRemaining} left)
      </button>
    </div>
  );
};

export default Controls;