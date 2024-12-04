//profile-name
var depthset = 0;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('input').addEventListener('change',function(event) {
        const files = event.target.files[0]
        if (!files) {
       
            return;  // Exit if no file was selected
          }
        
          const reader = new FileReader(); // Create a FileReader instance
        
          // Set up the onload handler to handle the file after reading
          reader.onload = function(e) {
            const imageUrl = e.target.result;  // Get the result (data URL) from FileReader
            const imagePreview = document.querySelector('.profile-img2');
            imagePreview.src = imageUrl;  // Set the image source to the data URL
            imagePreview.style.display = 'block';  // Make the image visible
          };
        
          // Handle errors if the file cannot be read
          reader.onerror = function(error) {
    
          };
        
          // Start reading the file as a data URL
          reader.readAsDataURL(files);
    })
    });

const submitBtn = document.querySelector(".submit");
const app = document.querySelector(".app");
const container = document.querySelector(".container");
submitBtn.addEventListener('click',() => {
   var white_name = document.getElementById('nameinp').value;
   var difficulty = document.getElementById('difficulty-level').innerHTML;
   if(white_name === ''){
    alert("Enter your name! ");
   }else if(difficulty === ''){
    alert("Select a difficulty! ");

   }else{
    app.style.display  = 'none';
    container.style.display = 'flex';
    document.querySelector('.white-name').innerHTML = white_name;
    board();
   }
})

const difficult = document.querySelectorAll(".difficult");
difficult.forEach(elem => {
    
    elem.addEventListener('click',() => {

        
   const difficulty = document.getElementById('difficulty-level');
    difficulty.innerHTML = elem.innerHTML;
    })
})


const easy = document.querySelector(".easy");
const medium = document.querySelector(".medium");
const hard = document.querySelector(".hard");
const insane = document.querySelector(".insane");
const hardcore = document.querySelector(".hardcore");

easy.addEventListener('click',() => {
    depthset = 1;
})



medium.addEventListener('click',() => {
    depthset = 5;
})


hard.addEventListener('click',() => {
    depthset = 10;
})

insane.addEventListener('click',() => {
    depthset = 15;
})


hardcore.addEventListener('click',() => {
    depthset = 20;
})
//others
function board() {
    


var board = null;
var game = new Chess();

const captureAudio = new Audio('./asset/capture.mp3')
const castleAudio = new Audio('./asset/castle.mp3')
const gameEndAudio = new Audio('./asset/game-end.webm')
const checkAudio = new Audio('./asset/move-check.mp3')
const moveAudio = new Audio('./asset/move-self.mp3')
const promote_audio = new Audio('./asset/promote.mp3')

function onDragStart(source, piece, position, orientation) {
    if (game.game_over()) return false;
    if (piece.search(/^b/) !== -1) return false;    
}

const stockfish = new Worker('./stockfish.js');


function sendCommand(command) {
    stockfish.postMessage(command);
}
function countPieces(square) {
    const allMoves =game.moves()
    let count = 0


    
    allMoves.forEach(move => {
    var moveset; 
        if (square.length === 4) {
           moveset = move[0] + move[2] + move[3] + move[4];  
        }else {
            
            moveset = move[0] + move[2] + move[3];  
        }


        
       if (moveset === square) {
        count++  ;
       }
    });
   return count;
}
function getBestMove(fen, depth) {
    sendCommand("uci");
    sendCommand(`position fen ${fen}`);
    sendCommand(`go depth ${depth}`);

    stockfish.onmessage = function (event) {
        const message = event.data;

        if (message.startsWith("bestmove")) {
            const bestMove = message.split(" ")[1]; // Extract Stockfish's best move
            const sourceSquare = bestMove.substring(0, 2);
            const targetSquare = bestMove.substring(2, 4);
            const promotionPiece = bestMove.length === 5 ? bestMove[4] : null; // Detect promotion, if any

            // Apply the move in the game state
            const move = game.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: promotionPiece || 'q' // Use the promotion piece or default to queen
            });

            if (move) {
                board.position(game.fen()); // Update the board

                // Handle audio and game state
                if (move.promotion) {
                    promote_audio.play();
                } else if (move.captured) {
                    captureAudio.play();
                } else if (game.in_check()) {
                    checkAudio.play();
                }

                if (game.game_over()) {
                    document.querySelector('.endgame').style.display = 'block'

        if (game.turn() === 'w') {
            document.querySelector('.gameOverText').innerHTML = "Computer Won!😑";
            document.getElementById('gameOverText').innerHTML = "Computer Won!😑";
        }else if(game.turn() === 'b') {
                document.querySelector('.gameOverText').innerHTML = "You Won!🎉";
                document.getElementById('gameOverText').innerHTML = "You Won!🎉";
        }
                    gameEndAudio.play();
                }
            }
        }
    };
}
async function makeRandomMove() {
    const fen = game.fen();
    const depth = depthset;
    getBestMove(fen, depth);

 
    

    
}

function onDrop(source, target) {
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    if (move === null) return 'snapback';    
    
    if (game.in_check()) {
        checkAudio.play();
    }else if(move.captured){
        
        
        

     captureAudio.play();   
    }else if(game.in_checkmate()){
        console.log("game-over");
        
        gameEndAudio.play();

       
    }else if(game.in_draw()){
        gameEndAudio.play();
    }else if(move.promotion){
        promote_audio.play();
    }else{
        moveAudio.play();
    }
    window.setTimeout(makeRandomMove, 250);
}

function onSnapEnd() {
    board.position(game.fen());
if (game.in_checkmate()) {
    document.querySelector('.endgame').style.display = 'block'

    if (game.turn() === 'w') {
        document.querySelector('.gameOverText').innerHTML = "Computer Won!😑";
        document.getElementById('gameOverText').innerHTML = "Computer Won!😑";
    }else if(game.turn() === 'w') {
            document.querySelector('.gameOverText').innerHTML = "You Won!🎉";
            document.getElementById('gameOverText').innerHTML = "You Won!🎉";
    }
}
}

var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
};

board = Chessboard('board1', config);
}
