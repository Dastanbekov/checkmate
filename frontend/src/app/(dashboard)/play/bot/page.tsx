"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Chess } from "chess.js";
import { CustomChessboard } from "@/components/ui/custom-chessboard";
import { BrainCircuit, Flag, RotateCcw } from "lucide-react";

export default function PlayBotPage() {
  const [fen, setFen] = useState("start");
  const gameRef = useRef(new Chess());
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState("Connecting to server...");
  const [depth, setDepth] = useState(10);
  const [evaluation, setEvaluation] = useState<number>(0);
  const [winChance, setWinChance] = useState<number>(50);
  const [mounted, setMounted] = useState(false);
  const [moveFrom, setMoveFrom] = useState<string | null>(null);
  const [optionSquares, setOptionSquares] = useState<any>({});

  useEffect(() => {
    setMounted(true);
    const socket = new WebSocket(`${(process.env.NEXT_PUBLIC_WS_URL || "ws://127.0.0.1:8000")}/ws/play/bot/`);
    wsRef.current = socket;

    socket.onopen = () => {
      setStatus("Connected. Your turn (White)!");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "game_state" || data.type === "move") {
        const newGame = new Chess();
        newGame.load(data.fen);
        setFen(data.fen);
        gameRef.current = newGame;

        if (data.eval !== undefined) {
          setEvaluation(data.eval);
          setWinChance(data.winChance ?? 50);
        }
        if (data.type === "move" && data.turn === "w") {
          setStatus("Your turn!");
        }
      } else if (data.type === "info") {
        setStatus(data.message);
      } else if (data.type === "error") {
        setStatus(`Error: ${data.message}`);
      } else if (data.type === "game_over") {
        setStatus(`Game Over: ${data.reason} (${data.result})`);
      }
    };

    socket.onerror = () => setStatus("Connection error. Is the backend running?");

    return () => {
      socket.close();
    };
  }, []);

  const onDrop = useCallback((sourceSquare: string, targetSquare: string): boolean => {
    const socket = wsRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      setStatus("Not connected to server!");
      return false;
    }

    const gameCopy = new Chess(gameRef.current.fen());

    try {
      const move = gameCopy.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
      if (!move) return false;

      // Optimistic update — snap piece immediately
      setFen(gameCopy.fen());
      gameRef.current = gameCopy;
      setStatus("Engine thinking...");
      setMoveFrom(null);
      setOptionSquares({});

      socket.send(JSON.stringify({ move: move.lan, depth }));
      return true;
    } catch {
      return false;
    }
  }, [depth]);

  function getMoveOptions(square: string) {
    const moves = gameRef.current.moves({
      square: square as any,
      verbose: true,
    });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares: any = {};
    moves.map((move: any) => {
      newSquares[move.to] = {
        background:
          gameRef.current.get(move.to as any) &&
          gameRef.current.get(move.to as any).color !== gameRef.current.get(square as any).color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
    return true;
  }

  function onSquareClick(square: string) {
    const socket = wsRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }

    // reset options if click on empty square and nothing selected
    if (!moveFrom) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) setMoveFrom(square);
      return;
    }

    // click on another piece to change selection
    const piece = gameRef.current.get(square as any);
    if (piece && piece.color === gameRef.current.turn()) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) setMoveFrom(square);
      else setMoveFrom(null);
      return;
    }

    // try to move
    const gameCopy = new Chess(gameRef.current.fen());
    try {
      const move = gameCopy.move({
        from: moveFrom,
        to: square,
        promotion: "q",
      });

      if (move) {
        setFen(gameCopy.fen());
        gameRef.current = gameCopy;
        setStatus("Engine thinking...");
        setMoveFrom(null);
        setOptionSquares({});

        socket.send(JSON.stringify({ move: move.lan, depth }));
      } else {
        setMoveFrom(null);
        setOptionSquares({});
      }
    } catch {
      setMoveFrom(null);
      setOptionSquares({});
    }
  }

  const visualEval = Math.max(-10, Math.min(10, evaluation));
  const whiteHeight = 50 + visualEval * 5;

  return (
    <div className="h-full flex flex-col lg:flex-row gap-8">
      {/* Left side: Board */}
      <div className="flex-1 flex gap-4 lg:justify-end">
        {/* Eval bar */}
        <div className="w-8 h-[600px] bg-zinc-900 rounded-lg overflow-hidden flex flex-col relative border border-zinc-800">
          <div className="w-full bg-zinc-800 transition-all duration-500" style={{ height: `${100 - whiteHeight}%` }} />
          <div className="w-full bg-white transition-all duration-500" style={{ height: `${whiteHeight}%` }} />
          <span className={`absolute w-full text-center text-xs font-bold top-1/2 -translate-y-1/2 z-10 mix-blend-difference ${evaluation > 0 ? "text-black" : "text-white"}`}>
            {evaluation > 0 ? "+" : ""}{evaluation.toFixed(1)}
          </span>
        </div>

        {/* Chessboard — rendered only on client */}
        <div className="w-[600px] max-w-full">
          {mounted ? (
            <CustomChessboard
              fen={fen}
              onSquareClick={onSquareClick}
              moveFrom={moveFrom}
              optionSquares={optionSquares}
            />
          ) : (
            <div className="w-[600px] h-[600px] bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800">
              <span className="text-zinc-500 font-mono">Loading board...</span>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Controls */}
      <div className="lg:w-[350px] flex flex-col gap-6 lg:justify-start">
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Chess Engine</h2>
              <p className="text-zinc-400 text-sm">{winChance.toFixed(1)}% Win Chance</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-sm font-semibold text-zinc-300 block mb-2">Bot Difficulty (Depth: {depth})</label>
            <input
              type="range"
              min="1"
              max="18"
              value={depth}
              onChange={(e) => setDepth(parseInt(e.target.value))}
              className="w-full accent-white"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-1">
              <span>Novice</span>
              <span>Grandmaster</span>
            </div>
          </div>

          <div className="bg-black rounded-lg p-4 mb-6 border border-zinc-800 flex items-center justify-center text-center">
            <span className="font-medium text-sm text-zinc-300">{status}</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-white text-black font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Restart
            </button>
            <button className="flex-1 bg-red-500/10 text-red-500 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors">
              <Flag className="w-4 h-4" /> Resign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
