"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Chess } from "chess.js";
import { CustomChessboard } from "@/components/ui/custom-chessboard";
import { Flag, Loader2, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

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
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/play/matchmaking/?token=${token}`);
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
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/play/online/${room}/`);
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
        const newGame = new Chess();
        newGame.load(data.fen);
        setFen(data.fen);
        gameRef.current = newGame;
        
        if (data.type === "move") {
           setStatus(data.turn === color ? "Your turn!" : "Opponent's turn");
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
    <div className="h-full flex flex-col lg:flex-row gap-8">
      {/* Left side: Board */}
      <div className="flex-1 flex gap-4 lg:justify-end">
        {gameState === "idle" || gameState === "searching" ? (
          <div className="w-[600px] aspect-square bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col items-center justify-center">
            <Users className="w-16 h-16 text-zinc-600 mb-6" />
            <h2 className="text-2xl font-bold mb-2">Play against the world</h2>
            <p className="text-zinc-500 mb-8 text-center max-w-sm">Match with opponents of similar skill level from across the globe.</p>
            
            <button 
              onClick={findMatch}
              disabled={gameState === "searching"}
              className="bg-white text-black font-bold py-4 px-12 rounded-full flex items-center justify-center gap-3 hover:bg-gray-200 transition-transform active:scale-95 disabled:opacity-50"
            >
              {gameState === "searching" ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Searching...</>
              ) : (
                "Find Match"
              )}
            </button>
            <p className="text-zinc-500 text-sm mt-6 font-mono">{status}</p>
          </div>
        ) : (
          <div className="w-[600px] max-w-full">
            <CustomChessboard 
              fen={fen} 
              onSquareClick={onSquareClick}
              moveFrom={moveFrom}
              optionSquares={optionSquares}
              boardOrientation={playerColor === 'w' ? 'white' : 'black'}
            />
          </div>
        )}
      </div>

      {/* Right side: Controls */}
      {gameState === "playing" || gameState === "game_over" ? (
        <div className="lg:w-[350px] flex flex-col gap-6 lg:justify-start">
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Online Opponent</h2>
                <p className="text-zinc-400 text-sm">ELO ~1200</p>
              </div>
            </div>
            
            <div className="bg-black rounded-lg p-4 mb-6 border border-zinc-800 flex items-center justify-center text-center">
              <span className="font-medium text-sm text-zinc-300">{status}</span>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setGameState("idle")}
                className="flex-1 bg-white text-black font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
              >
                New Game
              </button>
              <button className="flex-1 bg-red-500/10 text-red-500 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors">
                <Flag className="w-4 h-4" /> Resign
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
