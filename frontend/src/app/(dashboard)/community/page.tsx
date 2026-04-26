export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black">Communities</h1>
          <p className="text-zinc-400 mt-2">Join clubs, find sparring partners, and participate in online tournaments.</p>
        </div>
        <button className="bg-white text-black font-bold px-6 py-2.5 rounded-full hover:bg-gray-200 transition-colors">
          Create Club
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[
          { name: "Sicilian Defense Masters", members: 1240, active: 42 },
          { name: "Beginner Tactics Daily", members: 8530, active: 312 },
          { name: "Endgame Wizards", members: 530, active: 18 },
          { name: "Speed Chess Addicts", members: 15420, active: 890 },
          { name: "Fischer Random Club", members: 2100, active: 55 },
          { name: "Central Asian Kings", members: 890, active: 112 },
        ].map((club, i) => (
          <div key={i} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 hover:border-zinc-600 transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center text-xl">
                ♟️
              </div>
              <span className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded-md">
                Public
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{club.name}</h3>
            <div className="flex gap-4 text-sm text-zinc-500">
              <span>👥 {club.members.toLocaleString()} members</span>
              <span>🟢 {club.active} online</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
