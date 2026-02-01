import { useState } from "react"

export default function AddSport({ onAdd }) {
  const [type, setType] = useState("")
  const [calories, setCalories] = useState("")

  function submit(e) {
    e.preventDefault()
    if (!type || !calories) return

    onAdd({
      type,
      calories: Number(calories),
    })

    setType("")
    setCalories("")
  }

  return (
    <form onSubmit={submit}>


      <input
        type="text"
        placeholder="Sport"
        value={type}
        onChange={(e) => setType(e.target.value)}
      />

      <input
        type="number"
        placeholder="Calories brûlées"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
      />

      <button type="submit">Ajouter</button>
    </form>
  )
}
