const input = `.#....#####...#..
##...##.#####..##
##...#...#.#####.
..#.....#...###..
..#.#.....#....##`

const map = input.split('\n').map(line => line.split(''))
const locations = map.map(line => line.map(column => 0))
console.log(locations)
console.log(map)

const scalareProduct = (v1, v2) => v1[0] * v2[1] - v1[1] * v2[0]

const areCollinearSameDirection = (v1, v2) => {
  const areCollinear = scalareProduct(v1, v2) === 0
  if (!areCollinear) return false
  const nv1x = v1[0] / Math.abs(v1[0])
  const nv1y = v1[1] / Math.abs(v1[1])
  const nv2x = v2[0] / Math.abs(v2[0])
  const nv2y = v2[1] / Math.abs(v2[1])
  return !(nv1x === -nv2x || nv1y === -nv2y)
}
const norme = v => Math.sqrt(v[0] * v[0] + v[1] * v[1])

const angleBetweenVectors = (v1, v2) => {
  let angle = Math.acos(scalareProduct(v1, v2) / (norme(v1) * norme(v2)))
  if (v1[0] >= 0) return angle
  else return 2 * Math.PI - angle
}

const getAsteroidsInRange = (stationx, stationy, map) => {
  let vectors = []
  map.forEach((line, y) =>
    line.forEach((asteroid, x) => {
      if (asteroid === '#') {
        if (!(x - stationx === 0 && y - stationy === 0))
          vectors.push([x - stationx, y - stationy])
      }
    })
  )
  let visibleAsteroidsVectors = vectors
  for (let i = 0; i < vectors.length - 1; i++) {
    for (let j = 0; j < vectors.length; j++) {
      if (i !== j && areCollinearSameDirection(vectors[i], vectors[j])) {
        if (norme(vectors[i]) < norme(vectors[j])) {
          visibleAsteroidsVectors = visibleAsteroidsVectors.filter(
            v => !(v[0] === vectors[j][0] && v[1] === vectors[j][1])
          )
        } else {
          visibleAsteroidsVectors = visibleAsteroidsVectors.filter(
            v => !(v[0] === vectors[i][0] && v[1] === vectors[i][1])
          )
        }
      }
    }
  }
  return visibleAsteroidsVectors
}
const countAsteroidsInSight = (stationx, stationy) =>
  getAsteroidsInRange(stationx, stationy, map).length

let maxCount = 0
let position = []
map.forEach((line, y) =>
  line.forEach((asteroid, x) => {
    if (asteroid === '#') {
      const count = countAsteroidsInSight(x, y)
      locations[y][x] = count
      if (maxCount < count) {
        maxCount = count
        position = [x, y]
      }
    }
  })
)
console.log(
  'Best is',
  position[0],
  ',',
  position[1],
  'with',
  maxCount,
  'other asteroids detected'
)
const vectors = getAsteroidsInRange(position[0], position[1], map)
  .map(vector => [
    vector[0] + position[0],
    vector[1] + position[1],
    angleBetweenVectors(vector, [1, 0])
  ])
  .sort((a, b) => {
    if (a[2] > b[2]) return 1
    if (a[2] < b[2]) return -1
    return 0
  })
console.log(vectors)
vectors.forEach(vector => {
  map[vector[0]][vector[1]]
})
