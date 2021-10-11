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
    if (line === undefined) return;
    
    let operations = line.filter(e => doOps.includes(e));
    let parsedLine = new Array;
    let termTrack = 0;

    if (operations.length > 0) {
        operations.forEach((operator, currInd) => {
            let term = line.slice(termTrack, line.indexOf(operator)).join('');
            parsedLine.push(term);
            termTrack = line.indexOf(operator)+1;
            if (currInd === operations.length - 1 && line.length > 2) {
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
    const [x, y] = getTerms(line);
    const operation = line.find(e => doOps.includes(e));

    console.log(`Doing ${x} ${operation} ${y}`);
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

function updateDisplay(displayData) {
    displayDiv.innerHTML = '';

    displayData.forEach((line) => {
        let newDiv = document.createElement('div');
        let lineText = [];
        line.forEach( (token) => {
            if (doOps.includes(token)) {
                lineText.push(` ${token} `);
            } else {
                lineText.push(token);
            }
        });
        newDiv.textContent = lineText.join('');
        displayDiv.appendChild(newDiv);
    });
}

function mapKeyboard(event) {
    // Map keyboard presses and call handleInput
}

function handleInput(event) {
    let newToken = event.target.id;
    let termCheck = getTerms(displayMatrix[currentIndex]);
    let stopAdd = null;
    
    if (displayMatrix[currentIndex] === undefined) {
        displayMatrix[currentIndex] = new Array();
    }

    switch (newToken) {
        case 'inputs':
            break;

        case 'clear':
            displayMatrix[currentIndex] = new Array();
            break;
 
        case 'clearall':
            displayMatrix = new Array();
            currentIndex = 0;
            break;

        case '.':
            if (doOps.includes(displayMatrix[currentIndex].at(-1))) {
                stopAdd = false;
            } else if (termCheck === undefined || termCheck.length === 0) {
                stopAdd = false;
            } else if (termCheck.length >= 1) {
                termCheck.forEach((term) => {
                    stopAdd = false;
                    if (term.toString().includes('.')) stopAdd = true;
                });
            }

            if (stopAdd) break;

        case '+':
        case '-':
        case '*':
        case '/':
        case '=':
            if (termCheck === undefined || termCheck.length === 0) {
            } else if (termCheck.length === 0 && stopAdd === null) {
                break;                
            } else if (termCheck.length === 1 && doOps.includes(displayMatrix[currentIndex].at(-1)) && stopAdd === null) {
                // Change operation
                displayMatrix[currentIndex].splice(-1, 1, newToken);
                break;
            } else if (termCheck.length >= 2 && stopAdd === null) {
                let answer = doCalc(displayMatrix[currentIndex]);
                currentIndex = (currentIndex + 1)
                if (displayMatrix.length === 5) displayMatrix.shift();
                displayMatrix[currentIndex] = new Array();
                displayMatrix[currentIndex].push(answer);
                if (doOps.includes(newToken)) {
                    displayMatrix[currentIndex].push(newToken);
                }
                break;
            }
        default:
            displayMatrix[currentIndex].push(newToken);
            break;
    }

    updateDisplay(displayMatrix);
}

let displayMatrix = new Array();
let currentIndex = 0;
const doOps = ['+', '-', '*', '/'];
const displayDiv = document.querySelector('#display');
const inputsDiv = document.querySelector('#inputs');
inputsDiv.addEventListener('click', handleInput);