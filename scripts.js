// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const board = ChessBoard('board', {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onMouseoutSquare: onMouseoutSquare,
        onMouseoverSquare: onMouseoverSquare,
        onSnapEnd: onSnapEnd
    });

    const game = new Chess();

    function onDragStart (source, piece, position, orientation) {
        if (game.in_checkmate() === true || game.in_draw() === true ||
            piece.search(/^b/) !== -1 && game.game_over() === true ||
            piece.search(/^w/) !== -1 && game.game_over() === true) {
            return false;
        }
    }

    function onDrop (source, target) {
        const move = game.move({
            from: source,
            to: target,
            promotion: 'q' // Always promote to a queen for simplicity
        });

        removeGreySquares();
        renderMoveHistory(game.history());
        if (move === null) return 'snapback';
    }

    function onMouseoutSquare(square, piece) {
        removeGreySquares();
    }

    function onMouseoverSquare(square, piece) {
        const moves = game.moves({
            square: square,
            verbose: true
        });

        if (moves.length === 0) return;

        greySquare(square);

        for (let i = 0; i < moves.length; i++) {
            greySquare(moves[i].to);
        }
    }

    function removeGreySquares() {
        $('#board .square-55d63').css('background', '');
    }

    function greySquare(square) {
        const squareEl = $('#' + square);
        const background = '#a9a9a9';
        squareEl.css('background', background);
    }

    function onSnapEnd() {
        board.position(game.fen());
    }

    function renderMoveHistory(moves) {
        let moveString = '';
        for (let i = 0; i < moves.length; i++) {
            moveString += (i + 1) + '. ' + moves[i] + ' ';
        }
        $('#move-history').html(moveString);
    }

    $('#startBtn').on('click', board.start);
    $('#clearBtn').on('click', board.clear);
});
