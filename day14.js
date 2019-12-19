const input = `9 ORE => 2 A
8 ORE => 3 B
7 ORE => 5 C
3 A, 4 B => 1 AB
5 B, 7 C => 1 BC
4 C, 1 A => 1 CA
2 AB, 3 BC, 4 CA => 1 FUEL`

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
let overflowedMaterials = []
const findOREAmountForXOutput = (output, x) => {
  if (output === 'ORE') {
    return x
  }
  console.log('FIND ORE AMOUNT FOR', x, output)
  const reaction = reactions.find(r => r.output.name === output)
  console.log('found reaction :', reaction.formula)
  const amountRequiredByInputsForReaction = reaction.inputs.reduce((acc, a) => {
    const numberOfReactions = Math.ceil(x / reaction.output.amount)
    const overflow = reaction.output.amount * numberOfReactions - x
    if (overflow > 0) {
      const index = overflowedMaterials.findIndex(
        material => material.name === reaction.output.name
      )
      if (index === -1)
        overflowedMaterials.push({
          name: reaction.output.name,
          amount: overflow
        })
      else overflowedMaterials[index].amount += overflow
    }
    console.log(
      'Produced :',
      reaction.output.amount,
      'required :',
      x,
      'number of reactions :',
      numberOfReactions,
      'overflow :',
      overflow
    )
    acc += findOREAmountForXOutput(a.name, a.amount) * numberOfReactions

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

const result = findOREAmountForXOutput('FUEL', 1)

console.log('result :', result)
console.log('overflowedmaterials :', overflowedMaterials)
