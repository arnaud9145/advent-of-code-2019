console.log('start')
const fs = require('fs')
const engine = require('./engine')
let map = {}
let alreadyVisited = {}
map[[0, 0].join(':')] = 3

const tiles = [' ', '■', '□', '🏐', 'X', '■']
const readlineSync = require('readline-sync')
const directions = {
  NORTH: 1,
  SOUTH: 2,
  WEST: 3,
  EAST: 4
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
      let tile = map[`${x}:${y}`] || 0
      result += tiles[tile] + ' '
    }
    result += '\n'
  }
  return result
}

class Droid {
  constructor(program) {
    this.engine = engine(program)()
    this.input = null
    this.position = [0, 0]
    this.steps = 0
    this.direction = directions.NORTH
  }
  step() {
    this.steps++
    let { value, done } = this.engine.next(this.input)
    if (value.type === 'INPUT') {
      this.input = this.direction
    }

    if (value.type === 'OUTPUT') {
      if (this.steps % 100 === 0) {
        console.log(printMap(map))
      }
      return this.updateMap(value.output)
      /*if (this.outputs.length === 3) {
        const [x, y, tile] = this.outputs
        if (x === -1 && y === 0) {
          this.updateScore(tile)
        } else {
        }
        this.outputs = []
      }*/
    }
    if (done) {
      console.log('done', value)
      return true
    }

    return false
  }
  updateMap(status) {
    let position = [this.position[0], this.position[1]]

    if (status === 0) {
      // wall
      switch (this.direction) {
        case directions.NORTH:
          position[1]--
          break
        case directions.SOUTH:
          position[1]++
          break
        case directions.WEST:
          position[0]--
          break
        case directions.EAST:
          position[0]++
          break
      }
      map[position.join(':')] = 1
      this.changeDirection(0)
    }
    if (status === 1 || status === 2) {
      // free or oxygen
      map[this.position.join(':')] = 2
      switch (this.direction) {
        case directions.NORTH:
          position[1]--
          break
        case directions.SOUTH:
          position[1]++
          break
        case directions.WEST:
          position[0]--
          break
        case directions.EAST:
          position[0]++
          break
      }
      this.position = position
      map[this.position.join(':')] = 3
      this.changeDirection(1)
    }
    if (status === 2) {
      console.log(printMap(map))
      console.log('OXYGEN AT', this.position)
      return true
    }
    return false
  }
  changeDirection(status) {
    if (alreadyVisited[this.position.join(':')]) {
      alreadyVisited[this.position.join(':')]++
    } else {
      alreadyVisited[this.position.join(':')] = 1
    }
    if (alreadyVisited[this.position.join(':')] > 4) {
      this.direction = Math.floor(Math.random() * 4) + 1
    } else {
      this.direction = alreadyVisited[this.position.join(':')]
    }
  }
}

const input = fs
  .readFileSync(require('path').resolve(__dirname, './inputs/day15.txt'))
  .toString()
let instructions = input.split(',').map(Number)
const droid = new Droid(instructions)
let ended = false
while (!ended) {
  ended = droid.step()
}
let position = [0, 0]
let length = 1
let surrounding = []
while (
  surrounding.findIndex(p => map[p.join(':')] && map[p.join(':')] === 3) === -1
) {
  console.log(printMap(map))
  console.log(length)

  surrounding = [
    [position[0] + 1, position[1]],
    [position[0] - 1, position[1]],
    [position[0], position[1] + 1],
    [position[0], position[1] - 1]
  ]
  let index = surrounding.findIndex(
    sur => map[sur.join(':')] && map[sur.join(':')] === 2
  )
  if (index !== -1) {
    map[position.join(':')] = 4
    position = surrounding[index]
    length++
  } else {
    length--
    map[position.join(':')] = 5
    position = surrounding.find(p => map[p.join(':')] === 4)
    map[position.join(':')] = 2
  }
}
console.log('end')
console.log(printMap(map))
console.log(length)
