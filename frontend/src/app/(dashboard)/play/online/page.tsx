"use client";
import { WS_URL } from '@/lib/api';

import { useState, useEffect, useRef, useCallback } from "react";
import { Chess } from "chess.js";
import { CustomChessboard } from "@/components/ui/custom-chessboard";
import { Flag, Loader2, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useChessSound } from "@/hooks/useChessSound";

export default function OnlinePlayPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState("Idle");
  const [gameState, setGameState] = useState<"idle" | "searching" | "playing" | "game_over">("idle");
  const [fen, setFen] = useState("start");
  const gameRef = useRef(new Chess());
  const matchWsRef = useRef<WebSocket | null>(null);
  const gameWsRef = useRef<WebSocket | null>(null);
  const [playerColor, setPlayerColor] = useState<"w" | "b">("w");
  const [roomId, setRoomId] = useState<string | null>(null);
  
  const [moveFrom, setMoveFrom] = useState<string | null>(null);
  const [optionSquares, setOptionSquares] = useState<any>({});
  const { playMove, playCapture } = useChessSound();

  useEffect(() => {
    setMounted(true);
    return () => {
      matchWsRef.current?.close();
      gameWsRef.current?.close();
    };
  }, []);

  const findMatch = () => {
    if (matchWsRef.current) matchWsRef.current.close();
    
    setGameState("searching");
    setStatus("Connecting to matchmaking...");
    
    const token = localStorage.getItem("token") || "";
    const ws = new WebSocket(`${WS_URL}/ws/play/matchmaking/?token=${token}`);
    matchWsRef.current = ws;

    ws.onopen = () => {
      setStatus("Waiting for another player...");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "info") {
        setStatus(data.message);
      } else if (data.type === "match_found") {
        setRoomId(data.room_id);
        setPlayerColor(data.color);
        setStatus("Match found! Joining game...");
        ws.close();
        connectToGame(data.room_id, data.color);
      }
    };

    ws.onerror = () => {
      setStatus("Matchmaking error.");
      setGameState("idle");
    };
  };

  const connectToGame = (room: string, color: string) => {
    const ws = new WebSocket(`${WS_URL}/ws/play/online/${room}/`);
    gameWsRef.current = ws;

    ws.onopen = () => {
      setGameState("playing");
      setStatus(color === 'w' ? "Your turn (White)" : "Waiting for opponent (Black)");
      
      const token = localStorage.getItem("token");
      if (token) {
        ws.send(JSON.stringify({
          type: "authenticate",
          token: token,
          color: color
        }));
      }
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "game_state" || data.type === "move") {
        const oldPieceCount = gameRef.current.board().flat().filter((p) => p !== null).length;
        
        const newGame = new Chess();
        newGame.load(data.fen);
        setFen(data.fen);
        gameRef.current = newGame;
        
        const newPieceCount = newGame.board().flat().filter((p) => p !== null).length;

        if (data.type === "move") {
           setStatus(data.turn === color ? "Your turn!" : "Opponent's turn");
           if (data.turn === color) {
             if (newPieceCount < oldPieceCount) playCapture();
             else playMove();
           }
        }
      } else if (data.type === "info") {
        setStatus(data.message);
      } else if (data.type === "error") {
        setStatus(`Error: ${data.message}`);
      } else if (data.type === "game_over") {
        setStatus(`Game Over: ${data.reason} (${data.result})`);
        setGameState("game_over");
      }
    };
  };

  const onDrop = useCallback((sourceSquare: string, targetSquare: string): boolean => {
    if (gameState !== "playing") return false;
    
    const socket = gameWsRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return false;
    
    const gameCopy = new Chess(gameRef.current.fen());
    
    // Check if it's our turn
    if (gameCopy.turn() !== playerColor) {
      return false;
    }

    try {
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", 
      });

      if (!move) return false;

      if (move.captured) playCapture();
      else playMove();

      // Update local state immediately for snappy UI
      setFen(gameCopy.fen());
      gameRef.current = gameCopy;
      setStatus("Sending move...");
      setMoveFrom(null);
      setOptionSquares({});

      // Send to backend
      socket.send(JSON.stringify({ 
        move: move.lan 
      }));
      
      return true;
    } catch {
      return false;
    }
  }, [gameState, playerColor]);

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
          gameRef.current!.get(move.to as any) &&
          gameRef.current!.get(move.to as any)!.color !== gameRef.current!.get(square as any)!.color
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
    if (gameState !== "playing") return;
    
    const socket = gameWsRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    
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
    if (gameCopy.turn() !== playerColor) return;

    try {
      const move = gameCopy.move({
        from: moveFrom,
        to: square,
        promotion: "q",
      });

      if (move) {
        if (move.captured) playCapture();
        else playMove();

        setFen(gameCopy.fen());
        gameRef.current = gameCopy;
        setStatus("Sending move...");
        setMoveFrom(null);
        setOptionSquares({});

        socket.send(JSON.stringify({ move: move.lan }));
      } else {
        setMoveFrom(null);
        setOptionSquares({});
      }
    } catch {
      setMoveFrom(null);
      setOptionSquares({});
    }
  }

  if (!mounted) return <div className="h-full flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex flex-col gap-4">
      {/* Page header */}
      <div>
        <h1 className="text-2xl lg:text-4xl font-black">Play Online</h1>
        <p className="text-zinc-400 text-sm mt-1">Match with opponents from across the globe.</p>
      </div>

      {/* Game area */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">

        {/* Board area */}
        <div className="flex-1 flex justify-center lg:justify-end">
          {gameState === "idle" || gameState === "searching" ? (
            <div className="w-full max-w-[min(560px,calc(100vw-2rem))] aspect-square bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col items-center justify-center px-6">
              <Users className="w-12 h-12 lg:w-16 lg:h-16 text-zinc-600 mb-4 lg:mb-6" />
              <h2 className="text-xl lg:text-2xl font-bold mb-2 text-center">Play against the world</h2>
              <p className="text-zinc-500 mb-6 lg:mb-8 text-center text-sm max-w-xs">Match with opponents of similar skill level from across the globe.</p>

              <button
                onClick={findMatch}
                disabled={gameState === "searching"}
                className="bg-white text-black font-bold py-3.5 px-10 rounded-full flex items-center justify-center gap-3 hover:bg-gray-200 transition-transform active:scale-95 disabled:opacity-50 text-sm"
              >
                {gameState === "searching" ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Searching...</>
                ) : (
                  "Find Match"
                )}
              </button>
              <p className="text-zinc-500 text-xs mt-5 font-mono text-center">{status}</p>
            </div>
          ) : (
            <div className="w-full max-w-[min(560px,calc(100vw-2rem))] lg:w-[560px]">
              <CustomChessboard
                fen={fen}
                onSquareClick={onSquareClick}
                moveFrom={moveFrom}
                optionSquares={optionSquares}
                boardOrientation={playerColor === 'w' ? 'white' : 'black'}
              />
              {/* Status under board — mobile only */}
              <div className="lg:hidden mt-3 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-center">
                <span className="text-sm text-zinc-300 font-medium">{status}</span>
              </div>
            </div>
          )}
        </div>

        {/* Controls panel — only when playing */}
        {(gameState === "playing" || gameState === "game_over") && (
          <div className="lg:w-[300px] flex flex-col gap-4 shrink-0">
            <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold">Online Opponent</h2>
                  <p className="text-zinc-400 text-xs">ELO ~1200</p>
                </div>
              </div>

              {/* Status — desktop only */}
              <div className="hidden lg:flex bg-black rounded-lg px-4 py-3 mb-5 border border-zinc-800 items-center justify-center text-center">
                <span className="font-medium text-sm text-zinc-300">{status}</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setGameState("idle")}
                  className="flex-1 bg-white text-black font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors text-sm"
                >
                  New Game
                </button>
                <button className="flex-1 bg-red-500/10 text-red-500 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors text-sm">
                  <Flag className="w-4 h-4" /> Resign
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
