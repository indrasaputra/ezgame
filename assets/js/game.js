//$(document).ready(function(){
	var grid = [
		[0,2,7,6,9,5,1,4,3,8],
		[0,6,1,8,7,5,3,2,9,4],
		[0,8,3,4,1,5,9,6,7,2],
		[0,4,9,2,3,5,7,8,1,6]
	];
	var reverseGrid = [
		[0,6,1,8,7,5,3,2,9,4],
		[0,2,7,6,9,5,1,4,3,8],
		[0,4,9,2,3,5,7,8,1,6],
		[0,8,3,4,1,5,9,6,7,2],
	];
	var gridChecked = [
		[1,2,3],
		[4,5,6],
		[7,8,9],
		[1,4,7],
		[2,5,8],
		[3,6,9],
		[1,5,9],
		[3,5,7]
	];
	var cell = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
	var magicNumber = [0,0,0];
	var gridFilled = 0;
	var playerMoveCount = 1;
	var computerMoveCount = 1;
	var computerMove;
	var number;
	var map = 0;
	var MAX_INT = 1000000007;
	var MIN_INT = -1000000007;
	var playerWinColor = 'F9690E';
	var computerWinColor = '003171';
	
	$(function() {
		// resetGame();
		for(var i=1; i<=9; i++)
		{
			cell[i] = -1;
			$('#number-' + i).removeClass('btn-danger');
			$('#number-' + i).removeClass('disabled');
			$('#number-' + i).addClass('btn-success');
			$('#player-choice-' + i).addClass('hidden');
			$('#player-choice-' + i).html('');
			$('#computer-choice-' + i).addClass('hidden');
			$('#computer-choice-' + i).html('');
		}
		$('#div-message').addClass('hidden');
		gridFilled = 0;
		playerMoveCount = 1;
		computerMoveCount = 1;
		map = Math.floor((Math.random() * 4));
	});

	function resetGame()
	{
		for(var i=1; i<=9; i++)
		{
			cell[i] = -1;
			$('#number-' + i).removeClass('btn-danger');
			$('#number-' + i).removeClass('disabled');
			$('#number-' + i).addClass('btn-success');
			$('#player-choice-' + i).addClass('hidden');
			$('#player-choice-' + i).html('');
			$('#computer-choice-' + i).addClass('hidden');
			$('#computer-choice-' + i).html('');
		}
		$('#div-message').addClass('hidden');
		gridFilled = 0;
		playerMoveCount = 1;
		computerMoveCount = 1;
		map = Math.floor((Math.random() * 4));

		window.location='http://localhost/ezgame/game.html';
	}

	$('.number').click(function(){
		cell[reverseGrid[map][this.value]] = 0;
		gridFilled++;
		$('#player-choice-' + playerMoveCount).removeClass('hidden');
		$('#player-choice-' + playerMoveCount).html(this.value);
		playerMoveCount++;
		disableNumber(this);

		if(isPlayerWin(cell, 0))
		{
			endOfGame(1,0);
		}

		computerMove = artificialIntelligence(cell.slice(0), 0, gridFilled, 0);

		if(computerMove[0] != 0 && gridFilled<8)
		{
			cell[computerMove[0]] = 1;
			gridFilled++;
			number = grid[map][computerMove[0]];
			$('#computer-choice-' + computerMoveCount).removeClass('hidden');
			$('#computer-choice-' + computerMoveCount).html(number);
			computerMoveCount++;
			disableNumber('#number-' + number);
			
			if(isPlayerWin(cell, 1))
			{
				endOfGame(1,1);
			}
		}
		else
		{
			endOfGame(0,0);
		}
	});

	function disableNumber(_number)
	{
		$(_number).removeClass('btn-success');
		$(_number).addClass('btn-danger');
		$(_number).addClass('disabled');
	}

	function artificialIntelligence(_cell, _depth, _gridFilled, _player)
	{
		if(isGameOver(_cell, _gridFilled, _player))
		{
			return score(_cell, _depth, _player);
		}

		var maxValue = [0, MIN_INT];
		var minValue = [0, MAX_INT];
		var childScore;
		var scores = [];

		_player = (_player+1)&1;
		for(var i=1; i<=9; i++)
		{
			if(_cell[i] == -1)
			{
				_cell[i] = _player;
				childScore = artificialIntelligence(_cell.slice(0), _depth+1, _gridFilled+1, _player);
				_cell[i] = -1;
				childScore[0] = i;
				scores.push(childScore);
			}
		}

		if(_player == 1)
		{
			for(var i=0; i<scores.length; i++)
			{
				if(scores[i][1] > maxValue[1])
				{
					maxValue = scores[i];
				}
			}
			return maxValue;
		}
		else
		{
			for(var i=0; i<scores.length; i++)
			{
				if(scores[i][1] < minValue[1])
				{
					minValue = scores[i];
				}
			}
			return minValue;
		}

	}

	function isGameOver(_cell, _gridFilled, _player)
	{
		if(_gridFilled >= 9)
		{
			return true;
		}

		for(var i=0; i<8; i++)
		{
			var found = true;
			var j;
			for(j=0; j<3; j++)
			{
				if(_cell[gridChecked[i][j]] != _player)
				{
					found = false;
					break;
				}
			}
			if(found)
			{
				return true;
			}
		}

		return false;
	}

	function score(_cell, _depth, _player)
	{
		var result;

		for(var i=0; i<8; i++)
		{
			var found = true;
			var j;
			for(j=0; j<3; j++)
			{
				if(_cell[gridChecked[i][j]] != _player)
				{
					found = false;
					break;
				}
			}
			if(found)
			{
				if(_player == 1)
				{
					return [0, 10 - _depth];
				}
				else
				{
					return [0, _depth - 10];
				}
			}
		}

		return [0, 0];
	}

	function isPlayerWin(_cell, _player)
	{
		for(var i=0; i<8; i++)
		{
			var found = true;
			var j;
			for(j=0; j<3; j++)
			{
				if(_cell[gridChecked[i][j]] != _player)
				{
					found = false;
					break;
				}
			}
			if(found)
			{
				for(var k=0; k<3; k++)
				{
					magicNumber[k] = grid[map][gridChecked[i][k]];
				}
				return true;
			}
		}

		return false;
	}

	function computerFirst()
	{
		computerMove = artificialIntelligence(cell.slice(0), 0, gridFilled, 1);

		if(computerMove[0] != 0)
		{
			cell[computerMove[0]] = 1;
			gridFilled++;
			number = grid[map][computerMove[0]];
			$('#computer-choice-' + computerMoveCount).removeClass('hidden');
			$('#computer-choice-' + computerMoveCount).html(number);
			computerMoveCount++;
			disableNumber('#number-' + number);
			
			if(isPlayerWin(cell, 1))
			{
				endOfGame(1,1);
			}
		}
		else
		{
			endOfGame(0,0);
		}
	}

	function endOfGame(_condition, _player)
	{
		for(var i=1; i<=9; i++)
		{
			disableNumber('#number-' + i);
		}

		if(_condition == 0)
		{
			$('#div-message').removeClass('hidden');
			$('#div-message').addClass('alert-warning');
			$("#text-message").html("Draw! <br/>Try again if you aren't satisfied with this result");
		}
		else if(_condition == 1)
		{
			$('#div-message').removeClass('hidden');
			if(_player == 1)
			{
				showMagicNumber('computer', computerMoveCount);
				$('#div-message').addClass('alert-danger');
				$("#text-message").html("You lose! <br/>Try again if you aren't satisfied with this result");
			}
			else if(_player == 0)
			{
				showMagicNumber('player', playerMoveCount);
				$('#div-message').addClass('alert-success');
				$("#text-message").html("You win! <br/>Congratulations! You've defeated EZ");
			}
		}
	}

	function showMagicNumber(_winner, _moveCount)
	{
		for(var i=1; i<=_moveCount; i++)
		{
			for(var j=0; j<magicNumber.length; j++)
			{
				if($('#' + _winner +'-choice-' + i).html() == magicNumber[j])
				{
					if(_winner === 'computer')
					{
						$('#' + _winner +'-choice-' + i).css('background-color', '#003171')
					}
					else if(_winner === 'player')
					{
						$('#' + _winner +'-choice-' + i).css('background-color', '#F9690E');	
					}
				}
			}
		}
	}
//});