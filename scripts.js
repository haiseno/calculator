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

//Takes in an operator and two numbers as arguments and calls the appropriate operation to perform on the numbers
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

//Declare global variables to store operands, operator and answer
let currentInputValue = 0; //This keeps track of user input, default number 0
let firstOperand;
let secondOperand;
let operator;
let answer;
let equalsPressed = false; //Switch-like variable to keep track of whether computation result was from explictly pressing equals sign or from chaining operations in operator function below

//Is the operand/number a truthy and valid value, including number 0
function exists(operand) {
    return operand || operand === 0;
}

const display = document.querySelector(".display");
const numberButtons = document.querySelectorAll(".number");
numberButtons.forEach(numberButton => numberButton.addEventListener("click", input));

let numButtonsEvent = true; //Keeps track if the numberButtons event is on

//Populate the display with user button inputs
function input(e) {

    //The purpose of this equals pressed check is to ensure that any unintentional or intentional number button input following an operation will be regarded as starting anew
    if (equalsPressed) {
        allClear();
    }

    //Checks if it's the very start of the calculation to clear out the default 0 set above into an empty string for concatenation
    //Or if the user inputted 0 manually, it also won't concatenate multiple leading 0s
    if (currentInputValue === 0 || currentInputValue === "0") {
        currentInputValue = "";
    }
    //Checks if the negative/invert sign button was pressed at the beginning to prevent concatenation of leading 0
    else if (currentInputValue.toString().includes("-") && currentInputValue.toString().charAt(1) === "0") {
        currentInputValue = "-";
    }

    //Concatenates user number input to the current input value (on the display)
    const displayNumber = e.currentTarget.textContent;
    currentInputValue += displayNumber;
    display.textContent = currentInputValue;
    
    //Maximum input of 9 numbers, then disable number buttons
    if (currentInputValue.length === 9) {
        numberButtons.forEach(numberButton => numberButton.removeEventListener("click", input))
        numButtonsEvent = false;
    }
}

const operators = document.querySelectorAll(".operator");
operators.forEach(operator => operator.addEventListener("click", operation));

//Store the operator for operation and current input value as operands, computes the operation without needing to press equals button when chaining operations
function operation(e) {

    //Re-add the event listener for number buttons if it was removed previously during number button input
    if (!numButtonsEvent) {
        numberButtons.forEach(numberButton => numberButton.addEventListener("click", input));
    }

    //The purpose of this equals pressed check is to allow the user to chain operations
    if (equalsPressed) {
        operator = e.currentTarget.id;
        reset();
    }
    //Assign current input value to the first operand if undefined, while also clearing out current input value for next user number input
    else if (!exists(firstOperand)) {
        firstOperand = Number(currentInputValue);
        operator = e.currentTarget.id;
        currentInputValue = 0;
    }
    //Allows for chaining of operations and computing the answer to the display without having to press the equals button
    else if (exists(firstOperand) && exists(currentInputValue) && operator) { //If an operator exists, meaning we are in the middle of operations (regular or chaining), compute the answer with existing operands and operator before saving the new operator that was pressed for next calculation. The new operator button acts as an equal sign
        compute();
        operator = e.currentTarget.id;
        reset();
    }
}

//Sets the answer to the calculation as the first operand and resets calculator to be ready for further calculation
function reset() {
    firstOperand = answer; //Answer from previous calculation is stored as first operand
    secondOperand = void 0; //Reset for new input
    currentInputValue = 0; //Reset for new input
    answer = void 0;
    equalsPressed = false; //Turn off switch because we are computing not by pressing equals button
}

const equals = document.querySelector(".equal");
equals.addEventListener("click", compute);

//Computes the operation
//Pressing equals repeatedly after a calculation also has the added feature of incrementing/decrementing using the last operand and operator in memory
function compute() {

    if (!numButtonsEvent) {
        numberButtons.forEach(numberButton => numberButton.addEventListener("click", input));
    }

    //If second operand is undefined, assign current input value as second operand since first operand is already defined
    if (firstOperand && !exists(secondOperand)) {
        secondOperand = Number(currentInputValue);
    }

    //Equals pressed switch only turn on if operands and operators exist
    if (exists(firstOperand) && exists(secondOperand) && operator) {
        equalsPressed = true;
    }

    //Checks for dividing by zero case
    if (secondOperand === 0 && operator === "divide") {
        allClear()
        display.textContent = "Divide by zero...?";
    }
    //Computes only if everything is defined
    else if (exists(firstOperand) && exists(secondOperand) && operator) {
        answer = operate(operator, firstOperand, secondOperand);

        //Rounds the answer to not exceed display size limit
        if (hasDecimal(answer)) {
            answer = decimalRounder(answer);
        }
        
        //Set answer from above as first operand for potential chain calculation
        //Also allows for the increment/decremet feature mentioned above by only resetting the values to a semi-initial state, very similar to the reset() function above that is used in operator function
        firstOperand = answer;
        display.textContent = answer;
        currentInputValue = 0;
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

//Clear button hard resets calculator "memory" back to initial declaration state
const clear = document.querySelector(".clear");
clear.addEventListener("click", allClear)

function allClear() {
    currentInputValue = 0;
    display.textContent = 0;
    firstOperand = void 0;
    secondOperand = void 0;
    operator = void 0;
    answer = void 0;
    equalsPressed = false;

    if (!numButtonsEvent) {
        numberButtons.forEach(numberButton => numberButton.addEventListener("click", input));
    }
}

//Allows user input of floating point numbers
const decimal = document.querySelector(".decimal");
decimal.addEventListener("click", addDecimal);

function addDecimal(e) {
    if (equalsPressed) {
        allClear();
    }

    if (!currentInputValue.toString().includes(".")) {
        const decimalPoint = e.currentTarget.textContent;
        currentInputValue += decimalPoint;
        display.textContent = currentInputValue;
    }
}

//Allows user to invert the sign of the current input value
const sign = document.querySelector(".sign");
sign.addEventListener("click", invertSign);

function invertSign() {
    if (equalsPressed) {
        allClear();
    }

    //If current input value is positive, add a negative sign to the front
    if (!currentInputValue.toString().includes("-")) {
        currentInputValue = "-" + currentInputValue;
        display.textContent = currentInputValue;
    }
    //Otherwise, if it's already negative, remove the negative sign
    else {
        currentInputValue = currentInputValue.slice(1);
        display.textContent = currentInputValue;
    }
}

//Deletes the last inputted character
const del = document.querySelector(".delete");
del.addEventListener("click", deleteNumber);

function deleteNumber() {
    if (!numButtonsEvent) {
        numberButtons.forEach(numberButton => numberButton.addEventListener("click", input));
    }

    if (equalsPressed) {
        allClear();
    }

    currentInputValue = currentInputValue.toString().slice(0, currentInputValue.length - 1);

    //Does not delete current input value's default 0 to prevent unwanted empty current input value string
    if (currentInputValue === "") {
        currentInputValue = 0;
        display.textContent = 0;
    }
    else {
        display.textContent = currentInputValue;
    }
}