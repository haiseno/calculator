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

//Store the operator and existing display number as operands
function operation(e) {

    //Re-add the event listener for number buttons in case it was removed previously (if currentInputValue reached 9)
    numberButtons.forEach(numberButton => numberButton.addEventListener("click", input));

    if (operator) {
        compute();
        operator = e.currentTarget.id;
        firstOperand = answer;
        secondOperand = 0;
        currentInputValue = "";
    }
    else {
        operator = e.currentTarget.id;

        //Assign user input value to global operand variables while resetting temp "holder" variable of currentInputValue for new user input
        if (!firstOperand) {
            firstOperand = currentInputValue;
            currentInputValue = "";
        }
        else if (!secondOperand) {
            secondOperand = currentInputValue;
            compute();
            firstOperand = answer;
            secondOperand = 0;
            currentInputValue = "";
        }
    }
}

const equals = document.querySelector(".equal");
equals.addEventListener("click", compute);

//Computes the operation using above global variables (firstOperand, secondOperand, and operator) when equals sign is clicked
function compute() {

    //If secondOperand is undefined, set secondOperand as currentDisplay value since firstOperand was already stored before "equals" sign was clicked
    if (!secondOperand) {
        secondOperand = currentInputValue;
    }

    //Compute the operation only when everything is defined
    if (operator && firstOperand && secondOperand) {
        answer = operate(operator, Number(firstOperand), Number(secondOperand));
        if (hasDecimal(answer)) {
            answer = Number(decimalRounder(answer));
        }
        display.innerHTML = answer;
    }
}

//Converts a number to a string then rounds the decimal places for the entire number to be a length of 9 (10 including decimal place)
function decimalRounder(num) {
    let numberArray = num.toString().split(".");
    let beforeDecimalCount = numberArray[0].length;
    let maxDecimals = 9 - beforeDecimalCount;
    return Number(numberArray.join(".")).toFixed(maxDecimals);
}

function hasDecimal(number) {
    return number - Math.floor(number) !== 0;
}