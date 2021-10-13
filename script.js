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
    /**
     * Sample inputs to handle
     * ['-', '5', '+', '-', '6'] => 3 operators, case of two negative numbers
     * ['-', '5', '-', '6'] or ['5', '-', '-', '6'] => 2 operators, case of one negative number.
     * ['5', '+', '6'] or ['-', '5']=> 1 operator, either 1 negative number, or line incomplete.
     * 
     */

    let stringOperation = line.join('');
    let regex = /^(\-?\d*\.?\d+)([\/\*\-\+]{1})?(\-?\d*\.?\d+)?$/g;
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
            // If there is no operator, we're looking at the first otherwise we're looking at the second.
            // If that term has a decimal already, don't add a second one.

            if (termCheck[0] === undefined) {
                skipCalc = false;
            } else if (termCheck[1] === undefined) {
                skipCalc = termCheck[0].includes('.');
            } else if (termCheck[1].length === 1 && termCheck[-1] === undefined) {
                skipCalc = false;
            } else {
                skipCalc = termCheck[-1].includes('.');
            }
            

            if (skipCalc) break;

        case '+':
        case '-':
        case '*':
        case '/':
        case '=':
        case 'Enter':
                        
            if (skipCalc === null) {
                
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