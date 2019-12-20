let map = `#########
#b.A.@.a#
#########`
map = map.split('\n').map(row => row.split(''))
const width = map[0].length
const height = map.length
let newmap = []
for (let i = 0; i < width; i++) {
  let col = []
  for (let j = 0; j < height; j++) {
    console.log(i, j, map[j][i])
    col.push(map[j][i])
  }
  newmap.push(col)
}
console.log(newmap)
map = newmap
const x = map.findIndex(row => row.find(col => col === '@'))
const y = map[x].findIndex(col => col === '@')
console.log(width, height, x, y)
const key_count = map.reduce(
  (acc, col) =>
    (acc += col.reduce(
      (acc2, row) =>
        row !== '#' && row !== '@' && row !== '.' && row !== row.toUpperCase()
          ? (acc2 += 1)
          : acc2,
      0
    )),
  0
)

console.log('Number of keys to find :', key_count)

let found_key = []

//while (found_key.length < key_count) {}

const findAllPaths = (map, initialPos) => {
  let position = initialPos
  let paths = []
  if (isAvaillablePlace(map[position[0] + 1][position[1]]))
    paths.push([position[0] + 1, position[1]])
    if (isAvaillablePlace(map[position[0]][position[1] + 1]))
      paths.push([position[0] + 1, position[1]])
}

const isAvaillablePlace = tile => {
  if (tile === '#') return false
  if (tile === tile.toUpperCase()) return false
  return true
}
