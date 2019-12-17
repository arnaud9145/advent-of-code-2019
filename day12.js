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

const printEnergy = planet => {
  const totalpot =
    Math.abs(planet[0][0]) + Math.abs(planet[0][1]) + Math.abs(planet[0][2])
  const totalkin =
    Math.abs(planet[1][0]) + Math.abs(planet[1][1]) + Math.abs(planet[1][2])
  console.log(
    `pot: ${Math.abs(planet[0][0])} + ${Math.abs(planet[0][1])} + ${Math.abs(
      planet[0][2]
    )} = ${totalpot};    kin: ${Math.abs(planet[1][0])} + ${Math.abs(
      planet[1][1]
    )} + ${Math.abs(
      planet[1][2]
    )} = ${totalkin};    total: ${totalpot} x ${totalkin} = ${totalpot *
      totalkin}`
  )
}
const printAllEnergy = tab => {
  tab.forEach(planet => {
    printEnergy(planet)
  })
}

console.log(tab)

const steps = 1000

for (let step = 0; step < steps; step++) {
  console.log(`After ${step} steps:`)
  printAllCoords(tab)

  for (let i = 0; i < tab.length - 1; i++) {
    const planetA = tab[i]
    for (let j = i + 1; j < tab.length; j++) {
      const planetB = tab[j]

      for (let k = 0; k < 3; k++) {
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
  }

  for (let i = 0; i < tab.length; i++) {
    const planetA = tab[i]
    for (let k = 0; k < 3; k++) {
      planetA[0][k] += planetA[1][k]
    }
  }
}
console.log(`After ${steps} steps:`)
printAllCoords(tab)
console.log('Energy after', steps, 'steps:')
printAllEnergy(tab)
