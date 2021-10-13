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

function parseLine(line) {
    let stringOperation = line.join('');
    let regex = /^([-]?\d*\.?\d*)([\/\*\-\+])?([-]?\d*\.?\d*)?$/gi;
    let found = regex.exec(stringOperation);
    return (found) ? found.slice(-3) : null;
}

function doCalc(line) {
    const [x, operation, y] = parseLine(line);

    if (+y === 0 && operation === '/') {
        return '/0';
    }

    switch (operation) {
        case '+':
            return doAdd(+x, +y);
            break;
        case '-':
            return doSubtract(+x, +y);
            break;
        case '*':
            return doMultiply(+x, +y);
            break;
        case '/':
            return doDivide(+x, +y);
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

    if (displayMatrix[currentIndex] == undefined) {
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

        case '-':
        case '+':
        case '*':
        case '/':
        case '=':
        case 'Enter':
            if (skipCalc === null) {

                /** We have an action
                 * If !(termCheck.at(-1) == undefined { // We have all three terms
                 *      get answer
                 *      check for /0
                 *      round answer
                 *      add new line
                 *      add value to new line
                 *      if action was operation, add that too
                 * 
                 */ 



                if (!(termCheck.at(-1) == undefined) && !(doOps.includes(displayMatrix[currentIndex].at(-1)))) {
                    let answer = doCalc(displayMatrix[currentIndex]);
                    
                    if (answer === '/0') {
                        alert('Divide by zero, try another divisor!');
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