console.log('start')
const input = process.argv.slice(2)[1]

let instructions = input.split(',')
instructions = instructions.map(instruction => parseInt(instruction))

let condition = true
let i = 0
let a_position, b_position, result_position
while (condition) {
  console.log('Reading instruction at position ', i + ' : ', instructions[i])
  switch (instructions[i]) {
    case 1:
      a_position = instructions[i + 1]
      b_position = instructions[i + 2]
      result_position = instructions[i + 3]
      instructions[result_position] =
        instructions[a_position] + instructions[b_position]
      console.log(
        'Adding value at position ',
        a_position + ' and ',
        b_position +
          ' : ' +
          instructions[a_position] +
          ' + ' +
          instructions[b_position] +
          ' = ' +
          instructions[result_position]
      )
      console.log('Setting result at position ', result_position)
      i += 3
      break
    case 2:
      a_position = instructions[i + 1]
      b_position = instructions[i + 2]
      result_position = instructions[i + 3]
      instructions[result_position] =
        instructions[a_position] * instructions[b_position]
      console.log(
        'Multiplying value at position ',
        a_position + ' and ',
        b_position +
          ' : ' +
          instructions[a_position] +
          ' x ' +
          instructions[b_position] +
          ' = ' +
          instructions[result_position]
      )
      console.log('Setting result at position ', result_position)
      i += 3
      break
    case 99:
      condition = false
      break
    default:
      condition = false
      break
  }
  i++
  if (i > 10000) condition = false
}
console.log(
  'result :',
  instructions.reduce((acc, c) => (acc += `,${c}`))
)
console.log('result :', instructions[0])
console.log('stop')
