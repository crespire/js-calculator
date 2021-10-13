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

function parseLine(line) {
    let stringOperation = line.join('');
    let regex = /^([-]?\d*\.?\d*)([\/\*\-\+])?([-]?\d*\.?\d*)?$/gi;
    let found = regex.exec(stringOperation);
    // [index 0 is always the joined string, index 1 is the first term, index 2 is the operation, and index 3 is the last term], undefined values = not found
    return (found) ? found.slice(-3) : null;
}

function doCalc(line) {
    const [x, operation, y] = parseLine(line);

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
    let skipCalc = null;
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

    let termCheck = [...parseLine(displayMatrix[currentIndex])];

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
            // Which term are we error checking?
            // If there is no operator, we're looking at the first
            // Otherwise, if there is an operator, but there is no second term, new term, so add it.
            // otherwise, there is a second term already so check it and don't add a second one.

            if (termCheck.at(0) == undefined) {
                skipCalc = false;
            } else if (termCheck.at(1) == undefined) {
                skipCalc = termCheck[0].includes('.');
            } else if (termCheck[1].length === 1 && (termCheck.at(-1) == undefined || termCheck.at(-1).length < 1)) {
                skipCalc = false;
            } else {
                skipCalc = termCheck.at(-1).includes('.');
            }
            

            if (skipCalc) break;

        case '+':
        case '-':
        case '*':
        case '/':
        case '=':
        case 'Enter':
                        
            if (skipCalc === null) {
                // parseLine returns null if the calculation is malformed, but it will happily return a 3 element array if everything fits into the pattern.
                // If the last term is not undefined (ie, whatever we parsed is valid and filled up all three elements), then do the calculation
                //   Advance the index, push the answer and add the current token if we have another operator
                // If we have an undefined last term, then whatever we have up until now is fine, add the token.
                // If we have a null value from parseLine, whatever was entered last was not correctly formed, so remove that element and break (don't add the current token)

                if (!(termCheck.at(-1) == undefined)) {
                    let answer = doCalc(displayMatrix[currentIndex]);
                    
                    if (answer === '/0') {
                        alert('Divide by zero, try another divisor');
                        displayMatrix[currentIndex].pop();
                        break;
                    }

                    answer = +answer.toFixed(3);
                    currentIndex += 1;
                    displayMatrix[currentIndex] = new Array();
                    displayMatrix[currentIndex] = [...answer.toString()];
                    if (doOps.includes(newToken)) {
                        displayMatrix[currentIndex].push(newToken);
                    }
                    break;
                } else if (doOps.includes(termCheck.at(1)) && doOps.includes(newToken)) {
                    if (!(newToken === '-')) {
                        displayMatrix[currentIndex].splice(-1,1,newToken);
                        break;
                    } else {
                        if (!(termCheck.at[-1] == undefined)) {
                            break;
                        }
                    }
                    
                } else if (termCheck === null) {
                    displayMatrix[currentIndex].pop();
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
let skipCalc = null;
const doOps = ['+', '-', '*', '/'];
const displayDiv = document.querySelector('#display');
const inputsDiv = document.querySelector('#inputs');
inputsDiv.addEventListener('click', handleInput);
window.addEventListener('keydown', handleInput);