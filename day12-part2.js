const input = `<x=-10, y=-13, z=7>
<x=1, y=2, z=1>
<x=-15, y=-3, z=13>
<x=3, y=7, z=-4>`
const tab = input
  .split('\n')
  .map(line =>
    line
      .replace('<', '')
      .replace('>', '')
      .replace('x=', '')
      .replace('y=', '')
      .replace('z=', '')
      .split(', ')
      .map(c => parseInt(c))
  )
  .map(coord => [coord, [0, 0, 0]])
const printCoords = planet =>
  console.log(
    `pos=<x=${planet[0][0]}, y=${planet[0][1]}, z=${planet[0][2]}>, vel=<x=${planet[1][0]}, y=${planet[1][1]}, z=${planet[1][2]}>`
  )
const printAllCoords = tab => {
  tab.forEach(planet => {
    printCoords(planet)
  })
}

const findIndexInTab = (positions, position) => {
  return positions.findIndex(
    p =>
      p[0] === position[0] &&
      p[1] === position[1] &&
      p[2] === position[2] &&
      p[3] === position[3] &&
      p[4] === position[4] &&
      p[5] === position[5] &&
      p[6] === position[6] &&
      p[7] === position[7]
  )
}

let result = []
for (let k = 0; k < 3; k++) {
  let positions = []
  let step = 0
  let index = -1
  do {
    // printAllCoords(tab)
    positions.push([...tab.map(t => t[0][k]), ...tab.map(t => t[1][k])])
    for (let i = 0; i < tab.length - 1; i++) {
      const planetA = tab[i]
      for (let j = i + 1; j < tab.length; j++) {
        const planetB = tab[j]
        if (planetA[0][k] > planetB[0][k]) {
          planetA[1][k] -= 1
          planetB[1][k] += 1
        }
        if (planetA[0][k] < planetB[0][k]) {
          planetA[1][k] += 1
          planetB[1][k] -= 1
        }
      }
    }

    for (let i = 0; i < tab.length; i++) {
      const planetA = tab[i]
      planetA[0][k] += planetA[1][k]
    }
    step++
    index = findIndexInTab(positions, [
      ...tab.map(t => t[0][k]),
      ...tab.map(t => t[1][k])
    ])
  } while (index === -1)

  console.log(k, ` : After ${step} steps:`)
  console.log('Last position and velocity :')
  console.log([...tab.map(t => t[0][k]), ...tab.map(t => t[1][k])])
  console.log("première occurence à l'index :")
  console.log(index)
  console.log('position de la deuxième occurence :')
  console.log(positions.length)
  result.push([index, step - index])
}
console.log('result :')
console.log(result)
let i = 1
let j = 1
let k = 1
let a = result[0][0] + result[0][1] * i
let b = result[1][0] + result[1][1] * j
let c = result[2][0] + result[2][1] * k
do {
  while (a < b || a < c) {
    a = result[0][0] + result[0][1] * i
    i++
  }
  while (b < a || b < c) {
    b = result[1][0] + result[1][1] * j
    j++
  }
  while (c < a || c < b) {
    c = result[2][0] + result[2][1] * k
    k++
  }
  //console.log('i, j, k, a, b, c :', i, j, k, a, b, c)
} while (a !== b || a !== c)
console.log('number of steps : ', a)
