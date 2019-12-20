let data = '03036732577212944063491565474664'

let columns = []
console.log('start building data')
const datas = data.split('').map(d => parseInt(d))
for (let i = 0; i < 5000; i++) {
  columns = [...columns, ...datas]
}
console.log('finished building input', columns.length)

const fft = input => {
  let output = []
  let previousValue = 0
  for (let i = input.length - 1; i >= 0; i--) {
    previousValue = (previousValue + input[i]) % 10
    output.unshift(previousValue)
  }
  return output
}

for (let phase = 0; phase < 100; phase++) {
  columns = fft(columns)
  console.log('phase', phase)
}
console.log(
  columns.slice(0303673 - columns.length, 0303673 - columns.length + 8)
)
