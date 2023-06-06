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

function captureValue (keyValue) {
  calculator.dataset.storedValue = current.textContent
  calculator.dataset.currentOperator = keyValue
  current.textContent = '0'
  stored.textContent = calculator.dataset.storedValue
  calculator.dataset.isCleared = 'false'
  calculator.dataset.isDecimal = 'false'
}

function sumCurrent () {
  const a = calculator.dataset.storedValue
  const b = current.textContent
  const operation = calculator.dataset.currentOperator
  const sum = operate(Number(a), Number(b), operation)
  current.textContent = sum
  stored.textContent = ''
  calculator.dataset.isDecimal = false

  return sum
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
  if (!historyContainer.firstChild) {
    console.log(true)
    const historyDisplay = document.createElement('p')
    historyDisplay.classList.add('history-display')
    historyDisplay.textContent = ''
    historyContainer.appendChild(historyDisplay)
  }

  const historyDisplay = historyContainer.querySelector('.history-display')

  historyDisplay.textContent = ''

  let history = JSON.parse(calculator.dataset.history)
  history.push(value)

  history.forEach(num => {
    if (history.indexOf(num) > 2) {
      return
    }

    historyDisplay.textContent += `${history.indexOf(num) + 1} : ${num} \; `
  })

  history = JSON.stringify(history)
  calculator.dataset.history = history
}

function backspace () {
  const length = current.textContent.length
  const char = current.textContent.substring(length - 1)
  if (char === '.') calculator.dataset.isDecimal = false
  current.textContent = current.textContent.replace(char, '')
  if (length === 1) current.textContent = '0'
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
    captureValue(keyValue)
    key.dataset.status = 'selected'
  })
})

special.forEach(button => {
  button.addEventListener('click', (e) => {
    // Prevent clicking on container
    if (!e.target.closest('button')) return

    const key = e.target
    const keyValue = key.closest('button').dataset.key

    // If equals was pressed, get a from the stored value, b from the display and operate on them and store the value in the display and history
    if (keyValue === 'eql') {
      const sum = sumCurrent()
      updateHistory(sum)
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
      backspace()
    }
  })
})

// Keyboard Listeners
window.addEventListener('keydown', (e) => {
  e.preventDefault()
  const keyNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  const keyOperators = ['+', '-', '*', 'x', '/']
  const keySpecial = ['=', 'Enter', 'Backspace', 'Delete', 'c', 'C', '.']

  const keyValue = e.key
  let keyType

  if (keyNumbers.includes(keyValue)) {
    keyType = 'number'
  } else if (keyOperators.includes(keyValue)) {
    keyType = 'operator'
  } else if (keySpecial.includes(keyValue)) {
    keyType = 'special'
  } else {
    return
  }

  if (keyType === 'number') {
    updateDisplay(keyValue)
  }

  if (keyType === 'operator') {
    const map = {
      '+': 'add',
      '-': 'sub',
      'x': 'mul',
      '*': 'mul',
      '/': 'div'
    }

    const mappedKey = map[keyValue]

    captureValue(mappedKey)
    const key = keys.querySelector(`[data-key="${map[keyValue]}"`)
    key.dataset.status = 'selected'
  }

  if (keyType === 'special') {
    const map = {
      '.': 'dec',
      'Backspace': 'del',
      'Delete': 'del',
      'c': 'clr',
      'C': 'clr',
      'Enter': 'eql',
      '=': 'eql'
    }

    const mappedKey = map[keyValue]

    if (mappedKey === 'eql') {
      const sum = sumCurrent()
      updateHistory(sum)
    }

    if (mappedKey === 'clr') {
      clearDisplay(calculator.dataset.isCleared)
    }

    if (mappedKey === 'dec') {
      if (calculator.dataset.isDecimal === 'true') {
        return
      }

      current.textContent += '.'
      calculator.dataset.isDecimal = 'true'
    }

    if (mappedKey === 'del') {
      backspace()
    }

    console.log(mappedKey)
  }
})
