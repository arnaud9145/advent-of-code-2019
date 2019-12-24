const CODES = {
  ADD: 1,
  MULTIPLY: 2,
  INPUT: 3,
  OUTPUT: 4,
  JUMP_IF_TRUE: 5,
  JUMP_IF_FALSE: 6,
  LESS_THAN: 7,
  EQUALS: 8,
  ADJUST_RELATIVE_BASE: 9,
  HALT: 99
}

module.exports = instructions => {
  instructions = instructions.slice()

  return function* intcode() {
    let relative_base = 0
    let lastOutput = null

    for (let i = 0; i < instructions.length; ++i) {
      let instruction = instructions[i]
      const parsed = String(instruction)
        .padStart(5, '0')
        .split('')

      const getValue = (value, mode = '0') => {
        switch (mode) {
          case '0':
            return instructions[value] || 0
          case '1':
            return value
          case '2':
            return instructions[value + relative_base] || 0
          default:
            return 0
        }
      }
      const setValue = (index, value, mode = '0') => {
        switch (mode) {
          case '0':
            instructions[index] = value
            break
          case '2':
            instructions[index + relative_base] = value
            break
        }
      }
      const opcode = Number(parsed.slice(3).join(''))
      const modes = parsed.slice(0, 3)
      let a, b

      switch (opcode) {
        case CODES.ADD:
          a = getValue(instructions[++i], modes[2])
          b = getValue(instructions[++i], modes[1])
          setValue(instructions[++i], a + b, modes[0])
          break
        case CODES.MULTIPLY:
          a = getValue(instructions[++i], modes[2])
          b = getValue(instructions[++i], modes[1])
          setValue(instructions[++i], a * b, modes[0])
          break
        case CODES.INPUT:
          setValue(instructions[++i], yield { type: 'INPUT' }, modes[2])
          break
        case CODES.OUTPUT: {
          lastOutput = getValue(instructions[++i], modes[2])
          yield { type: 'OUTPUT', output: lastOutput }
          break
        }
        case CODES.JUMP_IF_TRUE: {
          a = getValue(instructions[++i], modes[2])
          b = getValue(instructions[++i], modes[1])
          if (a != 0) {
            i = b - 1
          }
          break
        }
        case CODES.JUMP_IF_FALSE: {
          a = getValue(instructions[++i], modes[2])
          b = getValue(instructions[++i], modes[1])
          if (a == 0) {
            i = b - 1
          }
          break
        }
        case CODES.LESS_THAN: {
          a = getValue(instructions[++i], modes[2])
          b = getValue(instructions[++i], modes[1])
          setValue(instructions[++i], a < b ? 1 : 0, modes[0])
          break
        }
        case CODES.EQUALS: {
          a = getValue(instructions[++i], modes[2])
          b = getValue(instructions[++i], modes[1])
          setValue(instructions[++i], a === b ? 1 : 0, modes[0])
          break
        }
        case CODES.ADJUST_RELATIVE_BASE: {
          a = getValue(instructions[++i], modes[2])
          relative_base += a
          break
        }
        case CODES.HALT:
          return { type: 'END', output: lastOutput }
      }
    }
  }
}
