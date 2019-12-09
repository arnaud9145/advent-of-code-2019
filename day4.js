console.log('start')
const start = 367479
const end = 893698
let results = []
for (let i = start; i < end; i++) {
  const str = `${i}`
  let double = false
  let ordered = true
  for (let j = 0; j < 5; j++) {
    if (j === 0) {
      if (
        str.charAt(j) === str.charAt(j + 1) &&
        str.charAt(j) !== str.charAt(j + 2)
      )
        double = true
    } else if (j === 4) {
      if (
        str.charAt(j) === str.charAt(j + 1) &&
        str.charAt(j) !== str.charAt(j - 1)
      )
        double = true
    } else {
      if (
        str.charAt(j) === str.charAt(j + 1) &&
        str.charAt(j) !== str.charAt(j - 1) &&
        str.charAt(j) !== str.charAt(j + 2)
      )
        double = true
    }

    if (parseInt(str.charAt(j + 1)) < parseInt(str.charAt(j))) {
      ordered = false
    }
  }
  if (double && ordered) results.push(i)
}
console.log(results)
console.log('result : ', results.length)
console.log('end')
