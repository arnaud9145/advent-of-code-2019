console.log('start')
const fs = require('fs')
const engine = require('./engine')
const verbose = false
const black = '□'
const white = '■'
let map = {}
const directions = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3
}
const modulo = (x, n) => ((x % n) + n) % n

const printMap = map => {
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
      result += map[`${x}:${y}`] === 1 ? black : white
    }
    result += '\n'
  }
  return result
}

class Robot {
  constructor(program) {
    this.position = [0, 0]
    this.facing = directions.UP
    this.robot = engine(program)()
    map[this.position.join(':')] = 1
    this.robot.next()
  }
  move() {
    const input = map[this.position.join(':')] || 0
    let { value } = this.robot.next(input)
    map[this.position.join(':')] = value.output
    value = this.robot.next().value
    const { done } = this.robot.next()
    if (done) return true
    this.updatePosition(value.output)
    return false
  }
  updatePosition(rotation) {
    if (rotation === 0) {
      this.facing = modulo(this.facing - 1, 4)
    } else if (rotation === 1) {
      this.facing = (this.facing + 1) % 4
    }

    if (this.facing === directions.DOWN) {
      this.position = [this.position[0], this.position[1] + 1]
    } else if (this.facing === directions.RIGHT) {
      this.position = [this.position[0] + 1, this.position[1]]
    } else if (this.facing === directions.UP) {
      this.position = [this.position[0], this.position[1] - 1]
    } else if (this.facing === directions.LEFT) {
      this.position = [this.position[0] - 1, this.position[1]]
    }
  }
}

const input = fs
  .readFileSync(require('path').resolve(__dirname, './inputs/day11.txt'))
  .toString()
let instructions = input.split(',').map(Number)
const robot = new Robot(instructions)
let ended = false
while (!ended) {
  ended = robot.move()
}
console.log(printMap(map))
