import re

path = r'C:\Users\ASUS\Desktop\projects\chess\frontend\src\app\(dashboard)\analyzer\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old = """                <div className="w-full max-w-[400px]">
                  <CustomChessboard 
                    fen={result.final_fen} 
                    onSquareClick={() => {}}
                    moveFrom={null}
                    optionSquares={{}}
                  />
                  <p className="text-center text-zinc-500 mt-4 text-sm font-mono truncate">{result.final_fen}</p>
                </div>"""

new = """                <div className="w-full max-w-[400px]">
                  <CustomChessboard 
                    fen={fenHistory[currentMoveIndex] || result.final_fen} 
                    onSquareClick={() => {}}
                    moveFrom={null}
                    optionSquares={{}}
                  />
                  
                  {fenHistory.length > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-4">
                      <button 
                        onClick={() => setCurrentMoveIndex(0)}
                        disabled={currentMoveIndex === 0}
                        className="p-2 rounded hover:bg-zinc-800 disabled:opacity-50 text-zinc-300"
                      >
                        <SkipBack className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setCurrentMoveIndex(i => Math.max(0, i - 1))}
                        disabled={currentMoveIndex === 0}
                        className="p-2 rounded hover:bg-zinc-800 disabled:opacity-50 text-zinc-300"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="font-mono text-sm text-zinc-400">
                        {currentMoveIndex} / {fenHistory.length - 1}
                      </span>
                      <button 
                        onClick={() => setCurrentMoveIndex(i => Math.min(fenHistory.length - 1, i + 1))}
                        disabled={currentMoveIndex === fenHistory.length - 1}
                        className="p-2 rounded hover:bg-zinc-800 disabled:opacity-50 text-zinc-300"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setCurrentMoveIndex(fenHistory.length - 1)}
                        disabled={currentMoveIndex === fenHistory.length - 1}
                        className="p-2 rounded hover:bg-zinc-800 disabled:opacity-50 text-zinc-300"
                      >
                        <SkipForward className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  <p className="text-center text-zinc-600 mt-4 text-xs font-mono truncate">{fenHistory[currentMoveIndex] || result.final_fen}</p>
                </div>"""

content = content.replace(old, new)
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
