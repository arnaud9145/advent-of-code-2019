console.log('start')
const engine = require('./engine')

let input = process.argv.slice(2)[1]
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
    const outputJ = engine(input, inputFunctionI)
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
      const outputK = engine(input, inputFunctionJ)
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
        const outputL = engine(input, inputFunctionK)
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
          const outputM = engine(input, inputFunctionL)
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
            const output_final = engine(input, inputFunctionM)
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
