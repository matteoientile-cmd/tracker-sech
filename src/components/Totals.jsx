export default function Totals({ totals, sportTotal, bmr }) {
  const depense = Math.round(bmr * 1.2 + sportTotal)
  const deficit = totals.calories - depense

  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <span>Calories</span>
        <strong>{totals.calories}</strong>
      </div>

      <div className="kpi-card">
        <span>Protéines</span>
        <strong>{totals.proteines}</strong>
      </div>

      <div className="kpi-card">
        <span>Dépense</span>
        <strong>{depense}</strong>
      </div>

      <div className={`kpi-card ${deficit <= 0 ? "good" : "bad"}`}>
        <span>Déficit</span>
        <strong>{deficit}</strong>
      </div>
    </div>

  )
}