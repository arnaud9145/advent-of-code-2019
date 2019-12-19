let input = '03036732577212944063491565474664'

let columns = input.split('')
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

const phase = input => {
  let tab = []
  let output = []
  let patternSum = 0
  for (let step = 0; step < input.length; step++) {
    tab = contructPattern(input.length, step + 1, [0, 1, 0, -1])
    let result = 0
    patternSum = 0
    for (let i = 0; i < tab.length; i++) {
      result += tab[i] * input[i]
      patternSum += Math.abs(tab[i])
    }
    result = Math.abs(result) % 10
    output.push(result)
  }
  return output
}

const fft = (input, numberOfPhases) => {
  for (let i = 0; i < numberOfPhases; i++) {
    input = phase(input)
  }
  return input
}
console.log('Calling FFT')

const result = fft(columns, 100)
console.log('End FFT')

const whereToSearch = parseInt(result.slice(0, 7).join(''))

console.log(result.slice(whereToSearch, whereToSearch + 8).join(''))
