console.log('start')
const fs = require('fs')
const engine = require('./engine')
const readlineSync = require('readline-sync')

class Computer {
  constructor(program, address, callback) {
    this.engine = engine(program)()
    this.input = null
    this.address = address
    this.queue = [this.address]
    this.outputs = []
    this.callback = callback
  }
  step() {
    let { value, done } = this.engine.next(this.input)
    this.input = null
    if (done) {
      console.log('done', value)
      return true
    }
    if (value.type === 'INPUT') {
      if (this.queue.length > 0) {
        this.input = this.queue.shift()
      } else {
        this.input = -1
      }
      //console.log(this.address, 'input', this.input)
    }

    if (value.type === 'OUTPUT') {
      console.log(this.address, 'output :', value.output)
      this.outputs.push(value.output)
      if (this.outputs.length === 3) {
        this.sendPacket()
      }
    }

    return false
  }
  sendPacket() {
    this.callback(this.outputs[0], this.outputs[1], this.outputs[2])
    this.outputs = []
  }

  receivePacket(x, y) {
    this.queue.push(x)
    this.queue.push(y)
  }
}

const input = fs
  .readFileSync(require('path').resolve(__dirname, './inputs/day23.txt'))
  .toString()
let instructions = input.split(',').map(Number)
let computers = []

const callback = (address, x, y) => {
  if (address == 255) console.log('EENNNNDDDD', address, x, y)
  else {
    computers[address].receivePacket(x, y)
  }
}

for (let i = 0; i < 50; i++) {
  const computer = new Computer(instructions, i, callback)
  computers.push(computer)
}
while (true) {
  computers.forEach(computer => computer.step())
}

console.log('end')
