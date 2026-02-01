import { useState } from "react"

export default function AddMeal({ onAdd }) {
  const [label, setLabel] = useState("")
  const [calories, setCalories] = useState("")
  const [proteines, setProteines] = useState("")

  function submit(e) {
    e.preventDefault()
    if (!label || !calories) return

    onAdd({
      label,
      calories: Number(calories),
      proteines: Number(proteines || 0),
    })

    setLabel("")
    setCalories("")
    setProteines("")
  }

  return (
    <form onSubmit={submit}>
    

      <input
        type="text"
        placeholder="Nom repas"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />

      <input
        type="number"
        placeholder="Calories"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
      />

      <input
        type="number"
        placeholder="Protéines"
        value={proteines}
        onChange={(e) => setProteines(e.target.value)}
      />

      <button type="submit">Ajouter</button>
    </form>
  )
}

