let target = 0;
let attempt = 0;
const maxAttempt = 5;

function restartGame() {
    target = Math.floor(Math.random() * 20) +1;
    attempt = 0;

    document.getElementById("guess").value = ""
    document.getElementById("attempt").textContent = "Attempt " + attempt + "/" + maxAttempt
    document.getElementById("result").textContent = ""
    document.getElementById("guessBtn").disabled = false
    document.getElementById("restart").style.display = "none"
    document.getElementById("guess").focus()
}

function checkGuess() {
    let value = Number(document.getElementById("guess").value);
    if(value < 1 || value > 20) {
        alert("Please enter a number between 1 and 20");
        return;
    }
    attempt = attempt + 1;
    document.getElementById("attempt").textContent = "Attempt " + attempt + "/" + maxAttempt
    if(value > target) {
        document.getElementById("result").textContent = value + " is too high!";
    }
    else if(value < target) {
        document.getElementById("result").textContent = value + " is too low!";
    }
    else {
        document.getElementById("result").textContent = value + " is correct! You win!";
        document.getElementById("guessBtn").disabled = true;
        document.getElementById("restart").style.display = "block";
        return;
    }

    if(attempt >= maxAttempt) {
        document.getElementById("result").textContent = "Out of attempts! The number was " + target + ".";
        document.getElementById("guessBtn").disabled = true;
        document.getElementById("restart").style.display = "block";
    }
}

restartGame();
