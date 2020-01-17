console.log('start')
const fs = require('fs')

let input = fs
  .readFileSync(require('path').resolve(__dirname, './inputs/day22.txt'))
  .toString()

//input = `cut -3
//deal into new stack`
let instructions = input.split(`\n`)
let deck = []

for (let i = 0; i < 10007; i++) {
  deck.push(i)
}

const dealIntoNewStack = deck => deck.reverse()
const cutNCards = (deck, n) => {
  if (n >= 0) {
    const cutted = deck.splice(0, n)
    return [...deck, ...cutted]
  } else {
    const cutted = deck.splice(0, deck.length + n)
    return [...deck, ...cutted]
  }
}
const dealWithIncrementN = (deck, n) => {
  let newDeck = {}
  for (let i = 0; i < deck.length; i++) {
    newDeck[`${(i * n) % deck.length}`] = deck[i]
  }
  return Object.entries(newDeck)
    .sort((a, b) => {
      if (Number(a[0]) > Number(b[0])) return 1
      if (Number(a[0]) < Number(b[0])) return -1
      return 0
    })
    .map(a => a[1])
}
instructions.forEach(instruction => {
  console.log(instruction)
  if (instruction.indexOf('deal into new stack') !== -1) {
    deck = dealIntoNewStack(deck)
  } else if (instruction.indexOf('deal with increment') !== -1) {
    deck = dealWithIncrementN(deck, parseInt(instruction.substr(20)))
  } else if (instruction.indexOf('cut') !== -1) {
    deck = cutNCards(deck, parseInt(instruction.substr(4)))
  } else {
    console.log('ERROR', instruction)
  }
})
console.log(deck.findIndex(card => card === 2019))
console.log('end')

