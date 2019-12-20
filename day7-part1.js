console.log('start')
const engine = require('./engine')

let instructions = process.argv.slice(2)[1].split(',')

const amplifier = (phase, input) => {
  let askedonce = true
  const inputFunction = () => {
    askedonce = !askedonce
    if (!askedonce) {
      return phase
    } else {
      return input
    }
  }
  const result = engine(instructions, inputFunction)
  const output = result.outputs[0]
  return output
}

const lower = 0
const upper = 5

let output_max = 0
let phase = []
for (let i = lower; i < upper; i++) {
  const outputI = amplifier(i, 0)
  for (let j = lower; j < upper; j++) {
    if (j === i) continue
    const outputJ = amplifier(j, outputI)
    for (let k = lower; k < upper; k++) {
      if (k === i || k === j) continue
      const outputK = amplifier(k, outputJ)
      for (let l = lower; l < upper; l++) {
        if (l === i || l === j || l === k) continue
        const outputL = amplifier(l, outputK)
        for (let m = lower; m < upper; m++) {
          if (m === i || m === j || m === k || m === l) continue
          const outputM = amplifier(m, outputL)
          if (outputM > output_max) {
            output_max = outputM
            phase = [i, j, k, l, m]
          }
        }
      }
    }
  }
}

console.log('stop', output_max, phase)
