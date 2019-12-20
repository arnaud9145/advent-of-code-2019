console.log('start')
const fs = require('fs')
const engine = require('./engine')

let instructions = fs.readFileSync('./inputs/day7.txt', 'utf8').split(',')
class Amplifer {
  constructor(phase) {
    this.phase = phase
    this.instructions = instructions
    this.cursor = 0
    this.askedonce = false
  }

  compute(input) {
    const inputFunction = () => {
      if (!this.askedonce) {
        this.askedonce = true
        return this.phase
      } else {
        return input
      }
    }
    const result = engine(this.instructions, inputFunction, this.cursor, true)
    this.instructions = result.instructions
    //console.log(result.instructions.join(','))
    this.cursor = result.cursor
    const output = result.outputs[0]
    return output
  }
}

const getOutputForGivenPhases = phases => {
  let it = 0
  const A = new Amplifer(phases[0])
  const B = new Amplifer(phases[1])
  const C = new Amplifer(phases[2])
  const D = new Amplifer(phases[3])
  const E = new Amplifer(phases[4])
  let output = 0
  let last_output = 0
  while (it < 10000) {
    it++
    output = A.compute(output)
    output = B.compute(output)
    output = C.compute(output)
    output = D.compute(output)
    output = E.compute(output)
    if (output === undefined) {
      return last_output
    }
    last_output = output
  }
}

const lower = 5
const upper = 10

let output_max = 0
let best_phase = []
for (let i = lower; i < upper; i++) {
  for (let j = lower; j < upper; j++) {
    if (j === i) continue
    for (let k = lower; k < upper; k++) {
      if (k === i || k === j) continue
      for (let l = lower; l < upper; l++) {
        if (l === i || l === j || l === k) continue
        for (let m = lower; m < upper; m++) {
          if (m === i || m === j || m === k || m === l) continue
          const phase = [i, j, k, l, m]
          console.log(phase)
          const output = getOutputForGivenPhases(phase)
          if (output > output_max) {
            output_max = output
            best_phase = phase
          }
        }
      }
    }
  }
}
console.log('best :', output_max, best_phase)
