var strategies = {
  "x2": a => a *= 2,
  "x3": a => a *= 3,
  "x4": a => a *= 4
}

var calculate = (strategie, number) => {
  return strategies[strategie](number)
}

console.log(calculate('x3', 4))