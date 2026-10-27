/**
 * Chess board representation and move logic for KRIX Chess
 */

export type PieceColor = 'w' | 'b';
export type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
}

export type Board = (ChessPiece | null)[][];

export function createInitialBoard(): Board {
  const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));

  const backRow: PieceType[] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];

  for (let c = 0; c < 8; c++) {
    board[0][c] = { type: backRow[c], color: 'b' };
    board[1][c] = { type: 'p', color: 'b' };
    board[6][c] = { type: 'p', color: 'w' };
    board[7][c] = { type: backRow[c], color: 'w' };
  }

  return board;
}

export function isValidPosition(r: number, c: number): boolean {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

export function getPieceValue(piece: ChessPiece | null): number {
  if (!piece) return 0;
  const values: Record<PieceType, number> = {
    p: 10,
    n: 30,
    b: 30,
    r: 50,
    q: 90,
    k: 1000,
  };
  return piece.color === 'w' ? values[piece.type] : -values[piece.type];
}

export function evaluateBoardScore(board: Board): number {
  let score = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      score += getPieceValue(board[r][c]);
    }
  }
  return score;
}

export function getPossibleMoves(board: Board, r: number, c: number): [number, number][] {
  const piece = board[r][c];
  if (!piece) return [];
  const moves: [number, number][] = [];
  const color = piece.color;
  const oppColor = color === 'w' ? 'b' : 'w';

  const tryAdd = (tr: number, tc: number): boolean => {
    if (!isValidPosition(tr, tc)) return false;
    const target = board[tr][tc];
    if (!target) {
      moves.push([tr, tc]);
      return true; // continue ray
    }
    if (target.color === oppColor) {
      moves.push([tr, tc]);
    }
    return false; // hit piece, stop ray
  };

  if (piece.type === 'p') {
    const dir = color === 'w' ? -1 : 1;
    const startRow = color === 'w' ? 6 : 1;
    // Step 1 forward
    if (isValidPosition(r + dir, c) && !board[r + dir][c]) {
      moves.push([r + dir, c]);
      // Step 2 forward
      if (r === startRow && !board[r + dir * 2][c]) {
        moves.push([r + dir * 2, c]);
      }
    }
    // Captures
    for (const dc of [-1, 1]) {
      const tr = r + dir;
      const tc = c + dc;
      if (isValidPosition(tr, tc) && board[tr][tc] && board[tr][tc]!.color === oppColor) {
        moves.push([tr, tc]);
      }
    }
  } else if (piece.type === 'n') {
    const knightOffsets = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    for (const [dr, dc] of knightOffsets) {
      const tr = r + dr;
      const tc = c + dc;
      if (isValidPosition(tr, tc)) {
        if (!board[tr][tc] || board[tr][tc]!.color === oppColor) {
          moves.push([tr, tc]);
        }
      }
    }
  } else if (piece.type === 'k') {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const tr = r + dr;
        const tc = c + dc;
        if (isValidPosition(tr, tc)) {
          if (!board[tr][tc] || board[tr][tc]!.color === oppColor) {
            moves.push([tr, tc]);
          }
        }
      }
    }
  } else {
    // Sliding pieces: r, b, q
    const dirs: [number, number][] = [];
    if (piece.type === 'r' || piece.type === 'q') {
      dirs.push([-1, 0], [1, 0], [0, -1], [0, 1]);
    }
    if (piece.type === 'b' || piece.type === 'q') {
      dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
    }
    for (const [dr, dc] of dirs) {
      let step = 1;
      while (true) {
        const canContinue = tryAdd(r + dr * step, c + dc * step);
        if (!canContinue) break;
        step++;
      }
    }
  }

  return moves;
}
