console.log('start')
const fs = require('fs')
const readlineSync = require('readline-sync')
const engine = require('./engine')

//let input = process.argv.slice(2)[1].split(',')
let input = fs.readFileSync('./inputs/day7.txt', 'utf8').split(',')

const inputFunction = () => readlineSync.question('Input ? ')
const { outputs } = engine(input, inputFunction)

console.log('stop', outputs)
