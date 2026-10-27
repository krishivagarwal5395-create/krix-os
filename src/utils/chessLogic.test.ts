import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialBoard, getPossibleMoves, evaluateBoardScore } from './chessLogic';

test('createInitialBoard setups standard 8x8 layout', () => {
  const board = createInitialBoard();
  assert.equal(board.length, 8);
  assert.equal(board[0].length, 8);
  assert.equal(board[0][0]?.type, 'r');
  assert.equal(board[0][0]?.color, 'b');
  assert.equal(board[7][4]?.type, 'k');
  assert.equal(board[7][4]?.color, 'w');
});

test('evaluateBoardScore starts at 0 for initial setup', () => {
  const board = createInitialBoard();
  const score = evaluateBoardScore(board);
  assert.equal(score, 0);
});

test('getPossibleMoves returns 2 forward moves for pawn at start position', () => {
  const board = createInitialBoard();
  // White pawn at [6, 4] (e2)
  const moves = getPossibleMoves(board, 6, 4);
  assert.equal(moves.length, 2);
  assert.deepEqual(moves[0], [5, 4]); // e3
  assert.deepEqual(moves[1], [4, 4]); // e4
});

test('getPossibleMoves returns 2 L-shaped moves for knight at b1 [7, 1]', () => {
  const board = createInitialBoard();
  const moves = getPossibleMoves(board, 7, 1);
  assert.equal(moves.length, 2); // a3 [5, 0], c3 [5, 2]
});
