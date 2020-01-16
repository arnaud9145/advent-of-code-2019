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
        return true
      } else {
        this.input = -1
        return false
      }
      //console.log(this.address, 'input', this.input)
    }

    if (value.type === 'OUTPUT') {
      // console.log(this.address, 'output :', value.output)
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
let yvalues = []
let lastPacketReceivedByNAT = []

const callback = (address, x, y) => {
  if (address == 255) {
    //computers[0].receivePacket(x, y)

    lastPacketReceivedByNAT = [x, y]
    // console.log('nat received packet', [x, y])
  } else {
    computers[address].receivePacket(x, y)
  }
}

for (let i = 0; i < 50; i++) {
  const computer = new Computer(instructions, i, callback)
  computers.push(computer)
}
let cycles = 0
while (true) {
  const results = computers.map(computer => computer.step())
  if (!results.find(result => result === true)) {
    cycles++
    if (cycles > 1000) {
      console.log('stuck, sending packet to 0', lastPacketReceivedByNAT)
      cycles = 0
      callback(0, lastPacketReceivedByNAT[0], lastPacketReceivedByNAT[1])
      if (yvalues.find(v => v === lastPacketReceivedByNAT[1]))
        console.log('DOUBLE Y', lastPacketReceivedByNAT[1])
      yvalues.push(lastPacketReceivedByNAT[1])
    }
  } else {
    cycles = 0
  }
}

console.log('end')
