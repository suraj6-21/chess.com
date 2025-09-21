const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = "w"; 

const renderBoard = () => {
    const board = chess.board();
    boardElement.innerHTML = "";

    board.forEach((row, rowIndex) => {
        row.forEach((square, colIndex) => {
            const squareElement = document.createElement("div");
            squareElement.classList.add("square",
                (rowIndex + colIndex) % 2 === 0 ? "bg-white" : "bg-gray-700",
                "w-full", "h-full", "flex", "items-center", "justify-center"
            );

            squareElement.dataset.row = rowIndex;
            squareElement.dataset.col = colIndex;

            if (square) {
                const pieceElement = document.createElement("div");
                pieceElement.classList.add("piece", square.color === "w" ? "text-white" : "text-black");
                pieceElement.innerText = getPieceUnicode(square); 
                pieceElement.draggable = playerRole === square.color;

                pieceElement.addEventListener("dragstart", (e) => {
                    if (pieceElement.draggable) {
                        draggedPiece = pieceElement;
                        sourceSquare = { row: rowIndex, col: colIndex };
                        e.dataTransfer.setData("text/plain", "");
                    }
                });

                pieceElement.addEventListener("dragend", (e) => {
                    draggedPiece = null;
                    sourceSquare = null;
                });

                squareElement.appendChild(pieceElement);
            }

            squareElement.addEventListener("dragover", (e) => e.preventDefault());

            squareElement.addEventListener('drop', (e) => {
                e.preventDefault();
                if (draggedPiece) {
                    const targetSquare = {
                        row: parseInt(squareElement.dataset.row),
                        col: parseInt(squareElement.dataset.col)
                    };
                    handleMove(sourceSquare, targetSquare);
                }
            });

            boardElement.appendChild(squareElement);
        });
    });
}

// Basic move handler
const handleMove = ({ row: fromRow, col: fromCol }, { row: toRow, col: toCol }) => {
    const moves = chess.moves({ verbose: true });
    const move = moves.find(m => m.from === `${String.fromCharCode(97 + fromCol)}${8 - fromRow}` &&
        m.to === `${String.fromCharCode(97 + toCol)}${8 - toRow}`);
    if (move) {
        chess.move(move.san);
        renderBoard();
    }
}

// Map pieces to Unicode symbols
const getPieceUnicode = (piece) => {
    const symbols = {
        p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚"
    };
    return piece.color === "w" ? symbols[piece.type].toUpperCase() : symbols[piece.type];
}

renderBoard();
