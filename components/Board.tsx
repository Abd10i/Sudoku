"use client";

import { useEffect, useState } from "react";
import "./style.css";
import SudokuGrid from "./SudokuGrid";
import GameControls from "./GameControls";
import Timer from "./Timer";

type BoardState = number[][];
type BooleanMatrix = boolean[][];

const Board = () => {
  const [board, setBoard] = useState<BoardState>([]);
  const [solution, setSolution] = useState<BoardState>([]);
  const [isPrewritten, setIsPrewritten] = useState<BooleanMatrix>([]);
  const [conflicts, setConflicts] = useState<BooleanMatrix>([]);
  const [hintsRemaining, setHintsRemaining] = useState<number>(3);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const initializeGame = async () => {
    try {
      const response = await fetch(`https://sudoku-api.vercel.app/api/dosuku?clues=30`);
      const data = await response.json();
      const newBoard = data.newboard.grids[0].value;
      
      setBoard(newBoard);
      setSolution(data.newboard.grids[0].solution);
      setIsPrewritten(newBoard.map((row: number[]) => row.map((cell: number) => cell !== 0)));
      setConflicts(Array(9).fill(0).map(() => Array(9).fill(false)));
      setHintsRemaining(3);
      setSelectedNumber(null);
      resetTimer();
      startTimer();
    } catch (error) {
      console.error("Error fetching Sudoku board:", error);
    }
  };

  const startTimer = () => setIsRunning(true);
  const stopTimer = () => setIsRunning(false);
  const resetTimer = () => setTimer(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const validateBoard = (currentBoard: number[][]) => {
    const newConflicts = Array(9).fill(null).map(() => Array(9).fill(false));
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const value = currentBoard[i][j];
        if (value === 0) continue;
        for (let col = 0; col < 9; col++) {
          if (col !== j && currentBoard[i][col] === value) {
            newConflicts[i][j] = true;
            newConflicts[i][col] = true;
          }}
        for (let row = 0; row < 9; row++) {
          if (row !== i && currentBoard[row][j] === value) {
            newConflicts[i][j] = true;
            newConflicts[row][j] = true;
          }}
        const boxRow = Math.floor(i / 3) * 3;
        const boxCol = Math.floor(j / 3) * 3;
        for (let x = 0; x < 3; x++) {
          for (let y = 0; y < 3; y++) {
            const row = boxRow + x;
            const col = boxCol + y;
            if (row !== i && col !== j && currentBoard[row][col] === value) {
              newConflicts[i][j] = true;
              newConflicts[row][col] = true;
            }}}}}
  setConflicts(newConflicts);
  };

  const handleCellChange = (row: number, col: number, value: string) => {
    if (/^[1-9]?$/.test(value)) {  
      const numValue = value ? parseInt(value) : 0;
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = numValue;
      setBoard(newBoard);
      validateBoard(newBoard);
      setSelectedNumber(numValue || null);
    }
  };
  const handleCellClick = (row: number, col: number) => {
    const cellValue = board[row][col];
    setSelectedNumber(cellValue !== 0 ? cellValue : null);
  };

  const solvePuzzle = () => {
    setBoard([...solution]);
    setConflicts(Array(9).fill(0).map(() => Array(9).fill(false)));
    stopTimer();
  };

  const giveHint = () => {
    if (hintsRemaining <= 0) return alert("No hints left!");
    const emptyCells = board.flatMap((row, i) => 
      row.map((cell, j) => cell === 0 ? [i, j] : null).filter(Boolean)
    ) as [number, number][];
    if (!emptyCells.length) return alert("Puzzle complete!");
    const [row, col] = emptyCells[Math.random() * emptyCells.length | 0];
    const newBoard = [...board.map(r => [...r])];
    newBoard[row][col] = solution[row][col];
    setBoard(newBoard);
    validateBoard(newBoard);
    setHintsRemaining(h => h - 1);
    setSelectedNumber(solution[row][col]);
  };
  useEffect(() => { initializeGame(); }, []);

  return (
    <div className="sudoku-container">
      <h1>Sudoku Challenge</h1>
      <GameControls 
  {...{ 
    onNewGame: initializeGame, 
    onSolve: solvePuzzle, 
    onHint: giveHint, 
    hintsRemaining 
  }}
>
  <Timer seconds={timer} />
</GameControls>
<SudokuGrid {...{ 
  board, isPrewritten, conflicts, selectedNumber, 
  onCellChange: handleCellChange, onCellClick: handleCellClick 
}} />
    </div>
  );};

export default Board;