function doAdd(x, y) {
    return x + y;
}

function doSubtract(x, y) {
    return x - y;
}

function doMultiply(x, y) {
    return x * y;
}

function doDivide(x, y) {
    return x / y;
}

function doCalc(...queue) {
    
}

function updateDisplay(newLine, ...queue) {
    /**
     * 
     */
}

function handleInput(event) {

    /**
     * Grab the event target's ID as a new token
     *   this is either a number, operation, or command.
     * 
     * If command is
     *   equals and queue is full then run the operation on the current
    *      inded and return the result.
     *   clear, then clear the current index
     *   clear all, then clear all indicies of queue
     * else
     *   add token to queue at the current index
     * 
     * Update Display
     */
    let newToken = event.target.id;
    let needNewLine = false;

    if (displayMatrix[currentIndex].length = 3 && newToken === "equals") {
       doCalc(displayMatrix[currentIndex]);
    }

    updateDisplay(needNewLine, displayMatrix);
}

let displayMatrix = [];
let currentIndex = 0;
const displayDiv = document.querySelector('#display');
const inputsDiv = document.querySelector('#inputs');
inputsDiv.addEventListener('click', handleInput);