export default function AnalyzerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black">Game Analyzer</h1>
      <p className="text-zinc-400">Analyze your recent games, find mistakes, and discover better moves with our AI engine.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl aspect-square flex items-center justify-center">
          <p className="text-zinc-500 font-mono">Chessboard Viewer Placeholder</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col">
          <h3 className="text-xl font-bold mb-4 border-b border-zinc-800 pb-4">Engine Evaluation</h3>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-zinc-500 text-sm text-center">Load a PGN to see evaluation</p>
          </div>
          <button className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors mt-4">
            Upload PGN
          </button>
        </div>
      </div>
    </div>
  );
}
