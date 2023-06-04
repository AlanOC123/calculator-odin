// Document Selectors
const calculator = document.querySelector('.calculator')
const keys = calculator.querySelector('.calculator-keys')
const mainDisplay = calculator.querySelector('.main-display')

// Temporary Variables

mainDisplay.textContent = '0'

// Basic functions
function add (a, b) {
  return a + b
}

function subtract (a, b) {
  return a - b
}

function divide (a, b) {
  return a / b
}

function multiply (a, b) {
  return a * b
}

// Main Operator
function operate (a, b, operator) {
  const operations = {
    add: add(a, b),
    sub: subtract(a, b),
    mul: multiply(a, b),
    div: divide(a, b)
  }

  return operations[operator]
}

// Main Body
keys.addEventListener('click', (e) => {
  // This is added to ignore clicking on the parent container
  if (e.currentTarget === e.target) return

  // Declare Variables
  let a
  let b
  const key = e.target
  const value = key.textContent
  const { storedValue } = calculator.dataset
  const { type } = key.dataset
  const { previousKeyType } = calculator.dataset
  const { currentOperator } = calculator.dataset

  // Check if its a number button pressed or an operator was pressed previously
  if (type === 'number') {
    // If the display is fresh or not
    if (mainDisplay.textContent === '0') {
      mainDisplay.textContent = value
    } else if (previousKeyType === 'operator') {
      mainDisplay.textContent = value
    } else {
      mainDisplay.textContent += value
    }
  };

  // Check if an operator was pressed
  if (type === 'operator') {
    calculator.dataset.storedValue = Number(mainDisplay.textContent)
    calculator.dataset.currentOperator = key.dataset.key
    mainDisplay.textContent = '0'
    const operatorKeys = calculator.querySelectorAll('[data-type="operator"]')
    operatorKeys.forEach(key => { key.dataset.state = '' })

    key.dataset.state = 'selected'
  };

  // Check if the equals was pressed
  if (type === 'equals') {
    a = storedValue
    b = mainDisplay.textContent
    mainDisplay.textContent = '0'
    mainDisplay.textContent = operate(Number(a), Number(b), currentOperator)
  }

  if (type === 'clear') {
    mainDisplay.textContent = '0'
    calculator.dataset.storedValue = ''
    key.dataset.type = ''
    calculator.dataset.currentOperator = ''
  }

  calculator.dataset.previousKeyType = type
})
