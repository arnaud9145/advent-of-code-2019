console.log('start')
const readlineSync = require('readline-sync')
const engine = require('./engine')

let input = process.argv.slice(2)[1]
const inputFunction = () => readlineSync.question('Input ? ')
const output = engine(input, inputFunction)

console.log('stop', output)
