const input = '12345678'

const columns = input.split('')
const contructPattern = (length, phase = 1) => {
  const tab = []
  let value = 0
  let k = 0
  for (let i = 0; i < length; i++) {
    tab.push(value)
    k++
    if(k === phase) {
      value++
      k = 0
    }

    if (value === 1) value = -1
  }
  //shift
  return tab
}
const tab = contructPattern(6)
console.log(tab)