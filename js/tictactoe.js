"use babel";

(function (w, d) {
  'use strict';

  const TicTacToe = {
    matrix: [0, 0, 0,
             0, 0, 0,
             0, 0, 0], // 1 = user, -1 = computer, 0
    done: false,
    userChoice: 'X',
    computerChoice: 'O',
    currentPlayer: 'user',
    winner: null
  };

  const $gameCellContainer = $('.tictactoe__game');
  const $gameCells = $$('.tictactoe-game__cell', $gameCellContainer);
  const $userChoice = $('.tictactoe__choice');
  const $result = $('.tictactoe__result');

  const init = function () {
    console.log('DOMContentLoaded');

    $('form', $userChoice).addEventListener('change', choiceHandler, false);
    
    startGame();
  };
  
  const startGame = function () {
    $gameCellContainer.addEventListener('click', cellHandler, false);
    $result.textContent = '';
    $gameCellContainer.classList.remove('tictactoe__game--disabled');
  };

  const choiceHandler = function (ev) {
    const selection = ev.target;
    console.log(selection);

    TicTacToe.userChoice = selection.value;
    console.log('User Choice:', TicTacToe.userChoice);

    TicTacToe.computerChoice = TicTacToe.userChoice === 'X' ? 'O' : 'X';
    console.log('Computer Choice:', TicTacToe.computerChoice);

    updateDisplay();
  };

  const cellHandler = function (ev) {
    
    TicTacToe.currentPlayer = 'user';
    
    const cell = ev.target;
    console.log(cell);

    const cellNum = cell.getAttribute('data-cell-num');
    console.log(cellNum);

    // invalid cell clicked
    if(TicTacToe.matrix[cellNum-1]) {
      console.log('Invalid cell clicked');
      return;
    }

    TicTacToe.matrix[cellNum-1] = 1; // user choice
    console.log('Player Choice:', cellNum - 1);
    console.log(TicTacToe.matrix);

    updateDisplay();

    TicTacToe.done = checkWin() || checkPlayability();
    console.log(TicTacToe.done);

    if(TicTacToe.done) {
      endGame();
      return;
    }

    playComputer();
  };

  const endGame = function () {
    disableGame();
    
    switch(TicTacToe.winner) {
      case 'user':
      case 'computer':
        $result.textContent = `Winner: ${TicTacToe.currentPlayer}`;
        break;
      default:
        $result.textContent = 'Draw';
    }
    
    
    setTimeout(function () {
      reset();
      console.log(TicTacToe.matrix);
      updateDisplay();
      startGame();
    }, 5000);
  };
  
  const checkWin = function () {
    let isWin = false;
    const m = TicTacToe.matrix;
    
    
    isWin = m[0] !== 0 && m[0] === m[1] && m[1] === m[2];
    isWin = isWin || (m[3] !== 0 && m[3] === m[4] && m[4] === m[5]);
    isWin = isWin || (m[6] !== 0 && m[6] === m[7] && m[7] === m[8]);
    isWin = isWin || (m[0] !== 0 && m[0] === m[3] && m[3] === m[6]);
    isWin = isWin || (m[1] !== 0 && m[1] === m[4] && m[4] === m[7]);
    isWin = isWin || (m[2] !== 0 && m[2] === m[5] && m[5] === m[8]);
    isWin = isWin || (m[0] !== 0 && m[0] === m[4] && m[4] === m[8]);
    isWin = isWin || (m[2] !== 0 && m[2] === m[4] && m[4] === m[6]);
    
    if(isWin) {
      TicTacToe.winner = TicTacToe.currentPlayer;
    }
    
    return isWin;
  };

  const playComputer = function () {
    
    TicTacToe.currentPlayer = 'computer';

    const remainingIdxs = TicTacToe.matrix.reduce((remainingIdxs, cellNum, idx) => {
      if(!cellNum){
        remainingIdxs.push(idx); 
      }
      return remainingIdxs;
    }, []);

    let rand = Math.floor(Math.random() * remainingIdxs.length);

    TicTacToe.matrix[remainingIdxs[rand]] = -1; // computer choice
    console.log('Computer Choice:', rand);
    console.log(TicTacToe.matrix);

    updateDisplay();

    TicTacToe.done = checkWin() || checkPlayability();
    console.log(TicTacToe.done);

    if(TicTacToe.done) {
      endGame();
      return;
    }
  };
  
  const disableGame = function () {
    $gameCellContainer.removeEventListener('click', cellHandler, false);
    $gameCellContainer.classList.add('tictactoe__game--disabled');
  };

  const checkPlayability = () => TicTacToe.matrix.every(Boolean);

  const updateDisplay = function () {

    // console.log($gameCells);

    $gameCells.forEach((cell) => {
      const cellNum = cell.getAttribute('data-cell-num');
      
      switch(TicTacToe.matrix[cellNum-1]) {
        case -1: cell.textContent = TicTacToe.computerChoice; break;
        case 1: cell.textContent = TicTacToe.userChoice; break;
        default: cell.textContent = '';
      }
      
    });
  };

  const reset = function () {
    TicTacToe.matrix = [0, 0, 0,
                        0, 0, 0,
                        0, 0, 0];
    TicTacToe.done = false;
    TicTacToe.winner = null;
  };

  $.ready().then(init);

}).call(this, window, window.document);