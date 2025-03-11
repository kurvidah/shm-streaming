import type { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  change?: string
  positive?: boolean
}

const StatCard = ({ title, value, icon, change, positive }: StatCardProps) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>

          {change && (
            <p className={`text-xs mt-2 flex items-center ${positive ? "text-green-500" : "text-red-500"}`}>
              {positive ? "↑" : "↓"} {change}
            </p>
          )}
        </div>

        <div className="bg-gray-700 p-3 rounded-lg">{icon}</div>
      </div>
    </div>
  )
}

export default StatCard

