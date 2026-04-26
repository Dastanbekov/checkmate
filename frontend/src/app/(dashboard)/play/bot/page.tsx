"use client";

import { useState, useEffect, useRef } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { BrainCircuit, Flag, RotateCcw } from "lucide-react";

export default function PlayBotPage() {
  const [mounted, setMounted] = useState(false);
  const [game, setGame] = useState(new Chess());
  const gameRef = useRef(new Chess());
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState("Connecting to server...");
  const [depth, setDepth] = useState(10);
  const [evaluation, setEvaluation] = useState<number>(0); 
  const [winChance, setWinChance] = useState<number>(50);

  useEffect(() => {
    setMounted(true);
    const socket = new WebSocket("ws://127.0.0.1:8000/ws/play/bot/");
    wsRef.current = socket;
    
    socket.onopen = () => {
      setStatus("Connected. Your turn!");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === "game_state" || data.type === "move") {
        const newGame = new Chess();
        newGame.load(data.fen);
        setGame(newGame);
        gameRef.current = newGame;
        
        if (data.eval !== undefined) {
           setEvaluation(data.eval);
           setWinChance(data.winChance);
        }
        
        if (data.type === "move" && data.turn === 'w') {
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

    return () => {
      socket.close();
    };
  }, []);

  function onDrop(sourceSquare: string, targetSquare: string) {
    console.log("onDrop triggered:", sourceSquare, "->", targetSquare);
    
    const socket = wsRef.current;
    if (!socket) {
      console.error("WebSocket is null");
      return false;
    }
    
    console.log("WebSocket readyState:", socket.readyState, " (OPEN = 1)");
    
    if (socket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket not ready. It is in state:", socket.readyState);
      return false;
    }
    
    const gameCopy = new Chess(gameRef.current.fen());
    console.log("Current FEN:", gameCopy.fen());
    
    try {
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", 
      });

      console.log("Move validation result:", move);

      if (move === null) {
         console.warn("Invalid move according to chess.js");
         return false;
      }

      // Update local state immediately
      setGame(gameCopy);
      gameRef.current = gameCopy;
      setStatus("Sending move...");

      const movePayload = { 
        move: move.lan, 
        depth: depth
      };
      console.log("Sending payload:", movePayload);
      
      // Send to backend
      socket.send(JSON.stringify(movePayload));
      
      return true;
    } catch (e) {
      console.error("Exception during move:", e);
      return false;
    }
  }

  const visualEval = Math.max(-10, Math.min(10, evaluation));
  const whiteHeight = 50 + (visualEval * 5);

  if (!mounted) {
     return <div className="h-full flex items-center justify-center">Loading board...</div>;
  }

  return (
    <div className="h-full flex flex-col lg:flex-row gap-8">
      
      {/* Left side: Board */}
      <div className="flex-1 flex gap-4 lg:justify-end">
        {/* Eval bar */}
        <div className="w-8 h-[600px] bg-zinc-900 rounded-lg overflow-hidden flex flex-col relative border border-zinc-800">
           <div className="w-full bg-zinc-800 transition-all duration-500" style={{ height: `${100 - whiteHeight}%` }} />
           <div className="w-full bg-white transition-all duration-500" style={{ height: `${whiteHeight}%` }} />
           
           <span className={`absolute w-full text-center text-xs font-bold top-1/2 -translate-y-1/2 ${evaluation > 0 ? 'text-black' : 'text-white'} z-10 mix-blend-difference`}>
             {evaluation > 0 ? '+' : ''}{evaluation.toFixed(1)}
           </span>
        </div>
        
        {/* Chessboard */}
        <div className="w-[600px] max-w-full">
           <Chessboard 
              position={game.fen()} 
              onPieceDrop={onDrop}
              boardWidth={600}
              customDarkSquareStyle={{ backgroundColor: "#3f3f46" }}
              customLightSquareStyle={{ backgroundColor: "#d4d4d8" }}
              animationDuration={200}
           />
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
              <h2 className="text-xl font-bold">Stockfish 16.1</h2>
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
             <button onClick={() => window.location.reload()} className="flex-1 bg-white text-black font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
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
