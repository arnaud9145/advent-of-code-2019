module.exports = (
  instructions,
  inputFonction,
  initialPosition = 0,
  returnWhenOutput = false,
  verbose = false
) => {
  instructions = instructions.map(instruction => parseInt(instruction))

  instructions = [...instructions, ...new Array(1000).fill(0)]
  let condition = true
  let i = initialPosition
  let a_position, b_position, result_position, a_value, b_value
  let relative_base = 0

  const getValue = (mode, position) => {
    switch (mode) {
      case 0:
        return parseInt(instructions[position])
      case 1:
        return parseInt(position)
      case 2:
        return parseInt(instructions[position + relative_base])
      default:
        return null
    }
  }

  const debug = log => {
    if (verbose) console.log(log)
  }

  let outputs = []
  while (condition) {
    let first_instruction = `${instructions[i]}`
    debug('opcode : ' + first_instruction)
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

        if (a_mode === 2) result_position += relative_base

        a_value = getValue(c_mode, a_position)
        b_value = getValue(b_mode, b_position)

        instructions[result_position] = a_value + b_value
        debug(
          a_value +
            ' + ' +
            b_value +
            ' = ' +
            instructions[result_position] +
            ', setting result at position : ' +
            result_position
        )

        i += 3
        break
      case 2:
        a_position = instructions[i + 1]
        b_position = instructions[i + 2]
        result_position = instructions[i + 3]

        if (a_mode === 2) result_position += relative_base

        a_value = getValue(c_mode, a_position)
        b_value = getValue(b_mode, b_position)

        instructions[result_position] = a_value * b_value
        debug(
          a_value +
            ' * ' +
            b_value +
            ' = ' +
            instructions[result_position] +
            ', setting result at position : ' +
            result_position
        )
        i += 3
        break
      case 3:
        a_position = instructions[i + 1]
        if (c_mode === 2) a_position += relative_base
        const input = inputFonction()
        debug('input ' + input)
        instructions[a_position] = parseInt(input)

        i += 1
        break
      case 4:
        a_position = instructions[i + 1]
        const output = getValue(c_mode, a_position)
        debug('output ' + output)

        outputs.push(output)
        if (returnWhenOutput) return { outputs, instructions, cursor: i + 2 }
        i += 1
        break
      case 5:
        debug('jump-if-true')
        a_position = instructions[i + 1]
        b_position = instructions[i + 2]

        a_value = getValue(c_mode, a_position)
        b_value = getValue(b_mode, b_position)

        if (a_value !== 0) i = b_value - 1
        else i += 2
        break
      case 6:
        debug('jump-if-false')
        a_position = instructions[i + 1]
        b_position = instructions[i + 2]

        a_value = getValue(c_mode, a_position)
        b_value = getValue(b_mode, b_position)

        if (a_value === 0) i = b_value - 1
        else i += 2
        break
      case 7:
        debug('jump-if-less')
        a_position = instructions[i + 1]
        b_position = instructions[i + 2]
        result_position = instructions[i + 3]

        if (a_mode === 2) result_position += relative_base

        a_value = getValue(c_mode, a_position)
        b_value = getValue(b_mode, b_position)

        instructions[result_position] = a_value < b_value ? 1 : 0
        i += 3
        break
      case 8:
        debug('jump-if-equals')
        a_position = instructions[i + 1]
        b_position = instructions[i + 2]
        result_position = instructions[i + 3]

        if (a_mode === 2) result_position += relative_base

        a_value = getValue(c_mode, a_position)
        b_value = getValue(b_mode, b_position)

        instructions[result_position] = a_value === b_value ? 1 : 0
        i += 3
        break
      case 9: // adjust the relative base
        debug('adjust-relative-base')
        a_position = instructions[i + 1]
        a_value = getValue(c_mode, a_position)
        relative_base += parseInt(a_value)

        i += 1
        break
      case 99:
        debug('end')
        condition = false
        break
      default:
        console.error('UNKNOWN CODE :', instructions[i])
        condition = false
        break
    }
    i++
    if (i > 100000) condition = false
  }
  return { outputs, instructions, end: true }
}
