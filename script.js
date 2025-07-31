// Retro Mac Minesweeper Game Logic

class Minesweeper {
    constructor() {
        this.difficulties = {
            beginner: { rows: 9, cols: 9, mines: 10 },
            intermediate: { rows: 16, cols: 16, mines: 40 },
            expert: { rows: 16, cols: 30, mines: 99 }
        };
        
        this.currentDifficulty = 'beginner';
        this.gameBoard = [];
        this.mineLocations = new Set();
        this.revealedCells = new Set();
        this.flaggedCells = new Set();
        this.gameStarted = false;
        this.gameOver = false;
        this.timer = 0;
        this.timerInterval = null;
        this.firstClick = true;
        this.leaderboard = this.loadLeaderboard();
        
        this.initializeGame();
        this.setupEventListeners();
        this.updateLeaderboardDisplay();
    }
    
    initializeGame() {
        const config = this.difficulties[this.currentDifficulty];
        this.rows = config.rows;
        this.cols = config.cols;
        this.totalMines = config.mines;
        this.remainingMines = this.totalMines;
        
        this.createBoard();
        this.updateDisplay();
    }
    
    createBoard() {
        this.gameBoard = [];
        for (let row = 0; row < this.rows; row++) {
            this.gameBoard[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.gameBoard[row][col] = {
                    isMine: false,
                    neighborMines: 0,
                    revealed: false,
                    flagged: false
                };
            }
        }
    }
    
    placeMines(firstRow, firstCol) {
        this.mineLocations.clear();
        let minesPlaced = 0;
        
        while (minesPlaced < this.totalMines) {
            const row = Math.floor(Math.random() * this.rows);
            const col = Math.floor(Math.random() * this.cols);
            
            // Don't place mine on first click or if already placed
            if ((row === firstRow && col === firstCol) || this.mineLocations.has(`${row},${col}`)) {
                continue;
            }
            
            this.mineLocations.add(`${row},${col}`);
            this.gameBoard[row][col].isMine = true;
            minesPlaced++;
        }
        
        // Calculate neighbor mines for all cells
        this.calculateNeighborMines();
    }
    
    calculateNeighborMines() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (!this.gameBoard[row][col].isMine) {
                    this.gameBoard[row][col].neighborMines = this.countNeighborMines(row, col);
                }
            }
        }
    }
    
    countNeighborMines(row, col) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const newRow = row + dr;
                const newCol = col + dc;
                if (this.isValidCell(newRow, newCol) && this.gameBoard[newRow][newCol].isMine) {
                    count++;
                }
            }
        }
        return count;
    }
    
    isValidCell(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }
    
    revealCell(row, col) {
        if (this.gameOver || this.gameBoard[row][col].flagged || this.gameBoard[row][col].revealed) {
            return;
        }
        
        if (this.firstClick) {
            this.placeMines(row, col);
            this.firstClick = false;
            this.startTimer();
        }
        
        this.gameBoard[row][col].revealed = true;
        this.revealedCells.add(`${row},${col}`);
        
        if (this.gameBoard[row][col].isMine) {
            this.gameOver = true;
            this.revealAllMines();
            this.stopTimer();
            this.showGameOverModal(false);
            return;
        }
        
        // If cell has no neighbor mines, reveal neighbors
        if (this.gameBoard[row][col].neighborMines === 0) {
            this.revealNeighbors(row, col);
        }
        
        // Check for win
        if (this.checkWin()) {
            this.gameOver = true;
            this.stopTimer();
            const isNewRecord = this.addToLeaderboard(this.timer);
            this.showGameOverModal(true, isNewRecord);
        }
        
        this.updateDisplay();
    }
    
    revealNeighbors(row, col) {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const newRow = row + dr;
                const newCol = col + dc;
                if (this.isValidCell(newRow, newCol) && !this.gameBoard[newRow][newCol].revealed) {
                    this.revealCell(newRow, newCol);
                }
            }
        }
    }
    
    toggleFlag(row, col) {
        if (this.gameOver || this.gameBoard[row][col].revealed) {
            return;
        }
        
        if (this.gameBoard[row][col].flagged) {
            this.gameBoard[row][col].flagged = false;
            this.flaggedCells.delete(`${row},${col}`);
            this.remainingMines++;
        } else {
            this.gameBoard[row][col].flagged = true;
            this.flaggedCells.add(`${row},${col}`);
            this.remainingMines--;
        }
        
        this.updateDisplay();
    }
    
    revealAllMines() {
        this.mineLocations.forEach(location => {
            const [row, col] = location.split(',').map(Number);
            this.gameBoard[row][col].revealed = true;
            this.revealedCells.add(`${row},${col}`);
        });
    }
    
    checkWin() {
        return this.revealedCells.size === (this.rows * this.cols - this.totalMines);
    }
    
    startTimer() {
        this.timer = 0;
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateTimer();
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    updateTimer() {
        const timerElement = document.getElementById('timer');
        timerElement.textContent = this.timer.toString().padStart(3, '0');
    }
    
    updateDisplay() {
        const gameBoard = document.getElementById('game-board');
        const mineCount = document.getElementById('mine-count');
        
        // Update mine counter
        mineCount.textContent = this.remainingMines.toString().padStart(2, '0');
        
        // Update game board - ensure proper sizing
        gameBoard.style.gridTemplateColumns = `repeat(${this.cols}, 30px)`;
        gameBoard.style.width = `${this.cols * 30 + 4}px`; // 4px for padding
        gameBoard.style.height = `${this.rows * 30 + 4}px`; // 4px for padding
        gameBoard.innerHTML = '';
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                const cellData = this.gameBoard[row][col];
                
                if (cellData.revealed) {
                    cell.classList.add('revealed');
                    if (cellData.isMine) {
                        cell.classList.add('mine');
                        if (this.gameOver) {
                            cell.classList.add('mine-exploded');
                        }
                        cell.textContent = '*';
                    } else if (cellData.neighborMines > 0) {
                        cell.textContent = cellData.neighborMines;
                        cell.dataset.number = cellData.neighborMines;
                    }
                } else if (cellData.flagged) {
                    cell.textContent = 'F';
                }
                
                gameBoard.appendChild(cell);
            }
        }
    }
    
    showGameOverModal(won, isNewRecord = false) {
        const modal = document.getElementById('game-over-modal');
        const result = document.getElementById('game-result');
        const message = document.getElementById('game-message');
        const smileyBtn = document.getElementById('smiley-btn');
        
        if (won) {
            result.textContent = 'VICTORY!';
            const recordText = isNewRecord ? ' NEW RECORD!' : '';
            message.textContent = `You won in ${this.timer} seconds!${recordText}`;
            smileyBtn.textContent = ':-)';
            smileyBtn.classList.add('win');
        } else {
            result.textContent = 'GAME OVER!';
            message.textContent = 'You hit a mine!';
            smileyBtn.textContent = 'X-X';
            smileyBtn.classList.add('game-over');
        }
        
        modal.classList.remove('hidden');
    }
    
    hideGameOverModal() {
        const modal = document.getElementById('game-over-modal');
        modal.classList.add('hidden');
    }
    
    newGame() {
        this.gameBoard = [];
        this.mineLocations.clear();
        this.revealedCells.clear();
        this.flaggedCells.clear();
        this.gameStarted = false;
        this.gameOver = false;
        this.firstClick = true;
        this.stopTimer();
        this.timer = 0;
        this.updateTimer();
        
        const smileyBtn = document.getElementById('smiley-btn');
        smileyBtn.textContent = ':-)';
        smileyBtn.classList.remove('game-over', 'win');
        
        this.hideGameOverModal();
        this.initializeGame();
    }
    
    changeDifficulty(difficulty) {
        this.currentDifficulty = difficulty;
        this.newGame();
        
        // Update active button
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-difficulty="${difficulty}"]`).classList.add('active');
    }
    
    loadLeaderboard() {
        const saved = localStorage.getItem('minesweeper-leaderboard');
        return saved ? JSON.parse(saved) : {
            beginner: [],
            intermediate: [],
            expert: []
        };
    }
    
    saveLeaderboard() {
        localStorage.setItem('minesweeper-leaderboard', JSON.stringify(this.leaderboard));
    }
    
    addToLeaderboard(time) {
        const entry = {
            time: time,
            date: new Date().toLocaleDateString(),
            timestamp: Date.now()
        };
        
        this.leaderboard[this.currentDifficulty].push(entry);
        this.leaderboard[this.currentDifficulty].sort((a, b) => a.time - b.time);
        this.leaderboard[this.currentDifficulty] = this.leaderboard[this.currentDifficulty].slice(0, 10); // Keep top 10
        
        this.saveLeaderboard();
        this.updateLeaderboardDisplay();
        
        // Check if it's a new record
        const isNewRecord = this.leaderboard[this.currentDifficulty][0].timestamp === entry.timestamp;
        return isNewRecord;
    }
    
    updateLeaderboardDisplay() {
        const difficulties = ['beginner', 'intermediate', 'expert'];
        
        difficulties.forEach(difficulty => {
            const entriesContainer = document.getElementById(`${difficulty}-entries`);
            entriesContainer.innerHTML = '';
            
            this.leaderboard[difficulty].forEach((entry, index) => {
                const entryElement = document.createElement('div');
                entryElement.className = `leaderboard-entry rank-${index + 1}`;
                
                const rank = index + 1;
                const time = entry.time.toString().padStart(3, '0');
                const date = entry.date;
                
                entryElement.innerHTML = `
                    <span>${rank}</span>
                    <span>${time}s</span>
                    <span>${date}</span>
                `;
                
                entriesContainer.appendChild(entryElement);
            });
        });
    }
    
    toggleLeaderboard() {
        const leaderboardSection = document.getElementById('leaderboard-section');
        leaderboardSection.classList.toggle('active');
        
        if (leaderboardSection.classList.contains('active')) {
            this.updateLeaderboardDisplay();
        }
    }
    
    setupEventListeners() {
        // Game board clicks
        document.getElementById('game-board').addEventListener('click', (e) => {
            if (e.target.classList.contains('cell')) {
                const row = parseInt(e.target.dataset.row);
                const col = parseInt(e.target.dataset.col);
                this.revealCell(row, col);
            }
        });
        
        // Right click for flagging
        document.getElementById('game-board').addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (e.target.classList.contains('cell')) {
                const row = parseInt(e.target.dataset.row);
                const col = parseInt(e.target.dataset.col);
                this.toggleFlag(row, col);
            }
        });
        
        // New game button
        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.newGame();
        });
        
        // Smiley button
        document.getElementById('smiley-btn').addEventListener('click', () => {
            this.newGame();
        });
        
        // Difficulty buttons
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const difficulty = btn.dataset.difficulty;
                this.changeDifficulty(difficulty);
            });
        });
        
        // Play again button
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.newGame();
        });
        
        // Leaderboard button
        document.getElementById('leaderboard-btn').addEventListener('click', () => {
            this.toggleLeaderboard();
        });
        
        // Leaderboard tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const difficulty = btn.dataset.difficulty;
                
                // Update active tab
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update active leaderboard
                document.querySelectorAll('.leaderboard').forEach(lb => lb.classList.remove('active'));
                document.getElementById(`${difficulty}-leaderboard`).classList.add('active');
            });
        });
        
        // Title bar buttons (for fun)
        document.querySelector('.close-button').addEventListener('click', () => {
            if (confirm('Are you sure you want to close the game?')) {
                window.close();
            }
        });
        
        document.querySelector('.minimize-button').addEventListener('click', () => {
            alert('Minimize functionality would go here!');
        });
        
        document.querySelector('.zoom-button').addEventListener('click', () => {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                document.documentElement.requestFullscreen();
            }
        });
        
        // Prevent context menu on game board
        document.getElementById('game-board').addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Minesweeper();
}); 