module.exports = (inputs, inputFonction) => {
  let instructions = inputs.split(',')
  instructions = instructions.map(instruction => parseInt(instruction))

  let condition = true
  let i = 0
  let a_position, b_position, result_position, a_value, b_value
  let last_output = null
  while (condition) {
    let first_instruction = `${instructions[i]}`
    if (first_instruction.length < 2)
      first_instruction = `0${first_instruction}`
    const opcode =
      first_instruction[first_instruction.length - 2] +
      first_instruction[first_instruction.length - 1]
    let a_mode, b_mode, c_mode
    if (first_instruction.length > 2)
      c_mode = parseInt(first_instruction[first_instruction.length - 3])
    else c_mode = 0
    if (first_instruction.length > 3)
      b_mode = parseInt(first_instruction[first_instruction.length - 4])
    else b_mode = 0
    if (first_instruction.length > 4)
      a_mode = parseInt(first_instruction[first_instruction.length - 5])
    else a_mode = 0
    switch (parseInt(opcode)) {
      case 1:
        a_position = instructions[i + 1]
        b_position = instructions[i + 2]
        result_position = instructions[i + 3]

        a_value = c_mode === 0 ? instructions[a_position] : a_position
        b_value = b_mode === 0 ? instructions[b_position] : b_position
        a_value = parseInt(a_value)
        b_value = parseInt(b_value)

        instructions[result_position] = a_value + b_value
        /* console.log(
        a_value +
          ' + ' +
          b_value +
          ' = ' +
          instructions[result_position] +
          ', setting result at position :' +
          result_position
      )*/

        i += 3
        break
      case 2:
        a_position = instructions[i + 1]
        b_position = instructions[i + 2]
        result_position = instructions[i + 3]

        a_value = c_mode === 0 ? instructions[a_position] : a_position
        b_value = b_mode === 0 ? instructions[b_position] : b_position
        a_value = parseInt(a_value)
        b_value = parseInt(b_value)

        instructions[result_position] = a_value * b_value
        /*  console.log(
        a_value +
          ' * ' +
          b_value +
          ' = ' +
          instructions[result_position] +
          ', setting result at position :' +
          result_position
      )*/
        i += 3
        break
      case 3:
        a_position = instructions[i + 1]
        const input = inputFonction()
        instructions[a_position] = input

        i += 1
        break
      case 4:
        a_position = instructions[i + 1]
        const output = c_mode === 0 ? instructions[a_position] : a_position
        last_output = output
        i += 1
        break
      case 5:
        a_position = instructions[i + 1]
        b_position = instructions[i + 2]

        a_value = c_mode === 0 ? instructions[a_position] : a_position
        b_value = b_mode === 0 ? instructions[b_position] : b_position
        a_value = parseInt(a_value)
        b_value = parseInt(b_value)
        if (a_value !== 0) i = b_value - 1
        else i += 2
        break
      case 6:
        a_position = instructions[i + 1]
        b_position = instructions[i + 2]

        a_value = c_mode === 0 ? instructions[a_position] : a_position
        b_value = b_mode === 0 ? instructions[b_position] : b_position
        a_value = parseInt(a_value)
        b_value = parseInt(b_value)
        if (a_value === 0) i = b_value - 1
        else i += 2
        break
      case 7:
        a_position = instructions[i + 1]
        b_position = instructions[i + 2]
        result_position = instructions[i + 3]

        a_value = c_mode === 0 ? instructions[a_position] : a_position
        b_value = b_mode === 0 ? instructions[b_position] : b_position
        a_value = parseInt(a_value)
        b_value = parseInt(b_value)

        instructions[result_position] = a_value < b_value ? 1 : 0
        i += 3
        break
      case 8:
        a_position = instructions[i + 1]
        b_position = instructions[i + 2]
        result_position = instructions[i + 3]

        a_value = c_mode === 0 ? instructions[a_position] : a_position
        b_value = b_mode === 0 ? instructions[b_position] : b_position
        a_value = parseInt(a_value)
        b_value = parseInt(b_value)

        instructions[result_position] = a_value === b_value ? 1 : 0
        i += 3
        break
      case 99:
        condition = false
        break
      default:
        console.log('UNKNOWN CODE :', instructions[i])
        condition = false
        break
    }
    i++
    if (i > 100000) condition = false
  }
  return last_output
}
