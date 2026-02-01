export default function DayPicker({ value, onChange }) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ fontSize: 18, marginBottom: 20 }}
    />
  )
}

