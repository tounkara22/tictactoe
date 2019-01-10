var express = require('express');
var helper = require('./helper');
var port = 3000;
var app = express();

app.get('/', (req, res) => {
  let board = req.query.board;
	// no parameter passed
	if (!board) res.status(400).send('Parameter \"board\" missing...')
	// board does not have valid board configuration
  if (!helper.isValid(board.toLowerCase())) {
    res.status(400).send('Invalid Board Configuration.');
  } else {
    if (board.indexOf(' ') <= -1) {  // o can't play
      res.status(400).send('No more move is possible for o');
    } else {  // o can play now
      var newBoard = helper.playTurn(board);
			// res.send(newBoard);
      res.send(newBoard.replace(/ /gi, '+'))
    }
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Tic Tac Toe running on port 3000');
});
