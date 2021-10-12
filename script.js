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
        parsedLine = Array(line.join(''));
    }

    return parsedLine;
}

function doCalc(line) {
    const [x, y] = getTerms(line);
    const operation = line.find(e => doOps.includes(e));

    if (y === '0' && operation === '/') {
        return "Div by Zero";
    }

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

function handleInput(event) {
    event.preventDefault();
    let newToken = null;
    let stopAdd = null;
    const sanitize = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '=', '/', '*', '-', '+', '.', 'c', 'x', 'Enter', 'Backspace', 'Escape'];

    if (event.type === 'keydown') {
        newToken = event.key;
    } else if (event.type === 'click') {
        newToken = event.target.id;
    } else {
        newToken = '_';
    }

    if (!sanitize.includes(newToken)) {
        console.log(`Got invalid key: ${newToken}`);
        return;
    }

    if (displayMatrix[currentIndex] === undefined) {
        displayMatrix[currentIndex] = new Array();
    }

    let termCheck = getTerms(displayMatrix[currentIndex]);

    switch (newToken) {
        case 'Backspace':
            if (displayMatrix[currentIndex].length > 0) {
                displayMatrix[currentIndex].pop();
            }
            break;

        case 'Escape':
        case 'c':
            displayMatrix[currentIndex] = new Array();
            break;
 
        case 'x':
            displayMatrix = new Array();
            currentIndex = 0;
            break;

        case '.':
            if (doOps.includes(displayMatrix[currentIndex].at(-1))) {
                stopAdd = false;
            } else if (termCheck === undefined || termCheck.length === 0) {
                stopAdd = false;
            } else if (termCheck.length >= 1) {
                stopAdd = false;
                termCheck.forEach((term) => {
                    if (term.toString().includes('.')) stopAdd = true;
                });
            }

            if (stopAdd) break;

        case '+':
        case '-':
        case '*':
        case '/':
        case '=':
        case 'Enter':
            if (termCheck === undefined || termCheck.length === 0) {
                break;              
            } else if (termCheck.length === 1 && doOps.includes(displayMatrix[currentIndex].at(-1)) && stopAdd === null) {
                displayMatrix[currentIndex].splice(-1, 1, newToken);
                break;
            } else if (termCheck.length >= 2 && stopAdd === null) {
                let answer = doCalc(displayMatrix[currentIndex]);
                if (answer === 'Div by Zero') {
                    alert('Divide by Zero!');
                    break;
                } else {
                    answer.toFixed(3).toString();
                }
                currentIndex += 1;
                if (displayMatrix.length >= 5) displayMatrix.shift();
                displayMatrix[currentIndex] = [...answer];
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
window.addEventListener('keydown', handleInput);