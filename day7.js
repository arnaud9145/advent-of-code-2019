console.log('start')
const engine = require('./engine')

let instructions = process.argv.slice(2)[1].split(',')
let it = 0
const lower = 5
const upper = 10
let outputI = 0
while (it < 500) {
  it++
  let askedonceI = true
  let askedonceJ = true
  let askedonceK = true
  let askedonceL = true
  let askedonceM = true
  let output_max = 0
  let phase = []
  for (let i = lower; i < upper; i++) {
    const inputFunctionI = () => {
      askedonceI = !askedonceI
      if (!askedonceI) {
        return i
      } else {
        return outputI
      }
    }
    const resultJ = engine(instructions, inputFunctionI)
    instructions = resultJ.instructions
    const outputJ = resultJ.outputs[0]
    //  console.log('1 thruster output', outputJ, 'with phase', i)
    for (let j = lower; j < upper; j++) {
      if (j === i) continue
      const inputFunctionJ = () => {
        askedonceJ = !askedonceJ
        if (!askedonceJ) {
          return j
        } else {
          return `${outputJ}`
        }
      }
      const resultK = engine(instructions, inputFunctionJ)
      instructions = resultK.instructions
      const outputK = resultK.outputs[0]
      //   console.log('2 thruster output', outputK, 'with phase', j)
      for (let k = lower; k < upper; k++) {
        if (k === i || k === j) continue
        const inputFunctionK = () => {
          askedonceK = !askedonceK
          if (!askedonceK) {
            return k
          } else {
            return `${outputK}`
          }
        }
        const resultL = engine(instructions, inputFunctionK)
        instructions = resultL.instructions
        const outputL = resultL.outputs[0]
        //    console.log('3 thruster output', outputL, 'with phase', k)
        for (let l = lower; l < upper; l++) {
          if (l === i || l === j || l === k) continue
          const inputFunctionL = () => {
            askedonceL = !askedonceL
            if (!askedonceL) {
              return l
            } else {
              return `${outputL}`
            }
          }
          const resultM = engine(instructions, inputFunctionL)
          instructions = resultM.instructions
          const outputM = resultM.outputs[0]
          // console.log('4 thruster output', outputM, 'with phase', l)
          for (let m = lower; m < upper; m++) {
            if (m === i || m === j || m === k || m === l) continue
            const inputFunctionM = () => {
              askedonceM = !askedonceM
              if (!askedonceM) {
                return m
              } else {
                return `${outputM}`
              }
            }
            const resultN = engine(instructions, inputFunctionM)
            instructions = resultN.instructions
            const output_final = resultN.outputs[0]
            /*     console.log(
              '5 thruster output',
              output_final,
              'with phase',
              i,
              j,
              k,
              l,
              m
            )*/
            if (output_final > output_max) {
              output_max = output_final
              phase = [i, j, k, l, m]
            }
          }
        }
      }
    }
  }
  console.log('stop', output_max, phase)
  outputI = output_max
}
