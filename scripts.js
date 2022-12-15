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

let displayValue = ""; //Global variable to store the numbers in display window

//Populate the display with user button inputs
function input(e) {
    const displayNumber = e.currentTarget.textContent;
    displayValue += displayNumber;
    display.innerHTML = displayValue;

    //Maximum input of 9 numbers, then number buttons do nothing
    if (displayValue.length === 9) {
        numberButtons.forEach(numberButton => numberButton.removeEventListener("click", input))
    }
}

const operators = document.querySelectorAll(".operator");
operators.forEach(operator => operator.addEventListener("click", operation));

//Declare global variables to store operands and operator
let firstOperand;
let secondOperand;
let operator;

//Store the operator and existing display number as operands
function operation(e) {

    //First, re-add the event listener for number buttons in case it was removed previously (if displayValue reached 9)
    numberButtons.forEach(numberButton => numberButton.addEventListener("click", input));

    //Save operator in global variable
    operator = e.currentTarget.id;

    //Store the displayValue as the first operand if first operand isn't already defined, otherwise, store as second operand if second operand isn't already defined.
    //if both defined, doesn't update the value here
    if (!firstOperand) {
        firstOperand = displayValue;
    }
    else if (!secondOperand) {
        secondOperand = displayValue;
    }

    //Reset the displayValue for next input, the actual display (innerHTML) will update in number button click function input
    displayValue = "";
}

const equals = document.querySelector(".equal");
equals.addEventListener("click", compute);

//Computes the operation using above global variables (firstOperand, secondOperand, and operator) when equals sign is clicked
function compute() {

    //If secondOperand is undefined, set secondOperand as currentDisplay value since firstOperand was already stored before "equals" sign was clicked
    if (!secondOperand) {
        secondOperand = displayValue;
    }

    //Compute the operation only when everything is defined
    if (operator && firstOperand && secondOperand) {
        displayValue = operate(operator, Number(firstOperand), Number(secondOperand));
        display.innerHTML = displayValue;
    }
}