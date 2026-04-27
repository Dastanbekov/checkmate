import { useRef, useCallback } from "react";

/**
 * useChessSound — plays move and capture sounds for classic chess.
 * Audio files must be in /public/sounds/.
 */
export function useChessSound() {
  const moveAudio = useRef<HTMLAudioElement | null>(null);
  const captureAudio = useRef<HTMLAudioElement | null>(null);

  const preload = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!moveAudio.current) {
      moveAudio.current = new Audio("/sounds/move-self.mp3");
      moveAudio.current.preload = "auto";
      moveAudio.current.volume = 0.6;
    }
    if (!captureAudio.current) {
      captureAudio.current = new Audio("/sounds/capture.mp3");
      captureAudio.current.preload = "auto";
      captureAudio.current.volume = 0.6;
    }
  }, []);

  const playMove = useCallback(() => {
    preload();
    if (moveAudio.current) {
      moveAudio.current.currentTime = 0;
      moveAudio.current.play().catch(() => {}); // Ignore autoplay errors
    }
  }, [preload]);

  const playCapture = useCallback(() => {
    preload();
    if (captureAudio.current) {
      captureAudio.current.currentTime = 0;
      captureAudio.current.play().catch(() => {});
    }
  }, [preload]);

  return { playMove, playCapture };
}
