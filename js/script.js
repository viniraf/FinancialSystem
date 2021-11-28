const transactionsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus') //id
const expenseDisplay = document.querySelector('#money-minus') //id
const balanceDisplay = document.querySelector('#balance') //id
const form = document.querySelector('#form') //id
const inputTransactionName = document.querySelector('#text') //id
const inputTransactionAmount = document.querySelector('#amount') //id

// Configurando o local storage
const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
)
let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : []

// Remover transação clicando no X vermelho do lado
const removeTransaction = ID => {
  transactions = transactions.filter(transaction => transaction.id !== ID)
  updateLocalStorage()
  init()
}

// Adicionando as transações no html com classes e corretas dependendo do amount
const addTransactionIntoDOM = transaction => {
  const operator = transaction.amount < 0 ? '-' : '+'
  const CSSClas = transaction.amount < 0 ? 'minus' : 'plus'
  const amountWithoutOperator = Math.abs(transaction.amount)
  const li = document.createElement('li')

  li.classList.add(CSSClas)
  li.innerHTML = `
  ${transaction.name} 
  <span>${operator} R$ ${amountWithoutOperator}</span>
  <button class="delete-btn" onClick="removeTransaction(${transaction.id})">x</button>
  `
  transactionsUl.append(li)
}

// Função para valor negativo
const getExpenses = transactionsAmounts =>
  Math.abs(
    transactionsAmounts
      .filter(value => value < 0)
      .reduce((accumulator, value) => accumulator + value, 0)
  ).toFixed(2)

// Função para valor positivo
const getIncome = transactionsAmounts =>
  transactionsAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2)

// Função para valor total
const getTotal = transactionsAmounts =>
  transactionsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2)

// Calculando o saldo total e receitas com reduce e filter
const updateBalanceValues = () => {
  const transactionsAmounts = transactions.map(
    transaction => transaction.amount
  )
  const total = getTotal(transactionsAmounts)
  const income = getIncome(transactionsAmounts)
  const expense = getExpenses(transactionsAmounts)

  balanceDisplay.textContent = `R$ ${total}`
  incomeDisplay.textContent = `R$ ${income}`
  expenseDisplay.textContent = `R$ ${expense}`
}

const init = () => {
  transactionsUl.innerHTML = ''
  transactions.forEach(addTransactionIntoDOM)
  updateBalanceValues()
}

init()

// Adicionar transação no local storage
const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

// Gerando ID aleatorio para o form
const generateID = () => Math.round(Math.random() * 1000)

// Função para adicionar as transações  no array
const addToTransactionsArray = (transactionName, transactionAmount) => {
  transactions.push({
    id: generateID(),
    name: transactionName,
    amount: Number(transactionAmount)
  })
}

// Função para limpar os campos
const cleanInputs = () => {
  inputTransactionName.value = ''
  inputTransactionAmount.value = ''
}

const handleFormSubmit = event => {
  event.preventDefault()

  const transactionName = inputTransactionName.value.trim()
  const transactionAmount = inputTransactionAmount.value.trim()
  const isSomeInputEmpty = transactionName === '' || transactionAmount === ''

  if (isSomeInputEmpty) {
    alert('Por favor, preencha tanto o nome quanto o valor da transação')
    return
  }

  addToTransactionsArray(transactionName, transactionAmount)
  init()
  updateLocalStorage()
  cleanInputs()
}

// Lidando com o form e o envio dos dados preenchidos
form.addEventListener('submit', handleFormSubmit)
