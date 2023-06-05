// Document Selector
const calculator = document.querySelector('.calculator')
const display = calculator.querySelector('.display')
const stored = display.querySelector('.stored')
const current = display.querySelector('.current')
const historyContainer = display.querySelector('.history')
current.textContent = '0'

const keys = calculator.querySelector('.calculator-keys')
const numbers = keys.querySelectorAll('[data-type="number"]')
const operator = keys.querySelectorAll('[data-type="operator"]')
const special = keys.querySelectorAll('[data-type="special"]')

// Set data attributes on calculator
const { storedValue } = calculator.dataset
const { status } = calculator.dataset
const { currentOperator } = calculator.dataset
const { isCleared } = calculator.dataset
const { isDecimal } = calculator.dataset

// Core functions

function add (a, b) {
  return a + b
}

function sub (a, b) {
  return a - b
}

function mul (a, b) {
  return a * b
}

function div (a, b) {
  return a / b
}

function operate (a, b, operator) {
  const operation = {
    add: add(a, b),
    sub: sub(a, b),
    mul: mul(a, b),
    div: div(a, b)
  }

  return operation[operator]
}

// Create a div element to store the history
function createHistoryDisplay () {
  const historyDisplay = document.createElement('p')
  const history = JSON.parse(calculator.dataset.history)
  const length = history.length
  historyDisplay.setAttribute('id', length)
  historyDisplay.textContent = history[length - 1]
  historyContainer.appendChild(historyDisplay)
  console.log(historyContainer.childNodes)
}

// Display Update Functions
function updateDisplay (value) {
  if (current.textContent === '0') {
    current.textContent = value
  } else {
    current.textContent += value
  }
}

function updateHistory (value) {
  let history = JSON.parse(calculator.dataset.history)
  history.push(value)
  history = JSON.stringify(history)
  calculator.dataset.history = history
}

function deleteHistory () {
  let history = JSON.parse(calculator.dataset.history)
  history = []
  history = JSON.stringify(history)
  calculator.dataset.history = history
  while (historyContainer.firstChild) {
    historyContainer.removeChild(historyContainer.firstChild)
  }
}

function clearDisplay (state) {
  current.textContent = '0'
  stored.textContent = ''
  calculator.dataset.currentOperator = ''
  calculator.dataset.storedValue = ''
  calculator.dataset.isDecimal = 'false'

  if (state === 'true') {
    deleteHistory()
  } else {
    calculator.dataset.isCleared = 'true'
  }
}

// Event Listeners
numbers.forEach(button => {
  button.addEventListener('click', (e) => {
    // Prevent click on container
    if (!e.target.closest('button')) return

    const key = e.target
    const keyValue = key.closest('button').dataset.key
    console.log(keyValue)

    // Adds numbers to the display
    updateDisplay(keyValue)
  })
})

operator.forEach(button => {
  button.addEventListener('click', (e) => {
    // Prevent clicking on container
    if (!e.target.closest('button')) return

    const key = e.target
    const keyValue = key.closest('button').dataset.key
    const { status } = key.dataset

    operator.forEach(key => {
      key.dataset.status = ''
    })

    // Captures the display and operator, resets current display, sets operator button to selected
    calculator.dataset.storedValue = current.textContent
    calculator.dataset.currentOperator = keyValue
    current.textContent = '0'
    stored.textContent = calculator.dataset.storedValue
    key.dataset.status = 'selected'
    calculator.dataset.isCleared = 'false'
    calculator.dataset.isDecimal = 'false'
  })
})

special.forEach(button => {
  button.addEventListener('click', (e) => {
    // Prevent clicking on container
    if (!e.target.closest('button')) return

    const key = e.target
    const keyValue = key.closest('button').dataset.key
    console.log(keyValue)

    // If equals was pressed, get a from the stored value, b from the display and operate on them and store the value in the display and history
    if (keyValue === 'eql') {
      const a = calculator.dataset.storedValue
      const b = current.textContent
      const operation = calculator.dataset.currentOperator
      const sum = operate(Number(a), Number(b), operation)
      current.textContent = sum
      stored.textContent = ''
      calculator.dataset.isDecimal = false
      updateHistory(sum)
      createHistoryDisplay()
    }

    if (keyValue === 'clr') {
      clearDisplay(calculator.dataset.isCleared)
    }

    if (keyValue === 'dec') {
      if (calculator.dataset.isDecimal === 'true') {
        return
      }
      current.textContent += '.'
      calculator.dataset.isDecimal = 'true'
    }

    if (keyValue === 'del') {
      const length = current.textContent.length
      const char = current.textContent.substring(length - 1)
      if (char === '.') calculator.dataset.isDecimal = false
      current.textContent = current.textContent.replace(char, '')
    }
  })
})
