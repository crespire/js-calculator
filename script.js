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
    const doOps = ['+', '-', '*', '/'];
    const x, y = getTerms(line);
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
        /**
         * add cases for operator signs that flow into the '=' case as well and check if there are two terms.
         * If two terms, go to '=' case; otherwise if only 1 term, change the operation, otherwise there isn't a term, ignore the input.
         */
        case '=':
            /** 
             * Have to check for if there's only one term. If there are two terms, then do answer stuff otherwise, ignore input.
             */
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

            if (['+', '-', '*', '/'].includes(displayMatrix[currentIndex].at(-1))) {
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
    //console.dir(displayMatrix);
    //console.log(currentIndex);
}

let displayMatrix = new Array();
let currentIndex = 0;
const displayDiv = document.querySelector('#display');
const inputsDiv = document.querySelector('#inputs');
inputsDiv.addEventListener('click', handleInput);