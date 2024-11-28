import { dictionary } from './dictionary.js';

const state = {
    secret: dictionary[722], //dictionary[Math.floor(Math.random()* dictionary.length)],
    grid: Array(6)
        .fill()
        .map(()=> Array(5).fill('')),
        currentRow: 0,
        currentCol: 0,
}

const updateGrid = () => {
    for(let i = 0; i < state.grid.length; i++){
        for(let j = 0; j < state.grid[i].length; j++){
            const box = document.getElementById(`box${i}${j}`)
            box.textContent = state.grid[i][j]
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
    const row = state.currentRow

    for(let i = 0; i < 5; i++){
        const box = document.getElementById(`box${row}${i}`)
        const letter = box.textContent

        if(letter === state.secret[i]){
            box.classList.add('right')
        } else if(state.secret.includes(letter)){
            box.classList.add('wrong')
        } else {
            box.classList.add('empty')
        }
    }

    const isWinner = state.secret === guess
    const isGameOver = state.currentRow === 5

    if(isWinner){
        alert("Congratulations!")
    } else if(isGameOver){
        alert(`Better luck next time! The word was ${state.secret}`)
    }

}

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

startUp()