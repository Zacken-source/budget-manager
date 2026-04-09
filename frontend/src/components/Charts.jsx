import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { getStats } from '../api/transactions'

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'
]

const formatMonth = (str) => {
  const [year, month] = str.split('-')
  return new Date(year, month - 1).toLocaleDateString('fr-FR', {
    month: 'short',
    year: '2-digit'
  })
}

export default function Charts({ refreshKey }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    setLoading(true)

    getStats()
      .then(r => {
        if (isMounted) setStats(r.data)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [refreshKey])

  if (loading) {
    return (
      <div className="h-40 flex items-center justify-center text-slate-400 text-sm">
        Chargement des graphiques...
      </div>
    )
  }

  if (!stats) return null

  const pieData = stats.byCategory
    .filter(c => c.type === 'expense')
    .map(c => ({
      name: `${c.icon} ${c.name}`,
      value: Number(c.total)
    }))

  const barData = stats.byMonth.map(m => ({
    month: formatMonth(m.month),
    Revenus: Number(m.income),
    Dépenses: Number(m.expenses),
  }))

  return (
    <div className="grid grid-cols-2 gap-6">

      {/* BAR CHART */}
      <div className="card">
        <h3 className="font-semibold mb-4">
          Évolution sur 6 mois
        </h3>

        {barData.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">
            Pas encore de données
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={16}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Revenus" fill="#10b981" />
              <Bar dataKey="Dépenses" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* PIE CHART */}
      <div className="card">
        <h3 className="font-semibold mb-4">
          Dépenses par catégorie
        </h3>

        {pieData.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">
            Pas encore de dépenses
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
              >
                {pieData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  )
}