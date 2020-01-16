console.log('start')
const fs = require('fs')
const engine = require('./engine')
let map = {}
const tiles = ['.', '#']

const checkIfSquareFit = (x, y, width) => {
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < width; j++) {
      if (map[[x - i, y - j].join(':')] !== 1) return false
    }
  }
  return true
}

const findFirstSquare = (size, enlargement, squareWidth) => {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < enlargement; j++) {
      let position = [i, size - 1 - j]
      if (map[position.join(':')] === 1) {
        if (checkIfSquareFit(position[0], position[1], squareWidth)) {
          console.log(
            'SQUARE FIT',
            [position[0] - squareWidth + 1, position[1] - squareWidth + 1],
            (position[0] - squareWidth + 1) * 10000 +
              position[1] -
              squareWidth +
              1
          )
          return true
        }
      }
    }
  }
  return false
}

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
      result += tiles[map[`${x}:${y}`] || 0] + ' '
    }
    result += '\n'
  }
  console.log(minX, maxX, minY, maxY)
  return result
}
class Drone {
  constructor(program, position, verbose) {
    this.engine = engine(program)()
    this.steps = 0
    this.position = position
    this.input = this.position[0]
    this.verbose = verbose
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
    if (this.verbose)
      console.log('update map : ', this.position.join(':'), tile)
    map[this.position.join(':')] = parseInt(tile)
  }
}

const input = fs
  .readFileSync(require('path').resolve(__dirname, './inputs/day19.txt'))
  .toString()
let instructions = input.split(',').map(Number)
let size = 0
const squareWidth = 100
let initialPos = 0
while (true) {
  size++
  const y = size - 1
  changePos = false
  for (let x = initialPos; x < size; x++) {
    // get tile at [x, size - 1]
    if (!map[[x, y].join(':')]) {
      const drone = new Drone(instructions, [x, y])
      while (!drone.step()) {}
    }
    if (map[[x, y].join(':')] === 0) {
      if (x !== initialPos) {
        break
      } else {
        changePos = true
      }
    }
  }
  if (changePos) {
    initialPos++
  }

 // console.log(printMap(map))
  if (findFirstSquare(size, 1, squareWidth)) break
}

//console.log(printMap(map))
//console.log(map)
console.log('end')
