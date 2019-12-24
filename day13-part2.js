console.log('start')
const fs = require('fs')
const engine = require('./engine')
let map = {}
const tiles = [' ', '■', '🎁', '🏓', '🏐']
const readlineSync = require('readline-sync')

const printMap = map => {
  let count = 0
  const [[minX, maxX], [minY, maxY]] = Object.keys(map)
    .map(x => x.split(':').map(Number))
    .reduce(
      (state, [x, y]) => {
        if (state[0][0] > x) state[0][0] = x
        if (state[0][1] < x) state[0][1] = x
        if (state[1][0] > y) state[1][0] = y
        if (state[1][1] < y) state[1][1] = y
        return state
      },
      [
        [Infinity, -Infinity],
        [Infinity, -Infinity]
      ]
    )

  let result = ''
  for (let y = minY; y <= maxY; ++y) {
    for (let x = minX; x <= maxX; ++x) {
      result += tiles[map[`${x}:${y}`]] + ' '
      if (map[`${x}:${y}`] === 2) count++
    }
    result += '\n'
  }
  console.log('count', count)
  return result
}

class Arcade {
  constructor(program) {
    this.robot = engine(program)()
    this.score = 0
    this.input = null
    this.outputs = []
    this.ballXPosition = 0
    this.paddleXPosition = 0
    this.steps = 0
  }
  step() {
    this.steps++
    let { value, done } = this.robot.next(this.input)
    this.input = null
    if (value.type === 'INPUT') {
      console.log(printMap(map))
      console.log(this.score)
      this.input =
        this.ballXPosition === this.paddleXPosition
          ? 0
          : this.paddleXPosition > this.ballXPosition
          ? -1
          : 1
    }

    if (value.type === 'OUTPUT') {
      this.outputs.push(value.output)
      if (this.outputs.length === 3) {
        const [x, y, tile] = this.outputs
        if (x === -1 && y === 0) {
          this.updateScore(tile)
        } else {
          this.updateMap([x, y], tile)
        }
        this.outputs = []
      }
    }
    if (done) return true

    return false
  }
  updateMap(position, tile) {
    map[position.join(':')] = tile
    if (tile === 4) this.ballXPosition = position[0]
    if (tile === 3) this.paddleXPosition = position[0]
  }
  updateScore(score) {
    this.score = score
  }
  printFinalScore() {
    console.log(printMap(map))
    console.log(this.score)
  }
}

const input = fs
  .readFileSync(require('path').resolve(__dirname, './inputs/day13.txt'))
  .toString()
let instructions = input.split(',').map(Number)
instructions[0] = 2
const arcade = new Arcade(instructions)
let ended = false
while (!ended) {
  ended = arcade.step()
}
arcade.printFinalScore()