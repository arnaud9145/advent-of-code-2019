const fs = require('fs')

let input = '03036732577212944063491565474664'

let columns = []
console.log('start building input')

for (let i = 0; i < 10000; i++) {
  columns = [...columns, ...input.split('')]
}
console.log('finished building input', columns.length)
const contructPattern = (length, phase = 1, basepattern) => {
  const tab = []
  let index = 0
  let k = 0
  for (let i = 0; i < length + 1; i++) {
    tab.push(basepattern[index])
    k++
    if (k === phase) {
      index++
      k = 0
    }

    if (index === basepattern.length) index = 0
  }
  tab.shift()
  return tab
}
console.log('constructing pattern')
for (let step = 1; step <= columns.length; step++) {
  const data = contructPattern(columns.length, step, [0, 1, 0, -1])
  fs.appendFile('patterns/pattern_' + step + '.txt', data.join(','), err => {
    if (err) console.log(err)
  })
}
console.log('finished constructing pattern')
/*
const phase = input => {
  let output = []
  for (let step = 0; step < input.length; step++) {
    let result = 0
    for (let i = 0; i < input.length; i++) {
      result += tab[step][i] * input[i]
    }
    result = Math.abs(result) % 10
    output.push(result)
    console.log(output.length)
  }
  return output
}

const fft = (input, numberOfPhases) => {
  for (let i = 0; i < numberOfPhases; i++) {
    console.log('phase', i)
    input = phase(input)
  }
  return input
}
console.log('Calling FFT')

const result = fft(columns, 100)
console.log('End FFT')

const whereToSearch = parseInt(result.slice(0, 7).join(''))
console.log('result :')
console.log(result.slice(whereToSearch, whereToSearch + 8).join(''))
*/
