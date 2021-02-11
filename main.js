//Global Variables
let target, guesses, remGuesses;
let hint = false;

//Functions
function generateNumber(){
    return Math.floor(Math.random() * 100 + 1);
}

function updateGuessMessage(){
    switch(remGuesses){
        case 6:
            document.getElementById('guessTracker').innerText = `Good luck! You have 6 guesses.`
            break;
        case 5:
            document.getElementById('guessTracker').innerText = `Not quite. 5 guesses remaining.`
            break;
        case 4:
            document.getElementById('guessTracker').innerText = `Keep trying! 4 guesses remaining.`
            break;
        case 3:
            document.getElementById('guessTracker').innerText = `Your guesses are half gone! 3 guesses remaining.`
            break;
        case 2:
            document.getElementById('guessTracker').innerText = `It's getting close. Only 2 guesses remaining.`
            break;
        case 1:
            document.getElementById('guessTracker').innerText = `This is your last chance! Only 1 guess remaining.`
            break;
        default:
            document.getElementById('guessTracker').innerText = `Oh no, this message isn't supposed to show. Oops?`
            break;
    }
}

function clearList(){
    let list = document.getElementById('guesses')
    while (list.hasChildNodes()){
        list.removeChild(list.firstChild);
    }
}

function guessingGame(){
    Array.from(document.getElementsByTagName('DIV')).forEach(div=>{
        if (div.id === 'landing' || div.id === 'gameOver'){
            div.style.display = 'none';
        } else {
            div.style.display = 'block';
        }
    })

    target = generateNumber();
    guesses = [];
    remGuesses = 6;
    clearList();
    updateGuessMessage();
    hint = false;
    document.getElementById('hintMessage').innerText = 'Careful, clicking the hint button reduces your guesses to 1!';
}

function validateGuess(guess){
    if (isNaN(guess) || guess < 1 || guess > 100){
        throw 'Please guess a valid number from 1-100';
    } else if (guesses.includes(guess)){
        throw `You've already guessed that`;
    } else {
        return guess;
    }
}

function formatSpan(number, elem){
    if (Math.abs(target-number)<= 3){
        elem.style.color = 'Red';
        elem.appendChild(document.createTextNode(` flaming hot!`));
        //return 'flaming hot!'
    } else if (Math.abs(target-number) <= 8){
        elem.style.color = 'OrangeRed';
        elem.appendChild(document.createTextNode(` hot!`));
        //return 'hot!'
    } else if (Math.abs(target-number) <= 15){
        elem.style.color = 'Orange';
        elem.appendChild(document.createTextNode(` warm`));
        //return 'warm'
    } else if (Math.abs(target-number) <= 20){
        elem.style.color = 'YellowGreen';
        elem.appendChild(document.createTextNode(` lukewarm`));
        //return 'lukewarm'
    } else {
        elem.style.color = 'Blue';
        elem.appendChild(document.createTextNode(` cold`));
        //return 'cold'
    }
}

function updatePrevGuesses(number){
    let list = document.getElementById('guesses');
    let li = document.createElement('li');
    let span = document.createElement('span');
    formatSpan(number,span);
    //span.appendChild(document.createTextNode(` ${giveDirection(number)}`));
    li.appendChild(document.createTextNode(number.toString()));
    li.appendChild(span);
    list.appendChild(li);
}

function gameOver(bool){
    Array.from(document.getElementsByTagName('DIV')).forEach(div=>{
        if (div.id !== 'gameOver'){
            div.style.display = 'none';
        } else {
            div.style.display = 'block';
        }
    })
    if (bool){
        document.getElementById('gameState').innerText = `Congrats! You won!\nThe number was: ${target}.`;
    } else {
        document.getElementById('gameState').innerText = `I'm sorry, you lost!\nThe number was: ${target}.`;
    }
    playAgainButton.focus();
}

function submitGuess() {
    let guess;
    try {
        guess = validateGuess(parseInt(document.getElementById('guess').value));
        if (guess !== target){
            guesses.push(guess);
            updatePrevGuesses(guess);
            remGuesses--;
            if (remGuesses!== 0){
                updateGuessMessage();
            } else {
                gameOver(false);
            }
        } else {
            gameOver(true);
        }
    } catch(e) {
        alert(e);
    }
}

function giveHint() {
    if (!hint){
        remGuesses = 1;
        updateGuessMessage();
        let hintArr = [target];
        while (hintArr.length !== 3){
            let num = generateNumber();
            if (!hintArr.includes(num)){
                hintArr.push(num);
            }
        }
        document.getElementById('hintMessage').innerText = hintArr.sort((a,b)=> a-b).join(' ');
    }
}

//All the buttons
const startButton = document.getElementById('play');
const guessButton = document.getElementById('guessButton');
const hintButton = document.getElementById('hint');
const playAgainButton = document.getElementById('playAgain');

//The input field
const input = document.getElementById('guess');

//Starting the game
startButton.addEventListener('click', guessingGame);
startButton.focus();

//Option to play again
playAgainButton.addEventListener('click', guessingGame);

//Guessing
guessButton.addEventListener('click', submitGuess)
input.addEventListener('keyup', (event)=>{
    if (event.keyCode === 13){
        event.preventDefault();
        guessButton.click();
        input.value='';
    }
})

//Get a hint
hintButton.addEventListener('click',giveHint)