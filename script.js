function doAdd(x, y) {
    return +x + +y;
}

function doSubtract(x, y) {
    return +x - +y;
}

function doMultiply(x, y) {
    return +x * +y;
}

function doDivide(x, y) {
    return +x / +y;
}

function getTerms(line) {
    const doOps = ['+', '-', '*', '/'];
    let operations = line.filter(e => doOps.includes(e));
    let parsedLine = new Array;

    /**
     * For each operator
     *  Get index, and split the previous term out. Push this to parsedLine
     *  if index = length, then this is the last operator, so get last element too
     */

    let termTrack = 0;
    if (operations.length > 0) {
        operations.forEach((operator, currInd) => {
            let currentStartIndex = termTrack;
            let currentEndIndex = line.indexOf(operator);
            let term = line.slice(currentStartIndex, currentEndIndex).join('');
            parsedLine.push(term);
            termTrack = line.indexOf(operator)+1;
            if (currInd === operations.length - 1) {
                term = line.slice(line.indexOf(operator) - (line.length - 1) ).join('');
                parsedLine.push(term);
            }
        });
    } else {
        parsedLine = line.slice();
    }

    return parsedLine;
}

function doCalc(line) {
    const doOps = ['+', '-', '*', '/'];
    const operands = getTerms(line);
    const operation = line.find(e => doOps.includes(e));

    let x = operands[0];
    let y = operands[1];

    console.log(`Doing ${operands}`);
    switch (operation) {
        case '+':
            return doAdd(x, y);
            break;
        case '-':
            return doSubtract(x, y);
            break;
        case '*':
            return doMultiply(x, y);
            break;
        case '/':
            return doDivide(x, y);
            break;
     }
}

function updateDisplay(display) {
    displayDiv.innerHTML = '';

    display.forEach((line) => {
        let newDiv = document.createElement('div');
        let lineText = [];
        line.forEach( (token) => {
            if (['+','-','*','/','='].includes(token)) {
                lineText.push(` ${token} `);
            } else {
                lineText.push(token);
            }
        });
        newDiv.textContent = lineText.join('');
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
    
    if (displayMatrix[currentIndex] === undefined) {
        displayMatrix[currentIndex] = new Array();
    }

    switch (newToken) {
        case 'clear':
            displayMatrix[currentIndex] = new Array();
            break;
        case 'clearall':
            displayMatrix = new Array();
            currentIndex = 0;
            break;
        case '=':
            let answer = doCalc(displayMatrix[currentIndex]);
            console.log(`Got Anwer: ${answer}`);
            currentIndex = (currentIndex + 1)
            if (displayMatrix.length === 5) displayMatrix.shift();
            displayMatrix[currentIndex] = new Array();
            displayMatrix[currentIndex].push(answer);
            break;
        case '.':
            let decimalCheck = getTerms(displayMatrix[currentIndex]);
            let stopAdd = null;

            if (['+', '-', '*', '/'].includes(displayMatrix[currentIndex][-1])) {
                // Last element is an operator, so this is a new term, we will break
                stopAdd = false;   
            } else if (decimalCheck.length >= 1) {
                decimalCheck.forEach((term) => {
                    stopAdd = false;
                    if (term.toString().includes('.')) stopAdd = true;
                });
            }
            if (stopAdd) break;
        default:
            console.log(`Add to current line: ${newToken}`);
            displayMatrix[currentIndex].push(newToken);
            break;
    }

    updateDisplay(displayMatrix);
    console.dir(displayMatrix);
    console.log(currentIndex);
}

let displayMatrix = new Array();
let currentIndex = 0;
const displayDiv = document.querySelector('#display');
const inputsDiv = document.querySelector('#inputs');
inputsDiv.addEventListener('click', handleInput);