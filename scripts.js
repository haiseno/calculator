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
        case "+":
            return add(a, b);
            break;
        case "-":
            return subtract(a, b);
            break;
        case "*":
            return multiply(a, b);
            break;
        case "/":
            return divide(a, b);
            break;
        default:
            return "Error."
    }
}

const display = document.querySelector(".display");
const numberButtons = document.querySelectorAll(".number");
numberButtons.forEach(numberButton => numberButton.addEventListener("click", input));

let displayValue = "";

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