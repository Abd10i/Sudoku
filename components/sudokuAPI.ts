export const fetchSudokuBoard = async () => {
    try {
      const response = await fetch(
        `https://sudoku-api.vercel.app/api/dosuku?clues=30`
      );
      const data = await response.json();
      return {
        board: data.newboard.grids[0].value,
        solution: data.newboard.grids[0].solution
      };
    } catch (error) {
      console.error("Error fetching Sudoku board:", error);
      throw error;
    }
  };