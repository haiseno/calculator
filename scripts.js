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
let endOfCalc = false; //Switch-like variable to keep track of whether computation result was from explictly pressing equals sign or from chaining operations in operator function below

//Is the operand/number a truthy and valid value, including number 0
function exists(variable) {
    return variable || variable === 0;
}

let firstOperandLength; //For slicing history content below

const history = document.querySelector(".history");
const display = document.querySelector(".display");
const numberButtons = document.querySelectorAll(".number");
numberButtons.forEach(numberButton => numberButton.addEventListener("click", input));

let numButtonsEvent = true; //Keeps track if the numberButtons event is on

//Populate the display with user button inputs
function input(e) {
    //In the invert sign function below, if the user inverts the sign, the current input value is set to equal the first operand value concatenated with a "-", this condition resets the current input value to default 0 for that specific scenario
    if (endOfCalc && currentInputValue.toString().includes("-") && !currentInputValue.toString().includes(".")) {
        currentInputValue = 0;
    }

    //Prevents concatenation of multiple leading 0s and sets up current input value for user input concatenation
    if (currentInputValue === 0 || currentInputValue === "0") {
        currentInputValue = "";
    }
    //Checks if the negative/invert sign button was pressed at the beginning to prevent concatenation of leading 0
    //Also verify that it doesn't include decimal "." otherwise example: "-0.2" would become "-2" when the "2" is inputted
    else if (currentInputValue.toString().includes("-") && currentInputValue.toString().charAt(1) === "0" && !currentInputValue.toString().includes(".")) {
        currentInputValue = "-";
    }

    //Concatenates user number input to the current input value (on the display)
    const displayNumber = e.currentTarget.textContent;
    currentInputValue += displayNumber;
    display.textContent = currentInputValue;

    //If user is inputting a number instead of an operator following a computation, the user is likely trying to start a new computation
    //First operand delegation goes here instead of when operator key is pressed
    if (endOfCalc) {
        //Assign OLD first operand length here for cases where inputted first operand after computation is longer in length than the previous first operand. ex: user computes 2 + 3 (first operand length "2" is 1), then user inputs 600, which would slice the history content an extra 2 characters
        firstOperandLength = firstOperand.toString().length;
        firstOperand = Number(currentInputValue);
    }
    
    //Maximum input of 9 numbers (or 10 if there's a negative sign), then disable number buttons
    if ((!currentInputValue.toString().includes("-") && !currentInputValue.toString().includes(".")) && currentInputValue.length === 9) {
        numberButtons.forEach(numberButton => numberButton.removeEventListener("click", input))
        numButtonsEvent = false;
    }
    else if (currentInputValue.length === 10) {
        numberButtons.forEach(numberButton => numberButton.removeEventListener("click", input))
        numButtonsEvent = false;
    }
}

const operators = document.querySelectorAll(".operator");
operators.forEach(operator => operator.addEventListener("click", operation));

//Store the operator for operation and current input value as operands, computes the operation without needing to press equals button when chaining operations
function operation(e) {
    //Allow user to chain operations using result from their previous computation
    if (endOfCalc) {
        currentInputValue = 0;
        firstOperand = answer;
        secondOperand = undefined;
        answer = undefined;
        operator = e.currentTarget.id;
        endOfCalc = false;
        history.textContent = `${firstOperand} ${e.currentTarget.textContent}`;
    }
    //Assign current input value to the first operand if undefined, while also clearing out current input value for next user number input
    else if (!exists(firstOperand)) {
        firstOperand = Number(currentInputValue);
        operator = e.currentTarget.id;
        history.textContent = `${firstOperand} ${e.currentTarget.textContent}`;
        currentInputValue = 0;
    }
    //Allows for chaining of operations and computing the answer to the display without having to press the equals button
    //If an operator exists, meaning we are in the middle of operations (regular or chaining), compute the answer with existing operands and operator before saving the new operator that was pressed for next calculation. The new operator button acts as an equal sign
    else if (exists(firstOperand) && currentInputValue && operator) {
        compute();
        operator = e.currentTarget.id;
        history.textContent = `${answer} ${e.currentTarget.textContent}`;
        reset();
    }
    //Allows user to change their operator choice midway through calculation
    else {
        operator = e.currentTarget.id;
        history.textContent = `${firstOperand} ${e.currentTarget.textContent}`;
    }

    //Re-add the event listener for number buttons if it was removed previously during number button input
    if (!numButtonsEvent) {
        numberButtons.forEach(numberButton => numberButton.addEventListener("click", input));
    }
}

//Sets the answer to the calculation as the first operand and resets calculator to be ready for further calculation
function reset() {
    firstOperand = answer; //Answer from previous calculation is stored as first operand
    secondOperand = undefined; //Reset for new input
    currentInputValue = 0; //Reset for new input
    answer = undefined;
    endOfCalc = false; //Turn off switch because we are computing not by pressing equals button
}

const equals = document.querySelector(".equal");
equals.addEventListener("click", compute);

//Computes the operation
//Pressing equals repeatedly after a calculation also has the added feature of incrementing/decrementing using the last operand and operator in memory
function compute() {

    let slicedHistory; //For decrementing with the equals button we need to only slice out the first operand in the history content and replace it with a new first operand

    //If second operand is undefined, assign current input value as second operand since first operand is already defined
    //For normal "operand 1 + operand 2 = " computations
    if (exists(firstOperand) && !exists(secondOperand) && currentInputValue) {
        secondOperand = Number(currentInputValue);
    }
    //First operands exists but no second operand, default second operand = first operand
    //For cases where user inputs a number and an operator but nothing else, then presses equals
    else if (exists(firstOperand) && !exists(secondOperand) && !currentInputValue) {
        secondOperand = firstOperand;
    }
    //Set answer from previous computation as first operand for potential chain calculation
    else if (endOfCalc && !currentInputValue) {
        //Grab OLD first operand length before assigning first operand to previous computation answer for case where the the answer is longer than the old first operand length, which would slice one extra character when history content is sliced below
        firstOperandLength = firstOperand.toString().length;
        firstOperand = answer;
    }

    //Checks for dividing by zero case
    if (secondOperand === 0 && operator === "divide") {
        allClear()
        display.textContent = "Divide by zero...?";
    }
    //Computes only if everything is defined and allow chaining of operation
    else if (exists(firstOperand) && exists(secondOperand) && operator) {
        answer = operate(operator, Number(firstOperand), Number(secondOperand));

        //Rounds the answer to not exceed display size limit
        if (hasDecimal(answer)) {
            answer = decimalRounder(answer);
        }
        
        //Update display and operation history
        display.textContent = answer;

        if (!endOfCalc) {
            if (secondOperand.toString().includes("-")) {
                history.textContent += ` (${secondOperand}) =`
            }
            else {
                history.textContent += ` ${secondOperand} =`
            }
        }
        else {
            slicedHistory = history.textContent.slice(firstOperandLength);
            history.textContent = `${firstOperand} ${slicedHistory}`;
        }

        currentInputValue = 0
        endOfCalc = true;
    }

    if (!numButtonsEvent) {
        numberButtons.forEach(numberButton => numberButton.addEventListener("click", input));
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
    history.textContent = "";
    firstOperand = undefined;
    secondOperand = undefined;
    operator = undefined;
    answer = undefined;
    endOfCalc = false;

    if (!numButtonsEvent) {
        numberButtons.forEach(numberButton => numberButton.addEventListener("click", input));
    }
}

//Allows user input of floating point numbers
const decimal = document.querySelector(".decimal");
decimal.addEventListener("click", addDecimal);

function addDecimal(e) {
    if (!currentInputValue.toString().includes(".")) {
        const decimalPoint = e.currentTarget.textContent;
        currentInputValue += decimalPoint;
        display.textContent = currentInputValue;
    }

    //If user is attempting to input a decimal following a computation, it is most likely that they are  trying to start a new operation
    //First operand delegation begins here instead of when the operator key is pressed, just like in number input function above
    if (endOfCalc) {
        firstOperandLength = firstOperand.toString().length; //Assign old first operand length here same reasoning as in number button input function
        firstOperand = currentInputValue;
    }
}

//Allows user to invert the sign of the current input value
const sign = document.querySelector(".sign");
sign.addEventListener("click", invertSign);

function invertSign() {
    //This case allows user to invert sign of the result of their computation
    if (exists(answer) && endOfCalc) {
        if (!answer.toString().includes("-")) {
            answer = "-" + answer;
            display.textContent = answer;
        }
        else {
            answer = answer.toString().slice(1);
            display.textContent = answer;
        }
    }
    //All other cases
    //If current input value is positive, add a negative sign to the front
    else if (!currentInputValue.toString().includes("-")) {
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
    currentInputValue = currentInputValue.toString().slice(0, currentInputValue.length - 1);

    //Does not delete current input value's default 0 to prevent unwanted empty current input value string
    if (currentInputValue === "") {
        currentInputValue = 0;
        if (exists(answer)) {
            display.textContent = answer;
        }
        else if (exists(firstOperand)) {
            display.textContent = firstOperand;
        }
        else {
            display.textContent = 0;
        }
    }
    else if (currentInputValue === "-") {
        currentInputValue = "-0";
        if (exists(answer)) {
            display.textContent = answer;
        }
        else if (exists(firstOperand)) {
            display.textContent = firstOperand;
        }
        else {
            display.textContent = "-0";
        }
    }
    else if (currentInputValue) {
        display.textContent = currentInputValue;
    }

    if (!numButtonsEvent) {
        numberButtons.forEach(numberButton => numberButton.addEventListener("click", input));
    }
}

//CSS effects

//Toggle operator CSS on click to highlight selected operator
operators.forEach(operator => operator.addEventListener("click", () => {
    removeSelected();
    //If current operator does not have selected class, add it
    if (!operator.classList.contains("operator-selected")) {
        operator.classList.toggle("operator-selected");
    }
}));

//Background color fade in and out effect for number buttons
numberButtons.forEach(number => number.addEventListener("click", () => {
   removeSelected();
   number.style.cssText = "background-color: #aaaaaa;"
   window.setTimeout(() => number.style.cssText = "background-color: #3a3b3c;", 250);
}));

decimal.addEventListener("click", () => {
    removeSelected();
    decimal.style.cssText = "background-color: #aaaaaa;"
    window.setTimeout(() =>  decimal.style.cssText = "background-color: #3a3b3c;", 250);
})

//Same effect as above but for clear, delete, and invert sign buttons
const rowFiveChildren = document.querySelectorAll(".row.five > .non-operator");
rowFiveChildren.forEach(child => child.addEventListener("click", () => {
    removeSelected();
    child.style.cssText = "background-color: #d3d3d3;"
    window.setTimeout(() => child.style.cssText = "background-color: #808080;", 250);
}));

equals.addEventListener("click", () => {
    removeSelected();
    equals.style.cssText = "background-color: white; color: #ffa500;"
    window.setTimeout(() =>  equals.style.cssText = "background-color: #ffa500; color: white;", 250);
})

//Removes selected highlight from operator buttons
function removeSelected() {
    operators.forEach(nonOperator => {
        if (nonOperator.classList.contains("operator-selected")) {
            nonOperator.classList.toggle("operator-selected");
        }
    })
}