console.log('start')
const fs = require('fs')
const engine = require('./engine')

class Camera {
  constructor(program) {
    this.engine = engine(program)()
    this.steps = 0
    this.screen = ''
  }
  step() {
    this.steps++
    let { value, done } = this.engine.next()
    if (value.type === 'INPUT') {
      console.log('INPUT', value, done)
    }

    if (value.type === 'OUTPUT') {
      this.updateView(value.output)
    }
    if (done) {
      console.log('done', value)
      console.log(this.screen)
      return true
    }

    return false
  }
  updateView(value) {
    this.screen += String.fromCharCode(value)
    console.log(value)
    console.log(this.screen)
  }
  getIntersect() {
    let parameter = 0
    const tab = this.screen.split('\n').map(line => line.split(''))
    const height = tab.length
    const width = tab[0].length
    for (let i = 1; i < width - 1; i++) {
      for (let j = 1; j < height - 1; j++) {
        if (tab[j][i] === '#') {
          if (
            tab[j][i - 1] === '#' &&
            tab[j][i + 1] === '#' &&
            tab[j - 1][i] === '#' &&
            tab[j + 1][i] === '#'
          ) {
            parameter += i * j
          }
        }
      }
    }
    return parameter
  }
}

const input = fs
  .readFileSync(require('path').resolve(__dirname, './inputs/day17.txt'))
  .toString()
let instructions = input.split(',').map(Number)
const camera = new Camera(instructions)
let ended = false
while (!ended) {
  ended = camera.step()
}
console.log(camera.getIntersect())
console.log('end')
