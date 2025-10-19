/* Get HTML Elements as JS objects */
const button = document.getElementById("guess-button");
const number = document.getElementById("guess-text");
const attemptsView = document.getElementById("attempts");
const cluesView = document.getElementById("clues");

/* Add Event Listener to button with callback function */
button.addEventListener("click", guessNumber);

/* Callback function for event: Button Click */
function guessNumber() {
    const guess = number.value;
    tries--;
    attemptsView.innerHTML = `Number of attempt left: ${tries}`;
    console.log(`Number of attempts left: ${tries}`);
    if (guess == passcode) {
        document.body.innerHTML = `<h1>You win!</h1> <p>Got it in ${10-tries} attempts</p>`;
    } else if (tries <= 0) {
        document.body.innerHTML = `You lose! The passcode was ${passcode}`;
    } else {
        giveClue(guess);
    }
}

/* Hi-Lo Game Data */
const passcode = Math.floor(Math.random() * 1000);
let tries = 10;

/* Give Clue */
function giveClue(guess) {
    if (guess > passcode) {
        cluesView.innerHTML += `<li>${guess} is too High!</li>`;
    } else {
        cluesView.innerHTML += `<li>${guess} is too Low!</li>`;
    }
}

