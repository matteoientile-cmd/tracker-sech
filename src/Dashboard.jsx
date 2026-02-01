import { useState, useEffect } from "react"
import { supabase } from "./utils/supabase"

import AddMeal from "./components/AddMeal"
import AddSport from "./components/AddSport"
import Totals from "./components/Totals"
import DayPicker from "./components/DayPicker"
import DeficitChart from "./components/DeficitChart"

import { calcTotals, calcSportTotal, calcBMR } from "./utils/calculations"
import { todayKey } from "./utils/date"

console.log("🚀 Dashboard chargé")

export default function Dashboard() {
  /* =========================
     DATE SÉLECTIONNÉE
  ========================= */
  const [day, setDay] = useState(todayKey())
  const [dayId, setDayId] = useState(null)

  /* =========================
     DONNÉES
  ========================= */
  const [meals, setMeals] = useState([])
  const [sports, setSports] = useState([])
  const [loading, setLoading] = useState(true)

  /* =========================
     PROFIL (temporaire)
  ========================= */
  const profile = {
    poids: 70,
    taille: 178,
    age: 17,
    sexe: "male",
  }

  /* =========================
     CHARGER / CRÉER JOUR
  ========================= */
  useEffect(() => {
    async function loadDay() {
      setLoading(true)

      // 1️⃣ Cherche le jour
      let { data: existingDay, error } = await supabase
        .from("days")
        .select("*")
        .eq("date", day)
        .single()

      // 2️⃣ S'il n'existe pas → on le crée
      if (!existingDay) {
        const { data: newDay, error: insertError } = await supabase
          .from("days")
          .insert({ date: day })
          .select()
          .single()

        if (insertError) {
          console.error(insertError)
          return
        }

        existingDay = newDay
      }

      setDayId(existingDay.id)

      // 3️⃣ Charger repas
      const { data: mealsData } = await supabase
        .from("meals")
        .select("*")
        .eq("day_id", existingDay.id)

      // 4️⃣ Charger sports
      const { data: sportsData } = await supabase
        .from("sports")
        .select("*")
        .eq("day_id", existingDay.id)

      setMeals(mealsData || [])
      setSports(sportsData || [])
      setLoading(false)
    }

    loadDay()
  }, [day])

  /* =========================
     CALCULS JOUR
  ========================= */
  const totals = calcTotals(meals)
  const sportTotal = calcSportTotal(sports)
  const bmr = calcBMR(profile)
  const depense = Math.round(bmr * 1.2 + sportTotal)
  const deficit = totals.calories - depense

  /* =========================
     DONNÉES GRAPHE
  ========================= */
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function loadChart() {
      const { data: days } = await supabase.from("days").select("*")

      if (!days) return

      const results = []

      for (const d of days) {
        const { data: meals } = await supabase
          .from("meals")
          .select("*")
          .eq("day_id", d.id)

        const { data: sports } = await supabase
          .from("sports")
          .select("*")
          .eq("day_id", d.id)

        const t = calcTotals(meals || [])
        const s = calcSportTotal(sports || [])
        const dep = bmr * 1.2 + s

        results.push({
          date: d.date.slice(5),
          calories: t.calories,
          depense: Math.round(dep),
          deficit: Math.round(t.calories - dep),
        })
      }

      setChartData(results.sort((a, b) => a.date.localeCompare(b.date)))
    }

    loadChart()
  }, [meals, sports])

  /* =========================
     ACTIONS REPAS
  ========================= */
  async function addMeal(meal) {
    const { data } = await supabase
      .from("meals")
      .insert({ ...meal, day_id: dayId })
      .select()
      .single()

    setMeals(m => [...m, data])
  }

  async function removeMeal(id) {
    await supabase.from("meals").delete().eq("id", id)
    setMeals(m => m.filter(x => x.id !== id))
  }

  /* =========================
     ACTIONS SPORT
  ========================= */
  async function addSport(sport) {
    const { data } = await supabase
      .from("sports")
      .insert({ ...sport, day_id: dayId })
      .select()
      .single()

    setSports(s => [...s, data])
  }

  async function removeSport(id) {
    await supabase.from("sports").delete().eq("id", id)
    setSports(s => s.filter(x => x.id !== id))
  }

  /* =========================
     EXPORT TEXTE
  ========================= */
  function exportDayText() {
    let text = `📅 Journée du ${day}\n\n`

    text += "🍽️ Repas :\n"
    meals.forEach(m => {
      text += `- ${m.label} : ${m.calories} kcal, ${m.proteines || 0} g protéines\n`
    })

    text += "\n🏃 Sport :\n"
    sports.forEach(s => {
      text += `- ${s.type} : ${s.calories} kcal\n`
    })

    text += `\n📊 Totaux\nCalories: ${totals.calories}\nProtéines: ${totals.proteines}\nDépense: ${depense}\nDéficit: ${deficit}`

    navigator.clipboard.writeText(text)
    alert("Journée copiée 📋")
  }

  /* =========================
     RENDER
  ========================= */
  if (loading) return <p>Chargement…</p>

  return (
    <div className="container">
      <div className="section">
        <h1>Tracker Sèche</h1>
        <DayPicker value={day} onChange={setDay} />
      </div>

      <Totals totals={totals} sportTotal={sportTotal} bmr={bmr} />

      <button onClick={exportDayText}>Exporter la journée</button>

      <div className="section">
        <h3>🍽️ Repas</h3>
        <AddMeal onAdd={addMeal} />
        {meals.map(m => (
          <div key={m.id} className="list-item">
            <span>{m.label}</span>
            <span>
              {m.calories} kcal
              <button onClick={() => removeMeal(m.id)}>✕</button>
            </span>
          </div>
        ))}
      </div>

      <div className="section">
        <h3>🏃 Sport</h3>
        <AddSport onAdd={addSport} />
        {sports.map(s => (
          <div key={s.id} className="list-item">
            <span>{s.type}</span>
            <span>
              {s.calories} kcal
              <button onClick={() => removeSport(s.id)}>✕</button>
            </span>
          </div>
        ))}
      </div>

      <div className="section">
        <h3>📊 Calories vs Dépense</h3>
        <DeficitChart data={chartData} />
      </div>
    </div>
  )
}