"use client";

import { useState, useEffect, useCallback } from "react";
import { CSGOChess, Cell } from "@/game/csgo-engine";
import { Shield, Target, Bomb, Cloud, Coins, Crosshair } from "lucide-react";

export default function CSGOChessPage() {
  const [game, setGame] = useState<CSGOChess | null>(null);
  const [selectedCell, setSelectedCell] = useState<{x: number, y: number} | null>(null);
  const [actionType, setActionType] = useState<"move" | "shoot" | "smoke">("move");
  
  // Force re-render hack
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setGame(new CSGOChess());
  }, []);

  const handleCellClick = (x: number, y: number) => {
    if (!game || game.gameOver || game.turn !== 'ct') return;

    if (!selectedCell) {
       // Select our piece
       const cell = game.getCell(x, y);
       if (cell?.piece && cell.piece.team === 'ct') {
         setSelectedCell({x, y});
       }
       return;
    }

    // Try to perform action
    let success = false;
    if (actionType === "move") {
      success = game.movePiece(selectedCell.x, selectedCell.y, x, y);
    } else if (actionType === "shoot") {
      success = game.shootPiece(selectedCell.x, selectedCell.y, x, y);
    } else if (actionType === "smoke") {
      success = game.throwSmoke(selectedCell.x, selectedCell.y, x, y);
    }

    if (success) {
      setSelectedCell(null);
      setActionType("move");
      setTick(t => t + 1);
      
      // Trigger bot turn
      setTimeout(() => {
         game.playBotTurn();
         setTick(t => t + 1);
      }, 1000);
    } else {
      // If failed, maybe we clicked another of our pieces to select it instead
      const cell = game.getCell(x, y);
      if (cell?.piece && cell.piece.team === 'ct') {
         setSelectedCell({x, y});
      } else {
         setSelectedCell(null); // deselect
      }
    }
  };

  if (!game) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      {/* Left side: Board */}
      <div className="flex-1 flex flex-col items-center lg:items-end justify-center">
        
        {/* Top HUD (Terrorists) */}
        <div className="w-[600px] mb-4 flex justify-between items-center px-4 bg-orange-500/10 border border-orange-500/20 rounded-lg py-2">
           <div className="flex items-center gap-2 text-orange-400 font-bold">
             <Target className="w-5 h-5" /> Terrorists (Bot)
           </div>
           <div className="flex items-center gap-2 text-yellow-400 font-mono">
             <Coins className="w-4 h-4" /> ${game.tMoney}
           </div>
        </div>

        {/* Board */}
        <div className="w-[600px] aspect-square bg-zinc-900 border-4 border-zinc-800 grid grid-cols-8 grid-rows-8 relative">
          {game.board.map((row, y) => (
            row.map((cell, x) => {
              const isDark = (x + y) % 2 === 1;
              const isSelected = selectedCell?.x === x && selectedCell?.y === y;
              
              // Determine if it's a valid target based on selected action
              let isValidTarget = false;
              if (selectedCell && game.turn === 'ct') {
                 if (actionType === "move") isValidTarget = game.canMove(selectedCell.x, selectedCell.y, x, y);
                 if (actionType === "shoot") isValidTarget = game.canShoot(selectedCell.x, selectedCell.y, x, y);
                 if (actionType === "smoke") isValidTarget = game.getCell(selectedCell.x, selectedCell.y)?.piece?.hasGrenade || false; // Approximation
              }

              return (
                <div 
                  key={`${x}-${y}`} 
                  onClick={() => handleCellClick(x, y)}
                  className={`
                    relative flex items-center justify-center cursor-pointer transition-colors
                    ${isDark ? 'bg-zinc-800' : 'bg-zinc-700'}
                    ${isSelected ? 'ring-4 ring-inset ring-white z-10' : ''}
                    ${isValidTarget && actionType === 'shoot' ? 'ring-4 ring-inset ring-red-500 z-10' : ''}
                    ${isValidTarget && actionType === 'move' ? 'ring-4 ring-inset ring-blue-500 z-10' : ''}
                  `}
                >
                  {/* Smoke Effect */}
                  {cell.smokeDuration > 0 && (
                    <div className="absolute inset-0 bg-gray-400/80 backdrop-blur-md z-20 flex items-center justify-center pointer-events-none">
                       <Cloud className="w-8 h-8 text-white/50" />
                    </div>
                  )}

                  {/* Piece */}
                  {cell.piece && (
                    <div className="relative z-30 flex flex-col items-center">
                       <div className={`text-3xl font-black ${cell.piece.team === 'ct' ? 'text-blue-400' : 'text-orange-400'}`}>
                         {cell.piece.type === 'king' && '👑'}
                         {cell.piece.type === 'queen' && '🎯'}
                         {cell.piece.type === 'pawn' && '🔫'}
                         {cell.piece.type === 'rook' && '💣'}
                         {cell.piece.type === 'knight' && '🔪'}
                         {cell.piece.type === 'bishop' && '🔭'}
                       </div>
                       
                       {/* Healthbar */}
                       <div className="absolute -bottom-3 w-10 h-1.5 bg-black rounded-full overflow-hidden border border-zinc-900">
                          <div 
                            className={`h-full transition-all ${cell.piece.hp > cell.piece.maxHp/2 ? 'bg-green-500' : 'bg-red-500'}`} 
                            style={{ width: `${Math.max(0, (cell.piece.hp / cell.piece.maxHp) * 100)}%` }}
                          />
                       </div>
                    </div>
                  )}
                </div>
              );
            })
          ))}
          
          {game.gameOver && (
            <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center">
              <h2 className="text-6xl font-black text-white mb-4">
                {game.winner === 'ct' ? 'CT WIN' : 'T WIN'}
              </h2>
              <button 
                onClick={() => { setGame(new CSGOChess()); setSelectedCell(null); }}
                className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors"
              >
                Play Again
              </button>
            </div>
          )}
        </div>

        {/* Bottom HUD (Counter-Terrorists) */}
        <div className="w-[600px] mt-4 flex justify-between items-center px-4 bg-blue-500/10 border border-blue-500/20 rounded-lg py-2">
           <div className="flex items-center gap-2 text-blue-400 font-bold">
             <Shield className="w-5 h-5" /> Counter-Terrorists (You)
           </div>
           <div className="flex items-center gap-2 text-green-400 font-mono">
             <Coins className="w-4 h-4" /> ${game.ctMoney}
           </div>
        </div>

      </div>

      {/* Right side: Actions / Store */}
      <div className="w-full lg:w-[350px] flex flex-col gap-6 lg:justify-center">
         <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <h3 className="text-xl font-bold mb-4">Action Panel</h3>
            <p className="text-zinc-400 text-sm mb-6">Select a piece on the board, then choose an action type below before clicking the target cell.</p>

            <div className="grid grid-cols-3 gap-2 mb-6">
              <button 
                onClick={() => setActionType("move")}
                className={`py-3 flex flex-col items-center gap-2 rounded-lg border transition-colors ${actionType === 'move' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'}`}
              >
                <div className="text-xl">🏃‍♂️</div>
                <span className="text-xs font-bold uppercase">Move</span>
              </button>
              
              <button 
                onClick={() => setActionType("shoot")}
                className={`py-3 flex flex-col items-center gap-2 rounded-lg border transition-colors ${actionType === 'shoot' ? 'bg-red-600 border-red-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'}`}
              >
                <Crosshair className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">Shoot</span>
              </button>
              
              <button 
                onClick={() => setActionType("smoke")}
                className={`py-3 flex flex-col items-center gap-2 rounded-lg border transition-colors ${actionType === 'smoke' ? 'bg-gray-500 border-gray-400 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'}`}
              >
                <Cloud className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">Smoke</span>
              </button>
            </div>

            <div className="bg-black rounded-lg p-4 text-center border border-zinc-800">
               <span className="font-medium text-sm text-zinc-300">
                 {game.turn === 'ct' ? "Your Turn" : "Bot is thinking..."}
               </span>
            </div>
         </div>
         
         {/* Store Placeholder */}
         <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 opacity-50">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Coins className="w-5 h-5 text-yellow-500"/> Buy Menu</h3>
            <p className="text-zinc-500 text-sm italic">Economy purchases coming soon...</p>
         </div>
      </div>
    </div>
  );
}
