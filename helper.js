/** By: Ibrahima Tounkara **/
const _ = require('underscore');
const edgeIndices = [1, 3, 5, 7]
const cornerIndices = [0, 2, 6, 8];
/** stores information for each important position in 3x3 config**/
const movesRepertoire = {
  0: [[1, 2], [4, 8], [3, 6]],
  1: [[0, 2], [4, 7]],
  2: [[0, 1], [5, 8], [4, 6]],
  3: [[4, 5], [0, 6]],
  4: [[1, 7], [3, 5], [2, 6], [0, 8]],
  5: [[2, 8], [3, 4]],
  6: [[0, 3], [7, 8], [4, 2]],
  7: [[8, 6], [4, 1]],
  8: [[5, 2], [4, 0], [7, 6]]
};

/**
  checks if number of 'o's and of 'x's are different by at most 1.
  Also makes sure the board has length == 9 (assuming 3x3 matrix).
**/
module.exports.isValid = (board) => {
  numOs = 0;
  numXs = 0;

  if (board.length !== 9) return false;   // wrong length
  for (var i = 0; i < board.length; i++) {
    if (board[i] === 'x') numXs++;
    else if (board[i] === 'o') numOs++;
    else if (board[i] != ' ') return false;
  }
  // number of Xs must be bigger or equal to Os for O to play
  if ((numXs - numOs !== 0 && numXs - numOs !== 1 && numOs + numXs !== 9)
    || winningConfig(board)) {
    return false;
  }

  return true;
}

/**
  fn receives board as string. At every possible empty spot, tries
  to win. If impossible, records losing position(s) as well as
  empty spots. Afterwards, moves to counter opponent or attempts to win/tie.
**/
module.exports.playTurn = (board) => {
  losingSpots = [];
  freeSpots = [];

  for (let i = 0; i < board.length; i++) {
    if (board[i] !== ' ') continue;
    possibleMoves = movesRepertoire[i]    // moves from index i

    for (var j=0; j<possibleMoves.length; j++) {
      // winning situation
      if (board[possibleMoves[j][0]] === board[possibleMoves[j][1]]
        && board[possibleMoves[j][0]] === 'o') {
        return board.substr(0, i) + 'o' + board.substr(i + 1);
      }
      // losing situation.
      else if (board[possibleMoves[j][0]] === board[possibleMoves[j][1]] &&
         board[possibleMoves[j][0]] === 'x') {
        losingSpots.push(i);
      }
      // spot is free
      else freeSpots.push(i);
    }
  }

  if (losingSpots.length < 1) {   // attack or aim to tie
    chosenIndex = makeStrategicMove(board);
    return board.substr(0, chosenIndex) + 'o' + board.substr(chosenIndex + 1);
  } else {    // counter opponent as much as possible
    return board.substr(0, losingSpots[0]) + 'o' + board.substr(losingSpots[0] + 1)
  }
  return '';
}

/**
  function returns an index that is best for new move.
  It means to either dominate opponent (win) or tie.
**/
makeStrategicMove = (board) => {
  availCorners = _.intersection(cornerIndices, _.uniq(freeSpots));
  availEdges = _.intersection(edgeIndices, _.uniq(freeSpots));

  if (freeSpots.includes(4)) return 4; // prefer center
  else if (availCorners.length !== 0) { // there are free corners
    var takenCorners = _.difference(cornerIndices, availCorners);
    if (takenCorners.length !== 0 && numXs > numOs) { // a corner is taken and x started
      for (var k=0; k<takenCorners.length; k++) {
        if (board[takenCorners[k]] === 'x') {
          return availEdges[Math.floor(availEdges.length * Math.random())];
        }
      }
    } else {
      return availCorners[Math.floor(availCorners.length * Math.random())];
    }
  }
  return freeSpots[Math.floor(Math.random() * freeSpots.length)];
}

// checks if board has winning position
winningConfig = (board) => {
  if (diagonalWin(board) || xAxisWin(board) || yAxisWin(board)) return true;
  return false;
}

// checks both diagonals
diagonalWin = (board) => {
  xWin = 0;
  oWin = 0;
  let i;
  for (i = 0; i < board.length; i+=4) {
    if (board[i] === 'o') oWin++;
    if (board[i] === 'x') xWin++;
  }
  if (xWin === 3 || oWin === 3) return true;

  xWin = 0;
  oWin = 0;
  for (i = 2; i < board.length; i+=2) {
    if (board[i] === 'o') oWin++;
    if (board[i] === 'x') xWin++;
  }
  if (xWin === 3 || oWin === 3) return true;
}

// checks all three rows
xAxisWin = (board) => {
  for (let i = 0; i < board.length; i+=3) {
    xWin = 0;
    oWin = 0;
    for (let j = i; j < 3; j++) {
      if (board[j] === 'o') oWin++;
      if (board[j] === 'x') xWin++;
    }
    if (xWin === 3 || oWin === 0) return true;
  }
}

// checks all three colums
yAxisWin = (board) => {
  for (let i = 0; i < board.length; i++) {
    xWin = 0;
    oWin = 0;
    for (let j = i; j < board.length; j+=3) {
      if (board[j] === 'o') oWin++;
      if (board[j] === 'x') xWin++;
    }
    if (xWin === 3 || oWin === 0) return true;
  }
}
