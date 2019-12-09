console.log('start')
let output = 0
let noun = 0
let verb = 0
do {
  let input = process.argv.slice(2)[1]

  let instructions = input.split(',')
  instructions = instructions.map(instruction => parseInt(instruction))
  instructions[1] = noun
  instructions[2] = verb

  let condition = true
  let i = 0
  let a_position, b_position, result_position
  while (condition) {
    switch (instructions[i]) {
      case 1:
        a_position = instructions[i + 1]
        b_position = instructions[i + 2]
        result_position = instructions[i + 3]
        instructions[result_position] =
          instructions[a_position] + instructions[b_position]

        i += 3
        break
      case 2:
        a_position = instructions[i + 1]
        b_position = instructions[i + 2]
        result_position = instructions[i + 3]
        instructions[result_position] =
          instructions[a_position] * instructions[b_position]

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
  console.log('result :', instructions[0], noun, verb)
  noun++
  if (noun === 100) {
    noun = 0
    verb++
  }
  output = instructions[0]
} while (output !== 19690720 || verb === 100)
console.log('stop')
