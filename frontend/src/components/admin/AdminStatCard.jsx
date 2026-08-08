const ACCENT_CLASSES = {
  blue: "border-blue-500 text-blue-600",
  green: "border-green-500 text-green-600",
  yellow: "border-yellow-500 text-yellow-600",
  red: "border-red-500 text-red-600",
  gray: "border-gray-400 text-gray-600",
};

export default function AdminStatCard({ label, value, accent = "blue" }) {
  const accentClass = ACCENT_CLASSES[accent] || ACCENT_CLASSES.blue;
  const textClass = accentClass.split(" ")[1];

  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 ${accentClass} p-4`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${textClass}`}>{value ?? "-"}</p>
    </div>
  );
}