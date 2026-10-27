import React, { useState } from 'react';
import { createInitialBoard, getPossibleMoves, Board, ChessPiece } from '../../utils/chessLogic';
import { RotateCcw, Award } from 'lucide-react';

const PIECE_SYMBOLS: Record<string, string> = {
  wp: '♙', wr: '♖', wn: '♘', wb: '♗', wq: '♕', wk: '♔',
  bp: '♟', br: '♜', bn: '♞', bb: '♝', bq: '♛', bk: '♚',
};

export const ChessApp: React.FC = () => {
  const [board, setBoard] = useState<Board>(createInitialBoard);
  const [selectedPos, setSelectedPos] = useState<[number, number] | null>(null);
  const [turn, setTurn] = useState<'w' | 'b'>('w');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [vsAi, setVsAi] = useState(true);

  const possibleMoves = selectedPos ? getPossibleMoves(board, selectedPos[0], selectedPos[1]) : [];

  const handleSquareClick = (r: number, c: number) => {
    // If selecting own piece
    const piece = board[r][c];
    if (piece && piece.color === turn) {
      setSelectedPos([r, c]);
      return;
    }

    // If moving selected piece to target square
    if (selectedPos) {
      const isLegal = possibleMoves.some(([tr, tc]) => tr === r && tc === c);
      if (isLegal) {
        const [fromR, fromC] = selectedPos;
        const movingPiece = board[fromR][fromC]!;
        const targetPiece = board[r][c];

        const newBoard = board.map((row) => [...row]);
        newBoard[r][c] = movingPiece;
        newBoard[fromR][fromC] = null;

        // Notation (e.g. e2-e4)
        const colLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const notation = `${colLetters[fromC]}${8 - fromR} → ${colLetters[c]}${8 - r}${targetPiece ? ' (x)' : ''}`;

        setBoard(newBoard);
        setSelectedPos(null);
        setMoveHistory((prev) => [notation, ...prev]);

        const nextTurn = turn === 'w' ? 'b' : 'w';
        setTurn(nextTurn);

        // AI Response if playing vs AI and it's black's turn
        if (vsAi && nextTurn === 'b') {
          setTimeout(() => {
            makeAiMove(newBoard);
          }, 400);
        }
      } else {
        setSelectedPos(null);
      }
    }
  };

  const makeAiMove = (currentBoard: Board) => {
    // Collect all legal black moves
    const allMoves: { from: [number, number]; to: [number, number]; piece: ChessPiece }[] = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (currentBoard[r][c]?.color === 'b') {
          const moves = getPossibleMoves(currentBoard, r, c);
          moves.forEach(([tr, tc]) => {
            allMoves.push({ from: [r, c], to: [tr, tc], piece: currentBoard[r][c]! });
          });
        }
      }
    }

    if (allMoves.length === 0) return;

    // Pick capture move if available, otherwise pick random
    const captures = allMoves.filter((m) => currentBoard[m.to[0]][m.to[1]] !== null);
    const chosen = captures.length > 0
      ? captures[Math.floor(Math.random() * captures.length)]
      : allMoves[Math.floor(Math.random() * allMoves.length)];

    const updated = currentBoard.map((row) => [...row]);
    updated[chosen.to[0]][chosen.to[1]] = chosen.piece;
    updated[chosen.from[0]][chosen.from[1]] = null;

    const colLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const notation = `AI: ${colLetters[chosen.from[1]]}${8 - chosen.from[0]} → ${colLetters[chosen.to[1]]}${8 - chosen.to[0]}`;

    setBoard(updated);
    setTurn('w');
    setMoveHistory((prev) => [notation, ...prev]);
  };

  const resetGame = () => {
    setBoard(createInitialBoard());
    setSelectedPos(null);
    setTurn('w');
    setMoveHistory([]);
  };

  return (
    <div className="flex h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-hidden p-6 gap-6 justify-center items-center">
      {/* 8x8 Chessboard */}
      <div className="p-3 bg-stone-900 rounded-2xl shadow-2xl border-2 border-stone-700">
        <div className="grid grid-cols-8 grid-rows-8 w-[380px] h-[380px] border border-stone-800">
          {board.map((row, r) =>
            row.map((piece, c) => {
              const isDark = (r + c) % 2 === 1;
              const isSelected = selectedPos?.[0] === r && selectedPos?.[1] === c;
              const isTargetMove = possibleMoves.some(([tr, tc]) => tr === r && tc === c);

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => handleSquareClick(r, c)}
                  className={`relative flex items-center justify-center cursor-pointer text-3xl select-none transition-colors ${
                    isSelected
                      ? 'bg-amber-500/80 text-white'
                      : isDark
                      ? 'bg-[#769656]'
                      : 'bg-[#eeeed2]'
                  }`}
                >
                  {/* Legal move indicator dot */}
                  {isTargetMove && (
                    <span className="absolute w-3.5 h-3.5 rounded-full bg-black/30 z-10" />
                  )}

                  {piece && (
                    <span
                      className={`transform transition-transform active:scale-95 drop-shadow ${
                        piece.color === 'w' ? 'text-white' : 'text-stone-900'
                      }`}
                    >
                      {PIECE_SYMBOLS[`${piece.color}${piece.type}`]}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Game Controls & Move Notation */}
      <div className="w-64 bg-slate-950/70 p-4 rounded-2xl border border-white/10 flex flex-col justify-between h-[410px]">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-white">KRIX Chess</span>
            <span className="text-xs font-mono text-red-400 font-semibold">
              Turn: {turn === 'w' ? 'White' : 'Black (AI)'}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
            <span>Play vs ThinkPad AI</span>
            <input
              type="checkbox"
              checked={vsAi}
              onChange={(e) => setVsAi(e.target.checked)}
              className="accent-red-600 rounded"
            />
          </div>

          <div className="mt-4">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Move History
            </div>
            <div className="h-44 overflow-y-auto bg-black/40 rounded-xl p-2 font-mono text-xs text-slate-300 space-y-1 divide-y divide-white/5">
              {moveHistory.length === 0 ? (
                <div className="text-slate-500 text-center py-4">No moves yet</div>
              ) : (
                moveHistory.map((m, idx) => (
                  <div key={idx} className="pt-1 flex justify-between">
                    <span className="text-slate-400">#{moveHistory.length - idx}</span>
                    <span className="text-white font-medium">{m}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <button
          onClick={resetGame}
          className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md"
        >
          <RotateCcw size={14} />
          <span>New Game</span>
        </button>
      </div>
    </div>
  );
};
