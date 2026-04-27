"use client";
import { API_URL } from '@/lib/api';

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ReactMarkdown from "react-markdown";
import { Chess } from "chess.js";
import { CustomChessboard } from "@/components/ui/custom-chessboard";
import { BrainCircuit, Loader2 } from "lucide-react";

export default function AnalyzerPage() {
  const { user } = useAuth();
  const [pgn, setPgn] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [fenHistory, setFenHistory] = useState<string[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);

  const handleAnalyze = async () => {
    if (!pgn.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/analyzer/analyze/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pgn }),
      });

      if (!res.ok) throw new Error("Failed to analyze. Check your PGN or login status.");

      const data = await res.json();
      setResult(data);

      try {
        const game = new Chess();
        game.loadPgn(pgn);
        const history = game.history();
        const tempGame = new Chess();
        const fens = [tempGame.fen()];
        for (const move of history) {
          tempGame.move(move);
          fens.push(tempGame.fen());
        }
        setFenHistory(fens);
        setCurrentMoveIndex(fens.length - 1);
      } catch (e) {
        setFenHistory([data.final_fen]);
        setCurrentMoveIndex(0);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <h1 className="text-2xl lg:text-4xl font-black">AI Game Analyzer</h1>
        <p className="text-zinc-400 text-sm mt-1">Paste your PGN and let our Groq-powered AI coach analyze your game.</p>
      </div>

      {/* PGN Input */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <label className="block text-sm font-semibold text-zinc-300 mb-2">Paste PGN</label>
        <textarea
          value={pgn}
          onChange={(e) => setPgn(e.target.value)}
          className="w-full h-28 bg-black border border-zinc-700 rounded-lg p-3 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-white/30 font-mono resize-none"
          placeholder={`[Event "FIDE World Cup 2023"]...`}
        />
        <button
          onClick={handleAnalyze}
          disabled={loading || !pgn}
          className="w-full mt-3 bg-white text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5" />}
          {loading ? "Analyzing..." : "Analyze Game"}
        </button>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </div>

      {/* Results — stack on mobile, side by side on desktop */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Board viewer */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col items-center">
            <h3 className="text-sm font-semibold text-zinc-400 mb-3 self-start">Final Position</h3>
            <div className="w-full max-w-[400px]">
              <CustomChessboard
                fen={result.final_fen}
                onSquareClick={() => {}}
                moveFrom={null}
                optionSquares={{}}
              />
            </div>
            <p className="text-center text-zinc-600 mt-3 text-xs font-mono truncate w-full px-2">{result.final_fen}</p>
          </div>

          {/* Analysis output */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col max-h-[500px] lg:max-h-[600px]">
            <h3 className="text-base font-bold mb-4 border-b border-zinc-800 pb-4 flex items-center gap-2 shrink-0">
              <BrainCircuit className="w-5 h-5 text-zinc-400" />
              Coach's Analysis
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{result.analysis}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state before analysis */}
      {!result && (
        <div className="bg-zinc-900 border border-zinc-800 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center">
          <BrainCircuit className="w-10 h-10 text-zinc-700 mb-3" />
          <p className="text-zinc-500 text-sm">
            Submit a PGN above to generate<br />a detailed move-by-move AI analysis.
          </p>
        </div>
      )}
    </div>
  );
}
