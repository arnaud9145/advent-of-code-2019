const input = `9 ORE => 2 A
8 ORE => 3 B
7 ORE => 5 C
2 A, 3 B, 6 C => 1 FUEL`

const reactions = input.split('\n').map(reaction => ({
  formula: reaction,
  inputs: reaction
    .split(' => ')[0]
    .split(', ')
    .map(input => ({
      name: input.split(' ')[1],
      amount: parseInt(input.split(' ')[0])
    })),
  output: reaction
    .split(' => ')[1]
    .split(', ')
    .map(input => ({
      name: input.split(' ')[1],
      amount: parseInt(input.split(' ')[0])
    }))[0]
}))
console.log('START')
console.log('__________________')
const findOREAmountForXOutput = (output, x) => {
  if (output === 'ORE') {
    return x
  }
  console.log('FIND ORE AMOUNT FOR', x, output)
  const reaction = reactions.find(r => r.output.name === output)
  console.log('found reaction :', reaction.formula)
  const amountRequiredByInputsForReaction = reaction.inputs.reduce((acc, a) => {
    acc +=
      findOREAmountForXOutput(a.name, a.amount) *
      Math.ceil(x / reaction.output.amount)
    return acc
  }, 0)
  console.log(
    'FOUND ORE AMOUNT FOR',
    x,
    output,
    ':',
    amountRequiredByInputsForReaction
  )

  return amountRequiredByInputsForReaction
}

//const result = findOREAmountForXOutput('FUEL', 1)

let tab = [{ name: 'A', amount: 2 }]
let newTab = []

tab.forEach(element => {
  const reaction = reactions.find(r => r.output.name === element.name)
  reaction.inputs.forEach(input => {
    newTab.push(input)
  })
  console.log(tab, newTab)
  tab = newTab
})

//console.log('result :', result)
