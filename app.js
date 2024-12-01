document.addEventListener("DOMContentLoaded", () => {
    const rows = 6; // Number of rows
    const columns = 7; // Number of columns
    const gameContainer = document.getElementById("game-container");
    const resultDisplay = document.getElementById("result");
    const currentPlayerDisplay = document.getElementById("current-player");
    const resetButton = document.getElementById("reset-button");
    
    let currentPlayer = 1; // Player 1 starts
    let gameActive = true; // Game state
    const grid = []; // Grid to hold cells

    // 1. Create the game grid dynamically
    function createGrid() {
        gameContainer.innerHTML = ""; // Clear previous grid
        grid.length = 0; // Reset the grid array

        for (let row = 0; row < rows; row++) {
            const rowArray = [];
            for (let col = 0; col < columns; col++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = row;
                cell.dataset.col = col;
                gameContainer.appendChild(cell);
                rowArray.push(cell);

                // Add click event to each cell
                cell.addEventListener("click", () => handleCellClick(col));
            }
            grid.push(rowArray);
        }
    }

    // 2. Handle cell click
    function handleCellClick(col) {
        if (!gameActive) return; // Stop if the game is over

        // Find the lowest available cell in the column
        for (let row = rows - 1; row >= 0; row--) {
            const cell = grid[row][col];
            if (!cell.classList.contains("player-one") && !cell.classList.contains("player-two")) {
                placeToken(cell);
                checkWin(row, col); // Check for a win
                switchPlayer(); // Switch to the other player
                return;
            }
        }

        alert("Column is full! Try another column.");
    }

    // 3. Place token in the selected cell
    function placeToken(cell) {
        const playerClass = currentPlayer === 1 ? "player-one" : "player-two";
        cell.classList.add(playerClass);
    }

    // 4. Switch to the next player
    function switchPlayer() {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        const playerColor = currentPlayer === 1 ? "Blue" : "Red";
        currentPlayerDisplay.textContent = `${currentPlayer} (${playerColor})`;
    }

    // 5. Check for a win
    function checkWin(row, col) {
        const playerClass = currentPlayer === 1 ? "player-one" : "player-two";
        const directions = [
            { dr: 0, dc: 1 }, // Horizontal
            { dr: 1, dc: 0 }, // Vertical
            { dr: 1, dc: 1 }, // Diagonal \
            { dr: 1, dc: -1 } // Diagonal /
        ];

        for (let { dr, dc } of directions) {
            if (countConnectedTokens(row, col, dr, dc, playerClass) >= 4) {
                endGame();
                return;
            }
        }
    }

    // 6. Count connected tokens in a direction
    function countConnectedTokens(row, col, dr, dc, playerClass) {
        let count = 1; // Start with the current cell

        // Check in both directions
        for (let sign of [-1, 1]) {
            let r = row + dr * sign;
            let c = col + dc * sign;
            while (isValidCell(r, c) && grid[r][c].classList.contains(playerClass)) {
                count++;
                r += dr * sign;
                c += dc * sign;
            }
        }

        return count;
    }

    // 7. Validate if a cell is within the grid
    function isValidCell(row, col) {
        return row >= 0 && row < rows && col >= 0 && col < columns;
    }

    // 8. End the game
    function endGame() {
        resultDisplay.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
    }

    // 9. Reset the game
    resetButton.addEventListener("click", () => {
        gameActive = true;
        currentPlayer = 1;
        currentPlayerDisplay.textContent = "1 (Blue)";
        resultDisplay.textContent = "";
        createGrid();
    });

    // Initialize the game
    createGrid();
});
