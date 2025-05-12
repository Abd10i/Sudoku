import React from "react";

interface GameControlsProps {
  onNewGame: () => void;
  onSolve: () => void;
  onHint: () => void;
  hintsRemaining: number;
  children: React.ReactNode;
}

const GameControls: React.FC<GameControlsProps> = ({
  onNewGame,
  onSolve,
  onHint,
  hintsRemaining,
  children
}) => {
  return (
    <>
      <div className="controls">
        <button onClick={onNewGame} className="btn">
          New Puzzle
        </button>
        {children}
      </div>
      <div className="button-group">
        <button onClick={onSolve} className="btn solve-btn">
          Solve Puzzle
        </button>
        <button 
          onClick={onHint} 
          className={`btn hint-btn ${hintsRemaining <= 0 ? 'disabled' : ''}`}
        >
          Get Hint ({hintsRemaining} left)
        </button>
      </div>
    </>
  );
};

export default GameControls;