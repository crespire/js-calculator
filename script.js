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

function doCalc(queue) {
    /**
     * Find what operation has been requested
     * Split the queue array into operands
     * Perform and return calculation
     */
     const doOps = ['+', '-', '*', '/'];
     const operation = queue.filter(e => doOps.includes(e));    
     
     console.dir(queue);
     let x = queue.slice(0, queue.indexOf(operation)-1).join('');
     let y = queue.slice(queue.indexOf(operation), queue.length).join('');
     console.log(`Calculate: ${x} ${operation} ${y}`);

     switch (operation) {
         // select the right operation
     }
}

function updateDisplay(display) {
    displayDiv.innerHTML = '';

    display.forEach((line) => {
        let newDiv = document.createElement('div');
        newDiv.textContent = line.join(' ');;
        displayDiv.appendChild(newDiv);
    });
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


    if (displayMatrix[currentIndex] === undefined) {
        displayMatrix[currentIndex] = new Array();
    }

    switch (newToken) {
        case 'clear':
            displayMatrix[currentIndex] = new Array();
            break;
        case 'clearall':
            displayMatrix = new Array(5).fill(new Array());
            currentIndex = 0;
            break;
        case '=':
            let answer = doCalc(displayMatrix[currentIndex]);
            displayMatrix[currentIndex].push('=');
            displayMatrix[currentIndex].push(answer);
            currentIndex = (currentIndex + 1) % displayMatrix.length;
            break;
        default:
            console.log(`Add to current line: ${newToken}`);
            displayMatrix[currentIndex].push(newToken);
            break;
    }

    updateDisplay(displayMatrix);
}

let displayMatrix = new Array(5);
let currentIndex = 0;
const displayDiv = document.querySelector('#display');
const inputsDiv = document.querySelector('#inputs');
inputsDiv.addEventListener('click', handleInput);