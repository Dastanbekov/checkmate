export type Team = "ct" | "t";
export type PieceType = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";

export interface Piece {
  id: string;
  type: PieceType;
  team: Team;
  hp: number;
  maxHp: number;
  hasGrenade: boolean;
}

export interface Cell {
  x: number;
  y: number;
  piece: Piece | null;
  smokeDuration: number;
}

const HP: Record<PieceType, number> = {
  pawn: 20,
  knight: 30,
  bishop: 30,
  rook: 40,
  queen: 50,
  king: 10,
};

const DAMAGE: Record<PieceType, number> = {
  pawn: 15,    // Rifle (Glock/M4)
  knight: 20,  // SMG (MAC-10/UMP)
  bishop: 35,  // Scout / SSG
  rook: 25,    // Shotgun / Grenade launcher
  queen: 45,   // AWP
  king: 10,    // Pistol (desperate last stand)
};

export class CSGOChess {
  board: Cell[][] = [];
  turn: Team = "ct";
  ctMoney: number = 800;
  tMoney: number = 800;
  gameOver: boolean = false;
  winner: Team | null = null;
  turnNumber: number = 0;

  constructor() {
    this.initBoard();
  }

  private uid() {
    return Math.random().toString(36).substr(2, 9);
  }

  private createPiece(type: PieceType, team: Team): Piece {
    return {
      id: this.uid(),
      type,
      team,
      hp: HP[type],
      maxHp: HP[type],
      hasGrenade: type === "pawn" || type === "rook",
    };
  }

  private initBoard() {
    this.board = Array.from({ length: 8 }, (_, y) =>
      Array.from({ length: 8 }, (_, x) => ({ x, y, piece: null, smokeDuration: 0 }))
    );
    this.setupPieces();
  }

  private setupPieces() {
    const order: PieceType[] = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];
    for (let x = 0; x < 8; x++) {
      this.board[0][x].piece = this.createPiece(order[x], "t");
      this.board[1][x].piece = this.createPiece("pawn", "t");
      this.board[6][x].piece = this.createPiece("pawn", "ct");
      this.board[7][x].piece = this.createPiece(order[x], "ct");
    }
  }

  getCell(x: number, y: number): Cell | null {
    if (x >= 0 && x < 8 && y >= 0 && y < 8) return this.board[y][x];
    return null;
  }

  canMove(fx: number, fy: number, tx: number, ty: number): boolean {
    const from = this.getCell(fx, fy);
    if (!from?.piece || from.piece.team !== this.turn) return false;
    const to = this.getCell(tx, ty);
    if (!to || to.piece?.team === this.turn) return false;
    if (to.piece) return false; // can only move to empty; use shoot to kill

    const dx = Math.abs(tx - fx);
    const dy = Math.abs(ty - fy);
    const dir = from.piece.team === "ct" ? -1 : 1;

    if (from.piece.type === "pawn") {
      return dx === 0 && (ty - fy) === dir && dy === 1;
    }
    if (from.piece.type === "king") return dx <= 1 && dy <= 1;
    if (from.piece.type === "knight") return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
    if (from.piece.type === "rook") return (dx === 0 || dy === 0) && (dx + dy) <= 3;
    if (from.piece.type === "bishop") return dx === dy && dx <= 3;
    if (from.piece.type === "queen") return (dx === 0 || dy === 0 || dx === dy) && Math.max(dx, dy) <= 5;
    return false;
  }

  movePiece(fx: number, fy: number, tx: number, ty: number): boolean {
    if (!this.canMove(fx, fy, tx, ty)) return false;
    this.board[ty][tx].piece = this.board[fy][fx].piece;
    this.board[fy][fx].piece = null;
    this.endTurn();
    return true;
  }

  canShoot(fx: number, fy: number, tx: number, ty: number): boolean {
    const attacker = this.getCell(fx, fy)?.piece;
    const target = this.getCell(tx, ty)?.piece;
    if (!attacker || !target) return false;
    if (attacker.team !== this.turn || target.team === this.turn) return false;

    // Check smoke exactly on the target cell
    if ((this.getCell(tx, ty)?.smokeDuration ?? 0) > 0) return false;

    const dx = Math.abs(tx - fx);
    const dy = Math.abs(ty - fy);

    // Line of sight checker
    const isPathClear = () => {
      const stepX = tx === fx ? 0 : Math.sign(tx - fx);
      const stepY = ty === fy ? 0 : Math.sign(ty - fy);
      let cx = fx + stepX;
      let cy = fy + stepY;
      while (cx !== tx || cy !== ty) {
        if (this.getCell(cx, cy)?.piece) return false;
        if ((this.getCell(cx, cy)?.smokeDuration ?? 0) > 0) return false;
        cx += stepX;
        cy += stepY;
      }
      return true;
    };

    if (attacker.type === "pawn") return (dx === 0 || dy === 0) && (dx + dy) <= 2 && isPathClear();
    if (attacker.type === "queen") return (dx === 0 || dy === 0 || dx === dy) && isPathClear(); // AWP - straight lines, blocked by pieces/smoke
    if (attacker.type === "bishop") return (dx === 0 || dy === 0 || dx === dy) && dx <= 4 && dy <= 4 && isPathClear(); // Scout
    if (attacker.type === "knight") return dx <= 3 && dy <= 3; // SMG (spray, ignores line of sight slightly but short range)
    if (attacker.type === "rook") return (dx === 0 || dy === 0) && (dx + dy) <= 3 && isPathClear(); // Shotgun
    return dx <= 2 && dy <= 2; // King (pistol)
  }

  shootPiece(fx: number, fy: number, tx: number, ty: number): boolean {
    if (!this.canShoot(fx, fy, tx, ty)) return false;

    const attacker = this.board[fy][fx].piece!;
    const targetCell = this.board[ty][tx];
    const target = targetCell.piece!;

    target.hp -= DAMAGE[attacker.type];

    if (target.hp <= 0) {
      if (target.type === "king") {
        this.gameOver = true;
        this.winner = this.turn;
      }
      targetCell.piece = null;
      if (this.turn === "ct") this.ctMoney += 300;
      else this.tMoney += 300;
    }

    this.endTurn();
    return true;
  }

  throwSmoke(fx: number, fy: number, tx: number, ty: number): boolean {
    const attacker = this.getCell(fx, fy)?.piece;
    if (!attacker || !attacker.hasGrenade || attacker.team !== this.turn) return false;

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const cell = this.getCell(tx + dx, ty + dy);
        if (cell) cell.smokeDuration = 4;
      }
    }
    attacker.hasGrenade = false;
    this.endTurn();
    return true;
  }

  private endTurn() {
    this.turnNumber++;
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (this.board[y][x].smokeDuration > 0) {
          this.board[y][x].smokeDuration -= 0.5;
        }
      }
    }
    this.turn = this.turn === "ct" ? "t" : "ct";
  }

  // Simple greedy bot for T side
  playBotTurn(): void {
    if (this.gameOver || this.turn !== "t") return;

    // Priority 1: Kill the king if possible
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (this.board[y][x].piece?.team === "t") {
          for (let ey = 0; ey < 8; ey++) {
            for (let ex = 0; ex < 8; ex++) {
              if (this.canShoot(x, y, ex, ey)) {
                const t = this.board[ey][ex].piece!;
                if (t.type === "king") { this.shootPiece(x, y, ex, ey); return; }
              }
            }
          }
        }
      }
    }

    // Priority 2: Shoot any low-HP enemy
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (this.board[y][x].piece?.team === "t") {
          for (let ey = 0; ey < 8; ey++) {
            for (let ex = 0; ex < 8; ex++) {
              if (this.canShoot(x, y, ex, ey)) {
                const t = this.board[ey][ex].piece!;
                if (t.hp <= 20) { this.shootPiece(x, y, ex, ey); return; }
              }
            }
          }
        }
      }
    }

    // Priority 3: Shoot any enemy
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (this.board[y][x].piece?.team === "t") {
          for (let ey = 0; ey < 8; ey++) {
            for (let ex = 0; ex < 8; ex++) {
              if (this.canShoot(x, y, ex, ey)) { this.shootPiece(x, y, ex, ey); return; }
            }
          }
        }
      }
    }

    // Priority 4: Move forward
    const pieces: { x: number; y: number }[] = [];
    for (let y = 0; y < 8; y++)
      for (let x = 0; x < 8; x++)
        if (this.board[y][x].piece?.team === "t") pieces.push({ x, y });

    pieces.sort(() => Math.random() - 0.5);
    for (const p of pieces) {
      if (this.canMove(p.x, p.y, p.x, p.y + 1)) { this.movePiece(p.x, p.y, p.x, p.y + 1); return; }
      // Try diagonal
      for (const dx of [-1, 0, 1]) {
        if (this.canMove(p.x, p.y, p.x + dx, p.y + 1)) { this.movePiece(p.x, p.y, p.x + dx, p.y + 1); return; }
      }
    }

    // Forced end turn if stuck
    this.endTurn();
  }
}
