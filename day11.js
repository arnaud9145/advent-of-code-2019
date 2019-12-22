console.log('start')
const fs = require('fs')
const engine = require('./engine')
const verbose = false
const black = '□'
const white = '■'
let map = []

const width = 40
const height = 40
for (let i = 0; i < height; i++) {
  const tab = []
  for (let j = 0; j < width; j++) {
    tab.push(0)
  }
  map.push(tab)
}

const printMap = map => {
  console.log(
    map
      .map(row => row.map(col => (col === 0 ? black : white)).join(''))
      .join('\n')
  )
}
printMap(map)

class Robot {
  constructor(program, position) {
    this.program = program
    this.position = position
    this.cursor = 0
    this.facing = 0
  }
  move() {
    const inputFunction = () => {
      const input = map[this.position[0]][this.position[1]]
      // console.log('input :', input)
      return input
    }
    const result = engine(
      this.program,
      inputFunction,
      this.cursor,
      true,
      verbose
    )
    if (result.end) console.log('end', result)

    const result2 = engine(
      result.instructions,
      inputFunction,
      result.cursor,
      true,
      verbose
    )
    if (result2.end) console.log('end2', result)
    this.program = result2.instructions
    this.cursor = result2.cursor
    //  console.log('outputs :', result.outputs, result2.outputs)
    this.updateMap(result.outputs[0])
    this.updatePosition(result.outputs[0])
  }
  updateMap(color) {
    map[this.position[0]][this.position[1]] = color
    // console.log('new map with color :', color, 'at position ', this.position)
    //printMap(map)
  }
  updatePosition(rotation) {
    this.facing += rotation * 2 - 1
    this.facing %= 4
    if (this.facing < 0) this.facing = 3

    switch (this.facing) {
      case 0:
        this.position[1] -= 1
        break
      case 1:
        this.position[0] -= 1
        break
      case 2:
        this.position[1] += 1
        break
      case 3:
        this.position[0] += 1
        break
    }
    //  console.log('NEW POSITION :', this.position, 'facing :', this.facing)
  }
}

let instructions = fs.readFileSync('./inputs/day11.txt', 'utf8').split(',')

const robot = new Robot(instructions, [width / 2, height / 2])
for (let step = 0; step < 100000; step++) {
  //console.log('SETP', step, '------------')
  robot.move()
  if(step%100 === 0) printMap(map)
}
