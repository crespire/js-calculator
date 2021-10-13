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
    if (line === undefined || line.length === 0) return [];
    /**
     * Sample inputs to handle
     * ['-', '5', '+', '-', '6'] => 3 operators, case of two negative numbers
     * ['-', '5', '-', '6'] or ['5', '-', '-', '6'] => 2 operators, case of one negative number.
     * ['5', '+', '6'] or ['-', '5']=> 1 operator, either 1 negative number, or line incomplete.
     * 
     */

    let stringOperation = line.join('');
    let regex = /^(\-?\d*\.?\d*)([\/\*\-\+]{1})?(\-?\d*\.?\d*)?$/g;
    let found = regex.exec(stringOperation);
    // [index 0 is always the joined string, index 1 is the first term, index 2 is the operation, and index 3 is the last term], undefined values = not found
    return found.slice(-3);
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
            let stopAdd = null;
            if (termCheck[1] === undefined && termCheck[0].includes) {
                stopAdd = true;
            } else {
                stopAdd = false;
            }
            
            if (termCheck[1].length > 0 && termCheck[2].length > 0 && termCheck[2].includes('.')) {
                stopAdd = true;
            }

            if (stopAdd) break;

        case '+':
        case '-':
        case '*':
        case '/':
        case '=':
        case 'Enter':
            
            if (stopAdd === null) {

                // if the last term is undefined, we hit the wrong button so either ignore it, or change the operation
                if (termCheck[2] === undefined && doOps.includes(termCheck[1])) {
                    displayMatrix[currentIndex].splice(-1, 1, newToken);
                    break;
                } else if (termCheck[2] === undefined && (newToken === 'Enter' || newToken === '=')) {
                    break;
                }
                
                if (termCheck[2].length > 0) { // If the last term is defined, then do calculation
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