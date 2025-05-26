import React, { useState } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * Main container for the TicTacToe Classic game.
 * Implements two-player gameplay, win/draw detection, and restart functionality.
 */
function App() {
  // State for the 9 squares, each can be "X", "O", or null
  const [squares, setSquares] = useState(Array(9).fill(null));
  // State for current player, true if X's turn, false if O's turn
  const [xIsNext, setXIsNext] = useState(true);
  // State for winner ("X"|"O"|null), and draw
  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(Boolean);

  // Handler for when a square is clicked
  // PUBLIC_INTERFACE
  function handleClick(index) {
    if (squares[index] || winner) {
      return; // Cannot click if square filled or game over
    }
    const nextSquares = squares.slice();
    nextSquares[index] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  let status;
  if (winner) {
    status = (
      <span style={{ color: '#FF5252', fontWeight: 600 }}>
        Winner: {winner}
      </span>
    );
  } else if (isDraw) {
    status = (
      <span style={{ color: '#1976D2', fontWeight: 500 }}>
        Draw!
      </span>
    );
  } else {
    status = (
      <span style={{ color: '#1976D2', fontWeight: 500 }}>
        Turn: {xIsNext ? 'X' : 'O'}
      </span>
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> KAVIA AI
            </div>
            <button className="btn" tabIndex={-1} style={{ opacity: 0.6, pointerEvents: "none" }}>Classic TicTacToe</button>
          </div>
        </div>
      </nav>

      <main>
        <div className="container" style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 120 }}>
          <div className="subtitle" style={{ color: "#1976D2", marginBottom: 20, fontWeight: 600 }}>TicTacToe Classic</div>
          <div className="tictactoe-board">
            <TicTacToeBoard squares={squares} onClick={handleClick} />
          </div>
          <div className="tictactoe-status" style={{ marginTop: 28, fontSize: 22, minHeight: 40, textAlign: "center" }}>
            {status}
          </div>
          <button
            className="btn btn-large"
            style={{
              backgroundColor: '#1976D2',
              color: '#FFFFFF',
              marginTop: 18,
              fontWeight: 550,
              width: 150,
              borderRadius: 8,
              letterSpacing: 1.2,
              border: 'none',
            }}
            onClick={handleRestart}
            aria-label="Restart Game"
          >
            Restart
          </button>
        </div>
        <style>
          {`
            .tictactoe-board {
              display: grid;
              grid-template-columns: repeat(3, 72px);
              grid-template-rows: repeat(3, 72px);
              gap: 10px;
              justify-content: center;
              align-items: center;
            }
            .square-btn {
              border: 2px solid #1976D2;
              background: #FFFFFF;
              color: #1976D2;
              font-size: 2.5rem;
              font-weight: 700;
              cursor: pointer;
              border-radius: 12px;
              box-shadow: 0 2px 4px rgba(25, 118, 210, 0.06);
              position: relative;
              transition: box-shadow 0.16s, background 0.19s;
              height: 72px;
              width: 72px;
              outline: none;
            }
            .square-btn:hover:not(:disabled) {
              background: #dde9f7;
              box-shadow: 0 3px 9px rgba(25, 118, 210, 0.08);
            }
            .square-btn:disabled {
              background: #f7f7f7;
              color: #90caf9;
              cursor: default;
              opacity: 1;
            }
            .square-btn.winner {
              background: #FF5252 !important;
              color: #FFFFFF !important;
              border-color: #FF5252 !important;
              animation: pulseWinner 1.1s infinite alternate;
            }
            @keyframes pulseWinner {
              0% { box-shadow: 0 0 0 0 rgba(255,82,82,0.17);}
              100% { box-shadow: 0 0 6px 3px rgba(255,82,82,0.23);}
            }
          `}
        </style>
      </main>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Render a 3x3 board for TicTacToe
 */
function TicTacToeBoard({ squares, onClick }) {
  // Find which squares (if any) are in the current winning line
  const winLine = calculateWinnerLine(squares);

  return (
    <>
      {squares.map((value, idx) => {
        const isWinner = winLine && winLine.includes(idx);
        return (
          <button
            key={idx}
            className={`square-btn${isWinner ? ' winner' : ''}`}
            onClick={() => onClick(idx)}
            disabled={Boolean(value) || Boolean(calculateWinner(squares))}
            aria-label={`Cell ${Math.floor(idx / 3) + 1},${(idx % 3) + 1}`}
            tabIndex={0}
          >
            {value}
          </button>
        );
      })}
    </>
  );
}

/**
 * PUBLIC_INTERFACE
 * Checks the board for a winner.
 * Returns "X", "O", or null.
 */
function calculateWinner(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],  // rows
    [0,3,6],[1,4,7],[2,5,8],  // cols
    [0,4,8],[2,4,6]           // diags
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

/**
 * PUBLIC_INTERFACE
 * Returns an array with indices of the winning line, or null.
 */
function calculateWinnerLine(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return line;
    }
  }
  return null;
}

export default App;