//Computer makes a move with algorithm choice and skill/depth level
var makeMove = function(algo, skill=3){
	if (game.game_over() === true){
		console.log('game over');
		alert("Game over");
		return;
	}

	if (algo === 1){
		var move = randomMove();
	} else if (algo === 2) {
		var move = calcBestMoveDepthOne(game.turn());
	} else if (algo === 3) {
		var move = calcBestMoveMinimax(skill, game, game.turn())[1];
	} else {
		var move = calcBestMoveMinimaxAB(skill, game, game.turn())[1];
	}

	game.move(move)

	board.position(game.fen())
}

//AI vs AI
var playGameAIvsAI = function(algo = 4, skillW = 2, skillB = 2){
	if (game.game_over() === true){
		console.log('game over');
		alert("Game over");
		return;
	}
	var skill = game.turn() === 'w' ? skillW : skillB;
	makeMove(algo, skill);
	window.setTimeout(	function(){
							playGameAIvsAI(algo, skillB, skillW)
						},	250);
}

//AI move after human moves
var onDrop = function(source, target){
	//Check if the move is legal
	var move = game.move({
		from: source,
		to: target,
		promotion: 'q' //For semplicity we only promote to queen
	});

	if (move == null){
		return 'snapback';
	}

	console.log(move)

	//Make black move
	window.setTimeout(	function(){
							makeMove(4,3);
						}, 250)

}

