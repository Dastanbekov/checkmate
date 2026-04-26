"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ReactMarkdown from "react-markdown";
import dynamic from "next/dynamic";
import { BrainCircuit, Loader2 } from "lucide-react";

const Chessboard = dynamic(() => import("react-chessboard").then((mod) => mod.Chessboard), { ssr: false });

export default function AnalyzerPage() {
  const { user } = useAuth();
  const [pgn, setPgn] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!pgn.trim()) return;
    
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/analyzer/analyze/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pgn }),
      });

      if (!res.ok) {
        throw new Error("Failed to analyze. Check your PGN or login status.");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black">AI Game Analyzer</h1>
      <p className="text-zinc-400">Paste your PGN and let our Groq-powered AI coach analyze your game.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Left Side: Input & Board */}
        <div className="space-y-6">
           <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
             <label className="block text-sm font-semibold text-zinc-300 mb-2">Paste PGN</label>
             <textarea 
               value={pgn}
               onChange={(e) => setPgn(e.target.value)}
               className="w-full h-32 bg-black border border-zinc-700 rounded-lg p-3 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-white/30 font-mono"
               placeholder="[Event &quot;FIDE World Cup 2023&quot;]..."
             />
             <button 
               onClick={handleAnalyze}
               disabled={loading || !pgn}
               className="w-full mt-4 bg-white text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50"
             >
               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5" />}
               {loading ? "Analyzing..." : "Analyze Game"}
             </button>
             {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
           </div>

           <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center min-h-[400px]">
             {result ? (
               <div className="w-full max-w-[400px]">
                 <Chessboard 
                   position={result.final_fen} 
                   boardWidth={400}
                   customDarkSquareStyle={{ backgroundColor: "#3f3f46" }}
                   customLightSquareStyle={{ backgroundColor: "#d4d4d8" }}
                 />
                 <p className="text-center text-zinc-500 mt-4 text-sm font-mono truncate">{result.final_fen}</p>
               </div>
             ) : (
               <p className="text-zinc-500 font-mono">Chessboard Viewer</p>
             )}
           </div>
        </div>

        {/* Right Side: Analysis Output */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col h-[calc(100vh-12rem)]">
          <h3 className="text-xl font-bold mb-4 border-b border-zinc-800 pb-4 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-zinc-400" />
            Coach's Analysis
          </h3>
          <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
            {result ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{result.analysis}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-500 text-sm text-center">
                Submit a PGN to generate a detailed <br/> move-by-move AI analysis.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
