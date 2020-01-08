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
  console.log(p)
  return p
}

const main = 'A,B,A,C,B,A,C,B,A,C'
const A = 'L,12,L,12,L,6,L,6'
const B = 'R,8,R,4,L,12'
const C = 'L,12,L,6,R,12,R,8'
const feed = 'n'
const inputs = [
  ...stringToASCII(main),
  ...stringToASCII(A),
  ...stringToASCII(B),
  ...stringToASCII(C),
  ...stringToASCII(feed)
]

class Droid {
  constructor(initialPosition, map, initialDirection = directions.up) {
    this.position = initialPosition
    this.direction = initialDirection
    this.map = map
    this.instructions = []
    this.lastIsForward = false
  }
  move() {
    if (this.getFacingTile() === '#') this.forward()
    else if (this.getRightTile() === '#') {
      this.turnRight()
      this.forward()
    } else if (this.getLeftTile() === '#') {
      this.turnLeft()
      this.forward()
    } else {
      console.log('END')
      return true
    }
    return false
  }

  forward() {
    if (this.lastIsForward) {
      this.instructions[this.instructions.length - 1]++
    } else {
      this.instructions.push(1)
    }
    this.lastIsForward = true

    switch (this.direction) {
      case directions.up:
        this.position[0]--
        break
      case directions.down:
        this.position[0]++
        break
      case directions.left:
        this.position[1]--
        break
      case directions.right:
        this.position[1]++
        break
    }
  }
  turnRight() {
    this.lastIsForward = false
    console.log('R')
    this.instructions.push('R')
    this.direction = (this.direction + 1) % 4
  }
  turnLeft() {
    this.lastIsForward = false
    this.instructions.push('L')
    console.log('L')
    this.direction = (this.direction + 3) % 4
  }

  getFacingTile() {
    let nextPos
    switch (this.direction) {
      case directions.up:
        nextPos = [this.position[0] - 1, this.position[1]]
        break
      case directions.right:
        nextPos = [this.position[0], this.position[1] + 1]
        break
      case directions.down:
        nextPos = [this.position[0] + 1, this.position[1]]
        break
      case directions.left:
        nextPos = [this.position[0], this.position[1] - 1]
        break
    }
    if (this.map[nextPos[0]] && this.map[nextPos[0]][nextPos[1]]) {
      return this.map[nextPos[0]][nextPos[1]]
    } else {
      return null
    }
  }
  getRightTile() {
    let nextPos
    switch (this.direction) {
      case directions.up:
        nextPos = [this.position[0], this.position[1] + 1]
        break
      case directions.right:
        nextPos = [this.position[0] + 1, this.position[1]]
        break
      case directions.down:
        nextPos = [this.position[0], this.position[1] - 1]
        break
      case directions.left:
        nextPos = [this.position[0] - 1, this.position[1]]
        break
    }
    if (this.map[nextPos[0]] && this.map[nextPos[0]][nextPos[1]]) {
      return this.map[nextPos[0]][nextPos[1]]
    } else {
      return null
    }
  }
  getLeftTile() {
    let nextPos
    switch (this.direction) {
      case directions.up:
        nextPos = [this.position[0], this.position[1] - 1]
        break
      case directions.right:
        nextPos = [this.position[0] - 1, this.position[1]]
        break
      case directions.down:
        nextPos = [this.position[0], this.position[1] + 1]
        break
      case directions.left:
        nextPos = [this.position[0] + 1, this.position[1]]
        break
    }
    if (this.map[nextPos[0]] && this.map[nextPos[0]][nextPos[1]]) {
      return this.map[nextPos[0]][nextPos[1]]
    } else {
      return null
    }
  }
  getInstructions() {
    return this.instructions
  }
}
class Camera {
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
  }
  getMap() {
    let parameter = 0
    const tab = this.screen.split('\n').map(line => line.split(''))
    return tab
  }
}

const input = fs
  .readFileSync(require('path').resolve(__dirname, './inputs/day17.txt'))
  .toString()
let instructions = input.split(',').map(Number)
const camera = new Camera(instructions)
let ended = false
while (!ended) {
  ended = camera.step()
}
const map = camera.getMap()
const startPos = [20, 12]
let droid = new Droid(startPos, map)

while (!droid.move()) {}
console.log(droid.getInstructions().join(','))

instructions[0] = 2
const camera2 = new Camera(instructions)
while (!camera2.step()) {}
console.log('end')
