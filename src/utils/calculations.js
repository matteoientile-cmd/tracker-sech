export function calcBMR({ poids, taille, age, sexe }) {
  if (sexe === "male") {
    return 10 * poids + 6.25 * taille - 5 * age + 5
  }
  return 10 * poids + 6.25 * taille - 5 * age - 161
}

export function calcTotals(meals) {
  return meals.reduce(
    (acc, m) => {
      acc.calories += Number(m.calories)
      acc.proteines += Number(m.proteines || 0)
      return acc
    },
    { calories: 0, proteines: 0 }
  )
}

export function calcSportTotal(sports) {
  return sports.reduce((sum, s) => sum + Number(s.calories), 0)
}


