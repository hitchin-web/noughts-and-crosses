import "./App.css";
import { useState, useEffect, useCallback } from "react";

/*******************************************************************************
  Constants
 ******************************************************************************/

const SQUARE_COUNT = 9;
const SQUARES = Array.from(Array(SQUARE_COUNT), (_, index) => ({ index }));
const PLAYERS = [{ symbol: "🅾️" }, { symbol: "❎" }];
const WINNING_LINES = [7, 56, 448, 73, 146, 292, 273, 84];

/*******************************************************************************
  Component
 ******************************************************************************/

export default function App() {
  // ----------------------------
  // STATE:

  const [initialPlayerIndex, setInitialPlayerIndex] = useState(1);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [squarePlayerIndices, setSquarePlayerIndices] = useState(
    Array.from(Array(SQUARE_COUNT), () => null)
  );
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [isCtrlDown, setIsCtrlDown] = useState(false);

  // ----------------------------
  // EVENT HANDLERS:

  const onSquareClick = useCallback(
    (square) => {
      if (squarePlayerIndices[square.index] != null) {
        return;
      }

      setSquarePlayerIndices((existing) => {
        const players = [...existing];
        players[square.index] = playerIndex;
        return players;
      });
      setPlayerIndex((playerIndex + 1) % 2);
    },
    [playerIndex, squarePlayerIndices]
  );

  const onRestartClick = () => {
    setInitialPlayerIndex((existing) => (existing + 1) % 2);
    setPlayerIndex(initialPlayerIndex);
    setSquarePlayerIndices(Array.from(Array(SQUARE_COUNT), () => null));
    setWinnerIndex(null);
    setIsDraw(false);
  };

  const onAppKey = useCallback(
    (e) => {
      setIsCtrlDown(e.ctrlKey);

      if (!e.ctrlKey || e.type !== "keydown") {
        return;
      }

      const index = parseInt(e.key, 10);
      if (isNaN(index) || index < 1 || index > SQUARE_COUNT) {
        return;
      }

      const square = SQUARES[index - 1];
      onSquareClick(square);
    },
    [onSquareClick]
  );

  // ----------------------------
  // EFFECTS:

  // When mounted, add keyboard event listeners
  useEffect(() => {
    document.addEventListener("keydown", onAppKey);
    document.addEventListener("keyup", onAppKey);

    return () => {
      document.removeEventListener("keydown", onAppKey);
      document.removeEventListener("keyup", onAppKey);
    };
  }, [onAppKey]);

  // When the grid changes, check if there's a result
  useEffect(() => {
    PLAYERS.forEach((player, playerIndex) => {
      // Convert the player's moves to a binary value
      const value = squarePlayerIndices.reduce((result, pIndex, sqIndex) => {
        return playerIndex === pIndex ? result + Math.pow(2, sqIndex) : result;
      }, 0);

      // Check the value against winning lines
      WINNING_LINES.forEach((winningLine) => {
        if ((value & winningLine) === winningLine) {
          setWinnerIndex(playerIndex);
        }
      });

      // Check for a draw
      const emptyCount = squarePlayerIndices.filter((s) => s == null).length;
      if (emptyCount === 0) {
        setIsDraw(true);
      }
    });
  }, [squarePlayerIndices]);

  // ----------------------------
  // RENDER:

  return (
    <div className="App" data-ctrl-down={isCtrlDown}>
      <header className="header">{PLAYERS[playerIndex].symbol}'s turn</header>
      {SQUARES.map((square) => (
        <button
          key={square.index}
          className="square"
          data-index={square.index + 1}
          data-empty={squarePlayerIndices[square.index] == null}
          disabled={squarePlayerIndices[square.index] != null}
          onClick={() => onSquareClick(square)}
        >
          {PLAYERS[squarePlayerIndices[square.index]]?.symbol ?? ""}
        </button>
      ))}
      {winnerIndex != null && (
        <dialog className="dialog" open>
          <p>{PLAYERS[winnerIndex].symbol} is the winner!!</p>
          <form method="dialog">
            <button onClick={onRestartClick}>Restart</button>
          </form>
        </dialog>
      )}
      {winnerIndex == null && isDraw && (
        <dialog className="dialog" open>
          <p>It's a draw!!</p>
          <form method="dialog">
            <button onClick={onRestartClick}>Restart</button>
          </form>
        </dialog>
      )}
    </div>
  );
}
