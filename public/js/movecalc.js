
function randomMove(){
	var possibleMoves = game.moves();
	var randomIndex = Math.floor(Math.random()*possibleMoves.length);
	return possibleMoves[randomIndex]
}

function evaluateBoard(board, player){
	var pieceValue = {
		'p': 100,
		'n': 350,
		'b': 350,
		'r': 525,
		'q': 1000,
		'k': 10000
	}

	//Evaluate the current board value
	var value = 0
	board.forEach(function(row){
		row.forEach(function(piece){
			if (piece) {
				value += pieceValue[piece['type']]
                 	* (piece['color'] === player ? 1 : -1);
			}
		})
	})

	return value;
}

function calcBestMoveDepthOne(player){
	var possibleMoves = game.moves();

	//Sort moves randomly in order to not pick up the same move in ties (??)
	possibleMoves.sort(function(a,b){return 0.5 - Math.random()});

	//Exit if game is over
	if (game.game_over() === true || possibleMoves.length === 0) return;

	//Search move with highest value
	var bestMoveSoFar = null;
	var bestMoveValue = Number.NEGATIVE_INFINITY;

	possibleMoves.forEach(function(move){
		game.move(move);
		var moveValue = evaluateBoard(game.board(), player);
		if (moveValue > bestMoveValue){
			bestMoveSoFar = move;
			bestMoveValue = moveValue;
		}	
		game.undo();
	})

	return bestMoveSoFar;
}

function calcBestMoveMinimax(depth, game, player, isMaximizingPlayer = true){
	//Base case
	if (depth === 0){
		value = evaluateBoard(game.board(), player);
		return[value, null]
	}

	//Recursive case
	var bestMove = null;
	var possibleMoves = game.moves();
	possibleMoves.sort(function(a,b){return 0.5 - Math.random()});
	
	var bestMoveValue = isMaximizingPlayer ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;

	//Search through all possible moves
	for (var i = 0; i < possibleMoves.length; i++) {
		var move = possibleMoves[i];

		game.move(move);
		value = calcBestMoveMinimax(depth - 1, game, player, !isMaximizingPlayer)[0];
		console.log(isMaximizingPlayer ? 'Max: ' : 'Min: ', depth, move, value,
		bestMove, bestMoveValue)

		if (isMaximizingPlayer){
			if (value > bestMoveValue){
				bestMoveValue = value;
				   bestMove = move;
			}
		}else{
			if (value < bestMoveValue) {
				bestMoveValue = value;
				bestMove = move;
			}
		}

		game.undo();		
	}

	// Log the best move at the current depth
	console.log('Depth: ' + depth + ' | Best Move: ' + bestMove + ' | ' + bestMoveValue);
	// Return the best move, or the only move
	return [bestMoveValue, bestMove || possibleMoves[0]];
}

function calcBestMoveMinimaxAB(depth, game, player, alpha = Number.NEGATIVE_INFINITY, beta = Number.POSITIVE_INFINITY, isMaximizingPlayer = true){
	//Base case
	if (depth === 0){
		value = evaluateBoard(game.board(), player);
		return[value, null]
	}

	//Recursive case
	var bestMove = null;
	var possibleMoves = game.moves();

	possibleMoves.sort(function(a,b){return 0.5 - Math.random()});

	var bestMoveValue = isMaximizingPlayer ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;

	for (var i = 0; i < possibleMoves.length; i++){
		var move = possibleMoves[i];

		game.move(move);

		value = calcBestMoveMinimaxAB(depth - 1, game, player, alpha, beta, !isMaximizingPlayer)[0];
		console.log(isMaximizingPlayer ? 'Max: ' : 'Min: ', depth, move, value,
		bestMove, bestMoveValue);

		if (isMaximizingPlayer){
			if (value > bestMoveValue){
				bestMoveValue = value;
				   bestMove = move;
			}
			alpha = Math.max(alpha, value);
		}else{
			if (value < bestMoveValue) {
				bestMoveValue = value;
				bestMove = move;
			}
			beta = Math.min(beta, value);
		}

		game.undo();

		//Check for alpha beta pruning
		if (beta <= alpha){
			console.log('Prune', alpha, beta);
			break;
		}
	}

	// Log the best move at the current depth
	console.log('Depth: ' + depth + ' | Best Move: ' + bestMove + ' | ' + bestMoveValue + ' | A: ' + alpha + ' | B: ' + beta);
	// Return the best move, or the only move
	return [bestMoveValue, bestMove || possibleMoves[0]];
}