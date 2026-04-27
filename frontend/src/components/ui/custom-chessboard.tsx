"use client";

import { Chess } from "chess.js";

interface CustomChessboardProps {
  fen: string;
  onSquareClick: (square: string) => void;
  moveFrom: string | null;
  optionSquares: Record<string, any>;
  boardOrientation?: "white" | "black";
}

const PIECE_SYMBOLS: Record<string, string> = {
  p: "♟", n: "♞", b: "♝", r: "♜", q: "♛", k: "♚",
  P: "♙", N: "♘", B: "♗", R: "♖", Q: "♕", K: "♔",
};

export function CustomChessboard({
  fen,
  onSquareClick,
  moveFrom,
  optionSquares,
  boardOrientation = "white",
}: CustomChessboardProps) {
  // Manual FEN parser to avoid chess.js strict validation crashes on puzzle FENs
  const parseFen = (fenString: string) => {
    const board: ({ type: string; color: "w" | "b" } | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
    const layout = fenString === "start" ? "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR" : fenString.split(" ")[0];
    const fenRows = layout.split("/");
    
    for (let r = 0; r < Math.min(8, fenRows.length); r++) {
      let c = 0;
      for (const char of fenRows[r]) {
        if (/[1-8]/.test(char)) {
          c += parseInt(char, 10);
        } else {
          if (c < 8) {
            board[r][c] = { type: char.toLowerCase(), color: char === char.toLowerCase() ? "b" : "w" };
          }
          c++;
        }
      }
    }
    return board;
  };

  const board = parseFen(fen);

  // Create grid based on orientation
  const rows = boardOrientation === "white" ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];
  const cols = boardOrientation === "white" ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];

  const getSquareName = (r: number, c: number) => {
    const file = String.fromCharCode(97 + c);
    const rank = 8 - r;
    return `${file}${rank}`;
  };

  return (
    <div className="w-full aspect-square bg-zinc-900 border-4 border-zinc-800 grid grid-cols-8 grid-rows-8 relative select-none">
      {rows.map((r) =>
        cols.map((c) => {
          const square = getSquareName(r, c);
          const piece = board[r][c];
          const isDark = (r + c) % 2 === 1;
          const isSelected = moveFrom === square;
          const isOption = !!optionSquares[square];
          const optionStyle = optionSquares[square]?.background;

          return (
            <div
              key={square}
              onClick={() => onSquareClick(square)}
              className={`
                relative flex items-center justify-center cursor-pointer transition-colors
                ${isDark ? "bg-[#3f3f46]" : "bg-[#d4d4d8]"}
                ${isSelected ? "ring-4 ring-inset ring-blue-500 z-10" : ""}
              `}
            >
              {/* Highlight Option */}
              {isOption && (
                <div
                  className="absolute inset-0 z-20 pointer-events-none"
                  style={{ background: optionStyle }}
                />
              )}

              {/* Piece */}
              {piece && (
                <div
                  className={`
                    relative z-30 flex flex-col items-center justify-center text-6xl drop-shadow-md
                    ${piece.color === "w" ? "text-white" : "text-black"}
                  `}
                >
                  {PIECE_SYMBOLS[piece.color === "w" ? piece.type.toUpperCase() : piece.type]}
                </div>
              )}

              {/* Coordinates (optional, only on edges) */}
              {c === (boardOrientation === "white" ? 0 : 7) && (
                <span className={`absolute top-0.5 left-1 text-[10px] font-bold ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                  {8 - r}
                </span>
              )}
              {r === (boardOrientation === "white" ? 7 : 0) && (
                <span className={`absolute bottom-0.5 right-1 text-[10px] font-bold ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                  {String.fromCharCode(97 + c)}
                </span>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
