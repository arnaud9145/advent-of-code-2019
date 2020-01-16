console.log('start')
const fs = require('fs')
const engine = require('./engine')
const readlineSync = require('readline-sync')

const directions = {
  up: 0,
  right: 1,
  down: 2,
  left: 3
}

const stringToASCII = code => {
  var p = code.split('').map(c => c.charCodeAt(0))
  p.push(10)
  return p
}

const code = ['NOT C J', 'AND D J', 'NOT A T', 'OR T J', 'WALK']
const inputs = [].concat.apply([], code.map(stringToASCII))

class SpringDroid {
  constructor(program) {
    this.engine = engine(program)()
    this.steps = 0
    this.screen = ''
    this.input = null
    this.inputPos = 0
  }
  step() {
    this.steps++
    let { value, done } = this.engine.next(this.input)
    this.input = null
    if (done) {
      console.log('done', value)
      console.log(this.screen)
      return true
    }
    if (value.type === 'INPUT') {
      this.input = inputs[this.inputPos]
      this.inputPos++
    }

    if (value.type === 'OUTPUT') {
      this.updateView(value.output)
    }

    return false
  }
  updateView(value) {
    this.screen += String.fromCharCode(value)
    console.log(this.screen)
  }
  getMap() {
    let parameter = 0
    const tab = this.screen.split('\n').map(line => line.split(''))
    return tab
  }
}

const input = fs
  .readFileSync(require('path').resolve(__dirname, './inputs/day21.txt'))
  .toString()
let instructions = input.split(',').map(Number)
const springdroid = new SpringDroid(instructions)
while (!springdroid.step()) {}

console.log('end')
