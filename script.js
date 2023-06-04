// Document Selector
const calculator = document.querySelector('.calculator')
const display = calculator.querySelector('.display')
const stored = display.querySelector('.stored')
const current = display.querySelector('.current')
current.textContent = '0'

const keys = calculator.querySelector('.calculator-keys')
const numbers = keys.querySelectorAll('[data-type="number"]')
const operator = keys.querySelectorAll('[data-type="operator"]')
const special = keys.querySelectorAll('[data-type="special"]')

// Set data attributes on calculator
const history = JSON.parse(calculator.dataset.history)
const { storedValue } = calculator.dataset
const { status } = calculator.dataset
const { currentOperator } = calculator.dataset

// Create a div element to store the history

// Core functions

function add (a, b) {
  return a + b
}

function sub (a, b) {
  return a + b
}

function mul (a, b) {
  return a + b
}

function div (a, b) {
  return a + b
}

function operate (a, b, operator) {
  const operation = {
    add: add(a, b),
    sub: add(a, b),
    mul: add(a, b),
    div: add(a, b)
  }

  return operation[operator]
}

// Display Update Functions
function updateDisplay (value) {
  if (current.textContent === '0') {
    current.textContent = value
  } else {
    current.textContent += value
  }
}

function updateHistory (arr) {
  calculator.dataset.history = JSON.stringify(arr)
}

function clearDisplay() {
  current.textContent = '0'
  stored.textContent = ''
  calculator.dataset.currentOperator = ''
  calculator.dataset.storedValue = ''
}

// Event Listeners
numbers.forEach(button => {
  button.addEventListener('click', (e) => {
    const key = e.target
    const keyValue = key.dataset.key

    updateDisplay(keyValue)
  })
})

operator.forEach(button => {
  button.addEventListener('click', (e) => {
    const key = e.target
    const keyValue = key.dataset.key
    const { status } = key.dataset

    operator.forEach(key => {
      key.dataset.status = ''
    })

    calculator.dataset.storedValue = current.textContent
    calculator.dataset.currentOperator = keyValue
    current.textContent = '0'
    stored.textContent = calculator.dataset.storedValue
    key.dataset.status = 'selected'
  })
})

special.forEach(button => {
  button.addEventListener('click', (e) => {
    const key = e.target
    const keyValue = key.dataset.key

    if (keyValue === 'eql') {
      const a = calculator.dataset.storedValue
      const b = current.textContent
      const operation = calculator.dataset.currentOperator
      const sum = operate(Number(a), Number(b), operation)
      history.push(sum)
      updateHistory(history)
      current.textContent = sum
      stored.textContent = ''
    }

    if (keyValue === 'clr') {
      clearDisplay()
    }
  })
})
