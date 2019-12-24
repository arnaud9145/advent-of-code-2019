console.log('start')
const fs = require('fs')
const engine = require('./engine')
let map = {}
const tiles = [' ', '■', '□', '-', 'o']

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
      if(map[`${x}:${y}`] === 2) count++
    }
    result += '\n'
  }
  console.log('count', count)
  return result
}

class Arcade {
  constructor(program) {
    this.robot = engine(program)()
  }
  step() {
    let { value, done } = this.robot.next()
    if (done) return true
    const x = value.output
    value = this.robot.next().value
    const y = value.output
    const result = this.robot.next()
    const tile = result.value.output
    this.updateMap([x, y], tile)
    return false
  }
  updateMap(position, tile) {
    map[position.join(':')] = tile
  }
}

const input = fs
  .readFileSync(require('path').resolve(__dirname, './inputs/day13.txt'))
  .toString()
let instructions = input.split(',').map(Number)
const arcade = new Arcade(instructions)
let ended = false
while (!ended) {
  ended = arcade.step()
}
console.log(printMap(map))
