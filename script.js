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
    
    // let operations = line.filter(e => doOps.includes(e));
    let parsedLine = new Array;

    /**
     * Sample inputs to handle
     * ['-', '5', '+', '-', '6'] => 3 operators, case of two negative numbers
     * ['-', '5', '-', '6'] or ['5', '-', '-', '6'] => 2 operators, case of one negative number.
     * ['5', '+', '6'] or ['-', '5']=> 1 operator, either 1 negative number, or line incomplete.
     * 
     * 
     * if we have 3 operations, then we know that we have a two negative numbers. So we can do some fancy array shit to split it. full array to string, split by the middle operator and there are your terms.
     * if we have 2 operations, then we have one negative number. The negative that is preceeded by another one marks the start of our split.
     * If we have 1 operation, then we have either one negative number or two terms.
     */

    let stringOperation = line.join('');
    let regex = /(-?\d+){1}([+/*-])?(-?\d+)?/g;
    let found = regex.exec(stringOperation);
    //let found = stringOperation.matchAll(regex);
    return found;


    /** Not best practice to comment out old code, but here we are.
    if (operations.length === 1) {
        operations.forEach((operator, currInd) => {
            let term = line.slice(termTrack, line.indexOf(operator)).join('');
            parsedLine.push(term);
            termTrack = line.indexOf(operator)+1;
            if (currInd === operations.length - 1 && line.length > 2) {
                term = line.slice(line.indexOf(operator) - (line.length - 1) ).join('');
                parsedLine.push(term);
            }
        });
    } else if (operations.length === 2) {
        
    } else {
        parsedLine = Array(line.join(''));
    }
     */

    //return parsedLine;
}

function doCalc(line) {
    const [x, y] = getTerms(line);
    const operation = line.find(e => doOps.includes(e));

    if (y === '0' && operation === '/') {
        return '/0';
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

    let cropDisplay = displayData.slice(-5);

    cropDisplay.forEach((line) => {
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
    event.preventDefault();

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
            }
            
            if (stopAdd === null) {
                if (termCheck.length === 1) {
                    if (doOps.includes(displayMatrix[currentIndex].at(-1))) {
                        displayMatrix[currentIndex].splice(-1, 1, newToken);
                        break;
                    } else if (newToken === 'Enter' || newToken === '=') {
                        break;
                    }
                } else {
                    let answer = doCalc(displayMatrix[currentIndex]);
                    
                    if (answer === '/0') {
                        alert('Divide by zero... try another divisor.');
                        displayMatrix[currentIndex].pop();
                        break;
                    } else {
                        answer = +answer.toFixed(3);
                    }
                    
                    currentIndex += 1;                    
                    displayMatrix[currentIndex] = [...answer.toString()];
                    
                    if (doOps.includes(newToken)) {
                        displayMatrix[currentIndex].push(newToken);
                    }

                    break;
                }
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