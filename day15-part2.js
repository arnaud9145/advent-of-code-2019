console.log('start')
const fs = require('fs')
const engine = require('./engine')

const tiles = [' ', '■', '□', 'O', '■']
const readlineSync = require('readline-sync')
const directions = {
  NORTH: 1,
  SOUTH: 2,
  WEST: 3,
  EAST: 4
}

const printMap = map => {
  console.log(map.map(row => row.map(col => tiles[col]).join(' ')).join('\n'))
}

const input = fs
  .readFileSync(require('path').resolve(__dirname, './inputs/day15-part2.txt'))
  .toString()
let map = input.split('\n').map(row => row.split(' '))
map = map.map(row =>
  row.map(col => {
    if (col === ' ') return 0
    if (col === '■') return 1
    if (col === '□') return 2
    if (col === 'O') return 3
    return 4
  })
)
printMap(map)
const getSurroundings = pos => {
  return [
    [pos[0] + 1, pos[1]],
    [pos[0] - 1, pos[1]],
    [pos[0], pos[1] + 1],
    [pos[0], pos[1] - 1]
  ]
}
const fillEdges = positions => {
  let times = []
  positions.forEach(pos => {
    const tile = map[pos[1]][pos[0]]
    if (tile === 2) {
      map[pos[1]][pos[0]] = 3
      times.push(fillEdges(getSurroundings(pos)))
    }
  })
  return times.length > 0 ? Math.max(...times) + 1 : 1
}

const positionY = map.findIndex(row => row.find(col => col === 3))
const positionX = map[positionY].findIndex(col => col === 3)
let position = [positionX, positionY]
const time = fillEdges(getSurroundings(position)) - 1
printMap(map)
console.log(time)
