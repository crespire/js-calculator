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

function doCalc(...queue) {

}

function handleInput(event) {
    console.dir(event);
}

let currentQueue = [];
const inputsDiv = document.querySelector("#inputs");
inputsDiv.addEventListener('click', handleInput);