export default function GamesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black">My Games</h1>
      <p className="text-zinc-400">View your game history, win rates, and track your Elo progress over time.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h3 className="text-zinc-400 text-sm font-semibold mb-2">Current Elo</h3>
          <p className="text-4xl font-black">1840</p>
          <span className="text-green-400 text-sm font-medium">+15 this week</span>
        </div>
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h3 className="text-zinc-400 text-sm font-semibold mb-2">Games Played</h3>
          <p className="text-4xl font-black">342</p>
          <span className="text-zinc-500 text-sm font-medium">All time</span>
        </div>
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h3 className="text-zinc-400 text-sm font-semibold mb-2">Win Rate</h3>
          <p className="text-4xl font-black">54.2%</p>
          <span className="text-green-400 text-sm font-medium">Above average</span>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Recent Matches</h2>
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
          {/* Mock table */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-sm">
                  {i % 2 === 0 ? "B" : "W"}
                </div>
                <div>
                  <p className="font-semibold">vs GM_Hikaru</p>
                  <p className="text-zinc-500 text-xs">10 min Rapid • 2 hours ago</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${i % 3 === 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {i % 3 === 0 ? "Defeat" : "Victory"}
                </p>
                <p className="text-zinc-500 text-xs">Analyze Match &rarr;</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
