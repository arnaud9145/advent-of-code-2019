console.log('start')
const engine = require('./engine')

let instructions = process.argv.slice(2)[1].split(',')

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

let it = 0
const A = new Amplifer(9)
const B = new Amplifer(7)
const C = new Amplifer(8)
const D = new Amplifer(5)
const E = new Amplifer(6)
let output = 0
while (it < 1000) {
  it++
  console.log('A')
  // console.log(A.instructions.join(','))
  output = A.compute(output)
  // console.log(A.instructions.join(','))
  console.log('B')
  output = B.compute(output)
  console.log('C')
  output = C.compute(output)
  console.log('D')
  output = D.compute(output)
  console.log('E')
  output = E.compute(output)
  if (!output) {
    break
  }
  console.log(output)
}
