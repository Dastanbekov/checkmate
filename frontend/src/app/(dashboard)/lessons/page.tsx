"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { CustomChessboard } from "@/components/ui/custom-chessboard";
import { Chess } from "chess.js";
import { BookOpen, Trophy, CheckCircle, XCircle, ChevronRight, Lightbulb } from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  description: string;
  initial_fen: string;
  solution_pgn: string;
  difficulty: string;
}

const DIFF_COLORS: Record<string, string> = {
  Beginner: "bg-green-500/20 text-green-400 border-green-500/30",
  Intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Advanced: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function LessonsPage() {
  const [mounted, setMounted] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selected, setSelected] = useState<Lesson | null>(null);
  const [fen, setFen] = useState("start");
  const [result, setResult] = useState<"idle" | "correct" | "wrong">("idle");
  const [showHint, setShowHint] = useState(false);
  const [moveFrom, setMoveFrom] = useState<string | null>(null);
  const [optionSquares, setOptionSquares] = useState<any>({});

  // Refs to avoid stale closures in onDrop
  const gameRef = useRef<Chess | null>(null);
  const selectedRef = useRef<Lesson | null>(null);

  useEffect(() => {
    setMounted(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/lessons/`)
      .then((r) => r.json())
      .then(setLessons);
  }, []);

  const openLesson = (lesson: Lesson) => {
    const g = new Chess(lesson.initial_fen);
    gameRef.current = g;
    selectedRef.current = lesson;
    setFen(lesson.initial_fen);
    setSelected(lesson);
    setResult("idle");
    setShowHint(false);
  };

  const onDrop = useCallback((source: string, target: string): boolean => {
    const g = gameRef.current;
    const s = selectedRef.current;
    if (!g || !s) return false;

    try {
      const move = g.move({ from: source, to: target, promotion: "q" });
      if (!move) return false;

      setFen(g.fen());

      if (g.isCheckmate() || move.san === s.solution_pgn || move.san.replace("#", "").replace("+", "") === s.solution_pgn.replace("#", "").replace("+", "")) {
        setResult("correct");
      } else {
        setResult("wrong");
      }
      return true;
    } catch {
      return false;
    }
  }, []);

  function getMoveOptions(square: string) {
    const g = gameRef.current;
    if (!g) return false;

    const moves = g.moves({
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
    const g = gameRef.current;
    const s = selectedRef.current;
    if (!g || !s) return;

    // reset options if click on empty square and nothing selected
    if (!moveFrom) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) setMoveFrom(square);
      return;
    }

    // click on another piece to change selection
    const piece = g.get(square as any);
    if (piece && piece.color === g.turn()) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) setMoveFrom(square);
      else setMoveFrom(null);
      return;
    }

    try {
      const move = g.move({ from: moveFrom, to: square, promotion: "q" });
      if (!move) {
        setMoveFrom(null);
        setOptionSquares({});
        return;
      }

      setFen(g.fen());
      setShowHint(false);
      setMoveFrom(null);
      setOptionSquares({});

      if (move.lan === s.solution_pgn) {
        setResult("correct");
      } else {
        setResult("wrong");
        setTimeout(() => {
          g.undo();
          setFen(g.fen());
          setResult("idle");
        }, 1000);
      }
    } catch {
      setMoveFrom(null);
      setOptionSquares({});
    }
  }

  const resetLesson = () => {
    if (!selected) return;
    openLesson(selected);
  };

  return (
    <div className="flex h-full gap-8">
      {/* Lesson List */}
      <div className="w-[300px] flex flex-col shrink-0">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-zinc-400" />
          <h1 className="text-2xl font-black">Lessons</h1>
        </div>
        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
          {lessons.map((l) => (
            <button
              key={l.id}
              onClick={() => openLesson(l)}
              className={`w-full text-left bg-zinc-900 border rounded-xl p-4 hover:border-zinc-600 transition-colors ${selected?.id === l.id ? "border-white" : "border-zinc-800"}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-bold text-sm text-white leading-snug">{l.title}</span>
                <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${DIFF_COLORS[l.difficulty] || "bg-zinc-700 text-zinc-400 border-zinc-600"}`}>
                {l.difficulty}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Board + Info */}
      <div className="flex-1 flex gap-8">
        {selected && mounted ? (
          <>
            <div className="flex flex-col items-center">
              <CustomChessboard
                fen={fen}
                onSquareClick={onSquareClick}
                moveFrom={moveFrom}
                optionSquares={optionSquares}
              />

              {result !== "idle" && (
                <div className={`mt-4 w-[500px] rounded-lg p-4 flex items-center gap-3 ${result === "correct" ? "bg-green-500/20 border border-green-500/50" : "bg-red-500/20 border border-red-500/50"}`}>
                  {result === "correct" ? (
                    <><CheckCircle className="w-5 h-5 text-green-400" /><span className="text-green-300 font-bold">Correct! Well done!</span></>
                  ) : (
                    <><XCircle className="w-5 h-5 text-red-400" /><span className="text-red-300 font-bold">Not quite. Try again!</span></>
                  )}
                  {result === "wrong" && (
                    <button onClick={resetLesson} className="ml-auto text-xs font-semibold text-zinc-400 hover:text-white transition-colors">Reset</button>
                  )}
                </div>
              )}
            </div>

            <div className="w-[260px] flex flex-col gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${DIFF_COLORS[selected.difficulty]}`}>
                  {selected.difficulty}
                </span>
                <h2 className="text-xl font-bold mt-3 mb-2">{selected.title}</h2>
                <p className="text-zinc-400 text-sm leading-relaxed">{selected.description}</p>
              </div>

              <button
                onClick={() => setShowHint(!showHint)}
                className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 flex items-center gap-3 hover:border-zinc-500 transition-colors text-left"
              >
                <Lightbulb className="w-5 h-5 text-yellow-400 shrink-0" />
                <div>
                  <span className="text-sm font-bold">Show Hint</span>
                  {showHint && <p className="text-xs text-yellow-400 mt-1 font-mono">{selected.solution_pgn}</p>}
                </div>
              </button>

              {result === "correct" && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                  <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-green-400 font-bold text-sm">Lesson Complete!</p>
                  <button onClick={() => { setSelected(null); selectedRef.current = null; }} className="text-xs text-zinc-400 hover:text-white mt-2 transition-colors">
                    ← Back to lessons
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 border border-dashed border-zinc-800 rounded-xl">
            <BookOpen className="w-16 h-16 text-zinc-700" />
            <p className="text-zinc-500">Select a lesson from the list to begin</p>
          </div>
        )}
      </div>
    </div>
  );
}
