const input = `4 ZDGD, 1 HTRQV => 3 VRKNQ
15 XKZQZ, 1 MWZQ => 4 LHWX
1 WVPKL => 2 HJLX
1 LFDGN => 7 DMPX
14 HJLX, 3 KGKVK, 1 XQSVS => 6 HGSM
8 FKQS, 8 MWVCW => 3 MVSK
2 HGZLR, 2 WVPKL, 29 VRKNQ => 2 MDKZ
1 RLGBD, 22 VWFV => 6 MSGJ
24 PHLTR, 2 MWVCW => 8 JZMS
5 XSJLQ, 2 PFTM => 1 NCRJ
3 QNBK => 8 LKWK
16 HGSM => 3 BKHV
138 ORE => 5 SBXDS
3 KGKVK => 8 MTCZW
1 MDKZ, 8 HGNB => 5 HLDW
9 BKHV, 5 WDVS, 1 HGSM => 4 PFTM
1 PFNM, 14 MVSK => 3 VQCQ
16 LTXF => 4 TSKNX
5 VQCQ, 16 NFSVL, 5 HJLX, 1 TSKNX, 16 DMPX, 1 MSGJ, 3 BKHV => 7 CTHPF
8 WVPKL, 5 LHWX => 4 KGKVK
2 HLDW, 21 KSCS, 4 MTCZW, 1 DMPX, 1 LKWK, 7 NGVH, 12 HJLX, 18 MVSK => 9 VLGFJ
195 ORE => 3 NTZKP
6 FKQS => 1 GMJRS
6 LSLR, 8 HJLX => 4 NFSVL
16 NTZKP, 3 ZDGD => 8 XKZQZ
20 HLDW, 1 WDVS, 6 KGKVK => 7 PFNM
9 LHWX, 2 HLDW, 2 JZMS => 4 QNBK
1 RLGBD, 8 CKSPZ => 7 WDVS
3 RLGBD => 9 LTXF
14 SBXDS, 1 NTZKP => 7 FZBGM
14 CKSPZ, 1 MWZQ, 4 RLGBD => 8 NGVH
1 FKQS => 1 QWVC
6 MWZQ => 4 PBWF
4 ZDGD, 5 WVPKL => 4 FLWK
5 HLDW, 6 FKQS, 35 VLGFJ, 20 MVSK, 13 QKVZ, 5 CTHPF => 1 FUEL
5 QWVC, 10 LFDGN => 5 CKSPZ
4 QWVC, 4 FKQS, 1 MWVCW => 9 VWFV
1 SBXDS => 2 XQSVS
160 ORE => 9 HGZLR
1 KGKVK, 3 HJLX, 2 HGNB => 8 KSCS
6 GMJRS => 9 PHLTR
1 LFDGN, 9 XQSVS, 37 PBWF => 3 LSLR
7 FZBGM, 4 FNJX => 7 KFHFS
4 MVSK, 1 NFSVL, 2 NCRJ, 24 BKHV, 5 RLGBD, 5 NGVH => 9 QKVZ
4 VWFV, 1 RLGBD => 3 CMZQF
102 ORE => 4 ZDGD
1 SBXDS => 2 WVPKL
2 HTRQV => 1 HGNB
2 KFHFS, 7 FLWK, 5 WVPKL => 9 FKQS
5 GMJRS, 10 LHWX => 4 RLGBD
8 BKHV, 8 CMZQF => 3 XSJLQ
2 XQSVS => 6 LFDGN
103 ORE => 5 HTRQV
28 HGZLR, 2 ZDGD => 5 FNJX
6 VRKNQ, 1 XKZQZ => 7 MWZQ
10 ZDGD => 8 MWVCW`

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
const findOREAmountForXOutput = (product, amount) => {
  const reaction = reactions.find(r => r.output.name === product)
  //find if already have element
  const spare = overflowedMaterials.find(material => material.name === product)
  const existing = spare ? spare.amount : 0
  if (existing > 0)
    overflowedMaterials = overflowedMaterials.filter(
      material => material.name !== product
    )
  const multiple = Math.ceil(
    Math.max(amount - existing, 0) / reaction.output.amount
  )
  const extra = reaction.output.amount * multiple - (amount - existing)
  if (product != 'ORE' && extra > 0) {
    overflowedMaterials.push({
      name: product,
      amount: extra
    })
  }
  let ore = 0
  reaction.inputs.forEach(input => {
    if (input.name == 'ORE') {
      ore += multiple * input.amount
    } else {
      ore += findOREAmountForXOutput(input.name, multiple * input.amount)
    }
  })
  return ore
}
let i = 3060115 
console.log(i)
let result = findOREAmountForXOutput('FUEL', ++i)

//console.log('overflowedmaterials :', overflowedMaterials)

while (result < 1000000000000) {
  overflowedMaterials = []
  result = findOREAmountForXOutput('FUEL', ++i)
}
console.log('result :', result, i - 1)
