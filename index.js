const modalWin = document.getElementById("modal-win")
const modalLose = document.getElementById("modal-lose")
import { dictionary } from './dictionary.js';

//datenstruktur die aktuellen wörter spreichert und erstmals erstellt
// initialisierung: 
/* [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""]
]
*/

const state = {
    secret: dictionary[1200], //dictionary[Math.floor(Math.random()* dictionary.length)],
    grid: Array(6) // erstellt Array mit 6 Elementen
        .fill() // füllt das Array mit undefined werten
        .map(()=> Array(5).fill('')), //auf jedes der 6 elemente wird ein weiteres Array mit 5 feldern angewendet und mit '' gefülllt
        currentRow: 0,
        currentCol: 0,
}

const updateGrid = () => {
    for(let i = 0; i < state.grid.length; i++){ //state.grid.lenght = 6 - iteriert 0 bis 5 mal
        for(let j = 0; j < state.grid[i].length; j++){ // state.grid[i].length = 5
            const box = document.getElementById(`box${i}${j}`)
            box.textContent = state.grid[i][j] // textcontent der box wird ersetzt mit buchstaben die im grid an der stelle gespeichert wurden
        }
    }
}


const drawBox = (container, row, col, letter = '') => {
    const box = document.createElement('div')
    box.className = 'box'
    box.id = `box${row}${col}`
    box.textContent = letter

    container.appendChild(box)
    return box
}

const drawGrid = (container) => {
    const grid = document.createElement('div')
    grid.className = 'grid'

    for(let i = 0; i < 6; i++){
        for(let j = 0; j < 5; j++){
            drawBox(grid,i,j)
        }
    }

    container.appendChild(grid)
}

const registerButtonEvents = () => {
    const buttons = document.querySelectorAll(".keyboard button");

    buttons.forEach((button) => {
        button.onclick = () => {
            const key = button.textContent;

            if (key === "ENTER") {
                if (state.currentCol === 5) {
                    const word = getCurrentWord();
                    if (isWordValid(word)) {
                        revealWord(word);
                        state.currentRow++;
                        state.currentCol = 0;
                    } else {
                        alert("Word not in List.");
                    }
                }
            } else if (key === "DEL") {
                removeLetter();
            } else if (isLetter(key)) {
                addLetter(key);
            }

            updateGrid();
        };
    });
};

const registerKeyboardevEvents = () => {
    document.body.onkeydown = (e) => {
        const key = e.key

        if(key == 'Enter') {
            if(state.currentCol === 5) {
                const word = getCurrentWord()
                if(isWordValid(word)){
                    revealWord(word)
                    state.currentRow++
                    state.currentCol = 0
                } else {
                    alert('Word not in List.')
                }
            }
        }

        if(key == 'Backspace') {
            removeLetter()
        }

        if(isLetter(key)) {
            addLetter(key)
        }

        updateGrid()
    }
}

const getCurrentWord = () => {
    return state.grid[state.currentRow].reduce((prev,curr) => prev+curr)
}

const isWordValid = (word) => {
    return dictionary.includes(word)
}

const revealWord = (guess) => {
    const row = state.currentRow;
    const letterCount = {};


    for (const letter of state.secret) {
        letterCount[letter] = (letterCount[letter] || 0) + 1;
    }
   
    for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;

        if (letter === state.secret[i]) {
            box.classList.add('reveal-right');
            letterCount[letter]--; 
        }
    }
 
    for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;

        if (!box.classList.contains('reveal-right') && letterCount[letter] > 0) {
            box.classList.add('reveal-wrong');
            letterCount[letter]--; 
        } else if (!box.classList.contains('reveal-right')) {
            box.classList.add('empty');
        }
    }

    const buttons = document.querySelectorAll('.keyboard button');

    // Count the frequency of letters in the secret
    for (const letter of state.secret) {
        letterCount[letter] = (letterCount[letter] || 0) + 1;
    }

    // Update keyboard styles for guessed letters
    guess.split('').forEach((letter, index) => {
        const key = letter.toLowerCase();

        // Correct letter and position
        if (state.secret[index] === key) {
            letterCount[key]--;
            buttons.forEach(button => {
                if (button.textContent.trim().toLowerCase() === key) {
                    console.log(`Applying green to: ${button.textContent}`); // Debug
                    button.classList.add('keyboard-green');
                    button.style.backgroundColor = '#538d4e'; // Force apply for debugging
                    button.style.color = 'white';
                }
            });
        }
    });

    // Correct letter, wrong position or incorrect
    guess.split('').forEach(letter => {
        const key = letter.toLowerCase();
        if (state.secret.includes(key) && letterCount[key] > 0) {
            letterCount[key]--;
            buttons.forEach(button => {
                if (button.textContent.trim().toLowerCase() === key && !button.classList.contains('keyboard-green')) {
                    console.log(`Applying yellow to: ${button.textContent}`); // Debug
                    button.classList.add('keyboard-yellow');
                    button.style.backgroundColor = '#b59f3b'; // Force apply for debugging
                    button.style.color = 'white';
                }
            });
        } else if (!state.secret.includes(key)) {
            buttons.forEach(button => {
                if (button.textContent.trim().toLowerCase() === key) {
                    console.log(`Applying gray to: ${button.textContent}`); // Debug
                    button.classList.add('keyboard-gray');
                    button.style.backgroundColor = '#3a3a3c'; // Force apply for debugging
                    button.style.color = 'white';
                }
            });
        }
    });

    console.log(`Updated keyboard for guess: ${guess}`);

    const isWinner = state.secret === guess;
    const isGameOver = state.currentRow === 5;

    if (isWinner) {
        const searchedWord = document.querySelector(".modal-word")
        const time = document.querySelector('.modal-time')
        modalWin.style.display = "block";
        searchedWord.textContent = state.secret
        time.textContent = getTime()
    } else if (isGameOver) {
        const searchedWordLose = document.querySelector(".modal-word-lose");
        const timeLose = document.querySelector('.modal-time-lose');
        modalLose.style.display = 'block';
        searchedWordLose.textContent = state.secret;
        timeLose.textContent = getTime();
    }
};


const isLetter = (key) => {
    return key.length === 1 && key.match(/[a-z]/i)
}

const addLetter = (letter) => {
    if(state.currentCol === 5) return
    state.grid[state.currentRow][state.currentCol] = letter
    state.currentCol++
}

const removeLetter = () => {
    if(state.currentCol === 0) return
    state.grid[state.currentRow][state.currentCol - 1] = " "
    state.currentCol--
}


const startUp = () => {
    const game = document.getElementById('game')
    drawGrid(game)

    registerKeyboardevEvents()
    registerButtonEvents()

    console.log(state.secret)
}

let startTime

const timeTracker = () => {
    startTime = new Date()
}

const getTime = () => {
    if(startTime){
        const currentTime = new Date()
        const elapsedTime = currentTime - startTime

        const seconds = Math.floor(elapsedTime/1000)
        const minutes = Math.floor(seconds/60)
        const remainingSeconds = seconds % 60

        return `${String(minutes).padStart(2,'0')}:${String(remainingSeconds).padStart(2,'0')}`
    }
    return 0
}


window.onload = timeTracker

startUp()


/*---------modal---------------*/

const closeModal = document.getElementById('closeModal')

closeModal.onclick = function () {
    modalWin.style.display = "none";
}

const closeModalLose = document.getElementById('closeModal-lose')

closeModalLose.onclick = function () {
    modalLose.style.display = "none";
}

window.onclick = function(event){
    if(event.target === modalLose){
        modalLose.style.display = 'none'
    } else if (event.target === modalWin){
        modalWin.style.display = 'none'
    }
}