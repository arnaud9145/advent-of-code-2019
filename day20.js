console.log('start')
const fs = require('fs')
let map = {}
let map2 = {}

const directions = {
  NORTH: 0,
  EAST: 1,
  SOUTH: 2,
  WEST: 3
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
      result += map[`${x}:${y}`] + ' '
    }
    result += '\n'
  }
  return result
}

const input = fs
  .readFileSync(require('path').resolve(__dirname, './inputs/day20.txt'))
  .toString()
let rows = input.split(`\r\n`).map(row => row.split(''))

rows.forEach((row, x) => {
  row.forEach((col, y) => {
    map[`${y}:${x}`] = col
    map2[`${y}:${x}`] = col
  })
})
const WIDTH = rows[0].length
const HEIGHT = rows.length

console.log(printMap(map))
console.log(WIDTH, HEIGHT)
const getTileAt = position => map[position.join(':')]
const isTileAvaillable = position => {
  if (getTileAt(position) === '#') return false
  return true
}
const findSecondPortalPart = pos => {
  let tile
  tile = getTileAt([pos[0], pos[1] + 1])
  if (tile !== ' ' && tile !== '.') return [pos[0], pos[1] + 1, tile]
  tile = getTileAt([pos[0] + 1, pos[1]])
  if (tile !== ' ' && tile !== '.') return [pos[0] + 1, pos[1], tile]
  tile = getTileAt([pos[0], pos[1] - 1])
  if (tile !== ' ' && tile !== '.') return [pos[0], pos[1] - 1, tile]
  tile = getTileAt([pos[0] - 1, pos[1]])
  if (tile !== ' ' && tile !== '.') return [pos[0] - 1, pos[1], tile]
}
const findStartingPoint = () => {
  let portal
  for (let x = 0; x < WIDTH; x++) {
    for (let y = 0; y < HEIGHT; y++) {
      if (getTileAt([x, y]) === 'A') {
        if (getTileAt([x, y + 1]) === 'A') {
          portal = [
            [x, y],
            [x, y + 1]
          ]
        }
        if (getTileAt([x, y - 1]) === 'A') {
          portal = [
            [x, y],
            [x, y - 1]
          ]
        }
        if (getTileAt([x + 1, y]) === 'A') {
          portal = [
            [x, y],
            [x + 1, y]
          ]
        }
        if (getTileAt([x - 1, y]) === 'A') {
          portal = [
            [x, y],
            [x - 1, y]
          ]
        }
        if (portal) return findPortalOutputPosition(portal)
      }
    }
  }
}
const findPortalOutputPosition = portal => {
  if (portal[0][0] === portal[1][0]) {
    // same X, EAST-WEST PORTAL
    let x = portal[0][0]
    let y = portal[0][1]
    let y2 = portal[1][1]

    if (y > y2) {
      let tile = getTileAt([x, y + 1])
      if (tile === '.')
        return { position: [x, y + 1], direction: directions.SOUTH }
      else return { position: [x, y2 - 1], direction: directions.NORTH }
    } else {
      let tile = getTileAt([x, y2 + 1])
      if (tile === '.')
        return { position: [x, y2 + 1], direction: directions.SOUTH }
      else return { position: [x, y - 1], direction: directions.NORTH }
    }
  } else {
    // same Y, NORTH-SOUTH PORTAL
    let x = portal[0][0]
    let x2 = portal[1][0]
    let y = portal[0][1]

    if (x > x2) {
      let tile = getTileAt([x + 1, y])
      if (tile === '.')
        return { position: [x + 1, y], direction: directions.EAST }
      else return { position: [x2 - 1, y], direction: directions.WEST }
    } else {
      let tile = getTileAt([x2 + 1, y])
      if (tile === '.')
        return { position: [x2 + 1, y], direction: directions.EAST }
      else return { position: [x - 1, y], direction: directions.WEST }
    }
  }
}
const findPortalTeleportPosition = (pos1, pos2) => {
  for (let x = 0; x < WIDTH; x++) {
    for (let y = 0; y < HEIGHT; y++) {
      if ((x === pos1[0] && y === pos1[1]) || (x === pos2[0] && y === pos2[1]))
        continue
      if (getTileAt([x, y]) === pos1[2]) {
        secondPart = findSecondPortalPart([x, y])

        if (secondPart[2] === pos2[2]) {
          const outputPortal = [
            [x, y],
            [secondPart[0], secondPart[1]]
          ]
          return findPortalOutputPosition(outputPortal)
        }
      } else if (getTileAt([x, y]) === pos2[2]) {
        secondPart = findSecondPortalPart([x, y])
        if (secondPart[2] === pos1[2]) {
          const outputPortal = [
            [x, y],
            [secondPart[0], secondPart[1]]
          ]
          return findPortalOutputPosition(outputPortal)
        }
      }
    }
  }
}
let final_result = []
class Path {
  constructor(position, direction, count, history) {
    this.position = position
    this.direction = direction
    this.count = count
    this.history = history.slice(0)
    //map2[position.join(':')] = '@'
    //console.log(printMap(map2))
    //console.log(position, direction)
  }
  step() {
    this.move()
    const end = this.teleportIfNecessary()
    if (end) return []
    return this.getNextPaths()
  }
  move() {
    switch (this.direction) {
      case directions.NORTH:
        this.position[1]--
        break
      case directions.SOUTH:
        this.position[1]++
        break
      case directions.WEST:
        this.position[0]--
        break
      case directions.EAST:
        this.position[0]++
        break
    }
  }
  teleportIfNecessary() {
    if (
      this.history.find(
        pos => pos[0] === this.position[0] && pos[1] === this.position[1]
      )
    ) {
      console.log('LOOP')
      return true
    }
    const firstTile = getTileAt(this.position)
    if (firstTile === '.') return
    const firstPosition = [this.position[0], this.position[1], firstTile]
    this.move()
    const secondTile = getTileAt(this.position)
    if (firstTile === 'A' && secondTile === 'A') {
      console.log('RETURN TO START', this.count)
      return true
    }
    if (firstTile === 'Z' && secondTile === 'Z') {
      console.log('END OF PATH', this.count)
      final_result.push({ count: this.count, history: this.history })
      return true
    }
    const secondPosition = [this.position[0], this.position[1], secondTile]
    const teleportPosition = findPortalTeleportPosition(
      firstPosition,
      secondPosition
    )
    this.position = teleportPosition.position
    this.direction = teleportPosition.direction
  }
  getNextPaths() {
    let positions = []
    let next_position
    switch (this.direction) {
      case directions.NORTH:
        next_position = [this.position[0] + 1, this.position[1]]
        if (isTileAvaillable(next_position))
          positions.push({
            position: [this.position[0], this.position[1]],
            direction: directions.EAST,
            count: this.count + 1,
            history: [...this.history, [this.position[0], this.position[1]]]
          })
        next_position = [this.position[0] - 1, this.position[1]]
        if (isTileAvaillable(next_position))
          positions.push({
            position: [this.position[0], this.position[1]],
            direction: directions.WEST,
            count: this.count + 1,
            history: [...this.history, [this.position[0], this.position[1]]]
          })
        next_position = [this.position[0], this.position[1] - 1]
        if (isTileAvaillable(next_position))
          positions.push({
            position: [this.position[0], this.position[1]],
            direction: directions.NORTH,
            count: this.count + 1,
            history: [...this.history, [this.position[0], this.position[1]]]
          })
        break
      case directions.SOUTH:
        next_position = [this.position[0] + 1, this.position[1]]
        if (isTileAvaillable(next_position))
          positions.push({
            position: [this.position[0], this.position[1]],
            direction: directions.EAST,
            count: this.count + 1,
            history: [...this.history, [this.position[0], this.position[1]]]
          })
        next_position = [this.position[0] - 1, this.position[1]]
        if (isTileAvaillable(next_position))
          positions.push({
            position: [this.position[0], this.position[1]],
            direction: directions.WEST,
            count: this.count + 1,
            history: [...this.history, [this.position[0], this.position[1]]]
          })
        next_position = [this.position[0], this.position[1] + 1]
        if (isTileAvaillable(next_position))
          positions.push({
            position: [this.position[0], this.position[1]],
            direction: directions.SOUTH,
            count: this.count + 1,
            history: [...this.history, [this.position[0], this.position[1]]]
          })
        break
      case directions.WEST:
        next_position = [this.position[0], this.position[1] - 1]
        if (isTileAvaillable(next_position))
          positions.push({
            position: [this.position[0], this.position[1]],
            direction: directions.NORTH,
            count: this.count + 1,
            history: [...this.history, [this.position[0], this.position[1]]]
          })
        next_position = [this.position[0], this.position[1] + 1]
        if (isTileAvaillable(next_position))
          positions.push({
            position: [this.position[0], this.position[1]],
            direction: directions.SOUTH,
            count: this.count + 1,
            history: [...this.history, [this.position[0], this.position[1]]]
          })
        next_position = [this.position[0] - 1, this.position[1]]
        if (isTileAvaillable(next_position))
          positions.push({
            position: [this.position[0], this.position[1]],
            direction: directions.WEST,
            count: this.count + 1,
            history: [...this.history, [this.position[0], this.position[1]]]
          })
        break
      case directions.EAST:
        next_position = [this.position[0], this.position[1] - 1]
        if (isTileAvaillable(next_position))
          positions.push({
            position: [this.position[0], this.position[1]],
            direction: directions.NORTH,
            count: this.count + 1,
            history: [...this.history, [this.position[0], this.position[1]]]
          })
        next_position = [this.position[0], this.position[1] + 1]
        if (isTileAvaillable(next_position))
          positions.push({
            position: [this.position[0], this.position[1]],
            direction: directions.SOUTH,
            count: this.count + 1,
            history: [...this.history, [this.position[0], this.position[1]]]
          })
        next_position = [this.position[0] + 1, this.position[1]]
        if (isTileAvaillable(next_position))
          positions.push({
            position: [this.position[0], this.position[1]],
            direction: directions.EAST,
            count: this.count + 1,
            history: [...this.history, [this.position[0], this.position[1]]]
          })
        break
    }
    return positions
  }
}

const calculatePaths = paths => {
  const result = paths.map(path =>
    new Path(path.position, path.direction, path.count, path.history).step()
  )
  if (result.length > 0)
    result.forEach((r, index) => {
      calculatePaths(r)
    })
}
const start = findStartingPoint()
console.log(start)
/*
let position = start.position
let firstPath = new Path(position, start.direction, 0, [])
let paths = firstPath.step()
console.log('1 - ', paths)
let paths2 = paths.map(path =>
  new Path(path.position, path.direction, path.count, path.history).step()
)
paths2.map(results => console.log('2 - ', results))
*/

calculatePaths([
  {
    position: start.position,
    direction: start.direction,
    count: 0,
    history: []
  }
])
const r = final_result.sort((a, b) => a.count > b.count)[0]
console.log(r)

r.history.forEach(pos => {
  //  console.log(printMap(map2))
  map2[pos.join(':')] = '@'
})

fs.writeFileSync(
  require('path').resolve(__dirname, './outputs/day20.txt'),
  printMap(map2)
)
console.log(r.history.length)
console.log('end')
