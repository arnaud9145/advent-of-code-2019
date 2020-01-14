console.log('start')
const fs = require('fs')
const engine = require('./engine')
let map = {}
const tiles = ['.', '#']

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
      if (map[`${x}:${y}`] === 1) count++
    }
    result += '\n'
  }
  console.log('count:', count)
  return result
}
class Drone {
  constructor(program, position) {
    this.engine = engine(program)()
    this.steps = 0
    this.position = position
    this.input = this.position[0]
  }
  step() {
    this.steps++
    let { value, done } = this.engine.next(this.input)
    this.input = null
    if (value.type === 'INPUT') {
      // console.log('INPUT', value, done, this.steps)
      this.input = this.position[this.steps - 1]
    }

    if (value.type === 'OUTPUT') {
      this.updateMap(value.output)
    }
    if (done) {
      // console.log('done', value)
      return true
    }

    return false
  }

  updateMap(tile) {
    map[this.position.join(':')] = tile
  }
}

const input = fs
  .readFileSync(require('path').resolve(__dirname, './inputs/day19.txt'))
  .toString()
let instructions = input.split(',').map(Number)
const size = 50
for (let x = 0; x < size; x++) {
  for (let y = 0; y < size; y++) {
    const drone = new Drone(instructions, [x, y])
    while (!drone.step()) {}
  }
}
console.log(printMap(map))
console.log('end')
