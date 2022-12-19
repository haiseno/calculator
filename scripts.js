//Addition
function add(a, b) {
    return a + b;
}

//Subtraction
function subtract(a, b) {
    return a - b;
}

//Multiplication
function multiply(a, b) {
    return a * b;
}

//Division
function divide(a, b) {
    if (b === 0) {
        return "Error."
    }
    return a / b;
}

//Function that takes in an operator and two numbers as arguments and calls the appropriate operation to perform on the numbers
function operate(operator, a, b) {
    switch(operator) {
        case "plus":
            return add(a, b);
            break;
        case "minus":
            return subtract(a, b);
            break;
        case "times":
            return multiply(a, b);
            break;
        case "divide":
            return divide(a, b);
            break;
        default:
            return "Error."
    }
}

const display = document.querySelector(".display");
const numberButtons = document.querySelectorAll(".number");
numberButtons.forEach(numberButton => numberButton.addEventListener("click", input));

let currentInputValue = ""; //Global variable to store the numbers in display window

//Populate the display with user button inputs
function input(e) {
    const displayNumber = e.currentTarget.textContent;
    currentInputValue += displayNumber;
    display.innerHTML = currentInputValue;

    //Maximum input of 9 numbers, then number buttons do nothing
    if (currentInputValue.length === 9) {
        numberButtons.forEach(numberButton => numberButton.removeEventListener("click", input))
    }
}

const operators = document.querySelectorAll(".operator");
operators.forEach(operator => operator.addEventListener("click", operation));

//Declare global variables to store operands and operator
let firstOperand;
let secondOperand;
let operator;
let answer;

let equalsPressed = false;

//Store the operator and existing display number as operands
function operation(e) {

    //Re-add the event listener for number buttons in case it was removed previously (if currentInputValue reached 9)
    numberButtons.forEach(numberButton => numberButton.addEventListener("click", input));

    if (equalsPressed && operator !== "divide") {
        if (firstOperand) {
            currentInputValue = "";
            equalsPressed = false;
        }
        else {
            firstOperand = currentInputValue;
            currentInputValue = "";
            operator = e.currentTarget.id;
        }
    }
    else if (equalsPressed && operator === "divide") {
        currentInputValue = "";
        operator = e.currentTarget.id;
        equalsPressed = false;
    }

    if (operator && !equalsPressed) {
        compute();
        equalsPressed = false;
        operator = e.currentTarget.id;
        if(answer) {
            firstOperand = answer;
            secondOperand = 0;
            currentInputValue = "";
        }
    }
    else if (currentInputValue) {
        operator = e.currentTarget.id;

        if (operator && !equalsPressed) {
            //Assign user input value to global operand variables while resetting temp "holder" variable of currentInputValue for new user input
            if (!firstOperand) {
                firstOperand = currentInputValue;
                currentInputValue = "";
            }
            else if (!secondOperand) {
                secondOperand = currentInputValue;
                compute();
                equalsPressed = false;
                firstOperand = answer;
                secondOperand = 0;
                currentInputValue = "";
            }
        }
    }
}

const equals = document.querySelector(".equal");
equals.addEventListener("click", compute);

//Computes the operation using above global variables (firstOperand, secondOperand, and operator) when equals sign is clicked
function compute() {

    equalsPressed = true;

    //If secondOperand is undefined, set secondOperand as currentDisplay value since firstOperand was already stored before "equals" sign was clicked
    if (firstOperand && currentInputValue && !secondOperand) {
        secondOperand = currentInputValue;
    }

    //Compute the operation only when everything is defined
    if (operator && firstOperand && secondOperand !== "0" && currentInputValue) {
        answer = operate(operator, Number(firstOperand), Number(secondOperand));
        if (hasDecimal(answer)) {
            answer = decimalRounder(answer);
        }
        firstOperand = answer;
        secondOperand = 0;
        display.innerHTML = answer;
    }
    else if (secondOperand === "0") {
        allClear()
        display.innerHTML = "Divide by zero...?";
    }
}

//Converts a number to a string then rounds the decimal places for the entire number to be a length of 9 (10 including decimal place)
function decimalRounder(num) {
    let numberArray = num.toString().split(".");
    let beforeDecimalCount = numberArray[0].length;
    let maxDecimals = 9 - beforeDecimalCount;
    return Number(Number(numberArray.join(".")).toFixed(maxDecimals));
}

function hasDecimal(number) {
    return number - Math.floor(number) !== 0;
}

const clear = document.querySelector(".clear");
clear.addEventListener("click", allClear)

function allClear() {
    currentInputValue = "";
    display.innerHTML = 0;
    firstOperand = void 0;
    secondOperand = void 0;
    answer = void 0;
    operator = void 0;
    equalsPressed = false;
}

const decimal = document.querySelector(".decimal");
decimal.addEventListener("click", addDecimal);

function addDecimal(e) {
    if (!currentInputValue.includes(".")) {
        const decimalPoint = e.currentTarget.textContent;
        currentInputValue += decimalPoint;
        display.innerHTML = currentInputValue;
    }
}

const sign = document.querySelector(".sign");
sign.addEventListener("click", invertSign);

function invertSign() {
    if (!currentInputValue.includes("-")) {
        currentInputValue = "-" + currentInputValue;
        display.innerHTML = currentInputValue;
    }
    else {
        currentInputValue = currentInputValue.slice(1);
        display.innerHTML = currentInputValue;
    }
}

const del = document.querySelector(".delete");
del.addEventListener("click", deleteNumber);

function deleteNumber() {
    currentInputValue = currentInputValue.slice(0, currentInputValue.length - 1);
    display.innerHTML = currentInputValue;
}