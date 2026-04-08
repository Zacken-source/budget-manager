import { useState } from 'react'
import Layout from '../components/Layout'
import TransactionForm from '../components/TransactionForm'
import TransactionRow  from '../components/TransactionRow'
import Charts from '../components/Charts'
import { useTransactions } from '../hooks/useTransactions'
import { exportCSV } from '../api/transactions'

export default function DashboardPage() {
  const [filters, setFilters] = useState({})
  const { transactions, loading, error, add, update, remove } = useTransactions(filters)

  const balance  = transactions.reduce((acc, t) =>
    t.type === 'income' ? acc + Number(t.amount) : acc - Number(t.amount), 0)
  const income   = transactions.filter(t => t.type === 'income')
                               .reduce((a, t) => a + Number(t.amount), 0)
  const expenses = transactions.filter(t => t.type === 'expense')
                               .reduce((a, t) => a + Number(t.amount), 0)

  const handleExport = async () => {
    const { data } = await exportCSV()
    const url = URL.createObjectURL(new Blob([data]))
    const a = document.createElement('a')
    a.href = url
    a.download = 'transactions.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Layout>
      {/* KPI */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card text-center">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Solde</p>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {balance.toFixed(2)} €
          </p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Revenus</p>
          <p className="text-2xl font-bold text-emerald-600">+{income.toFixed(2)} €</p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Dépenses</p>
          <p className="text-2xl font-bold text-red-500">-{expenses.toFixed(2)} €</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Formulaire */}
        <div className="card">
          <h2 className="font-semibold text-slate-800 mb-4">Nouvelle transaction</h2>
          <TransactionForm onSubmit={add} />
        </div>

        {/* Liste */}
        <div className="col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">Transactions</h2>
            <div className="flex gap-2">
              <select
                className="input w-auto text-sm py-1.5"
                onChange={e => setFilters(f => ({ ...f, type: e.target.value || undefined }))}
              >
                <option value="">Tout</option>
                <option value="income">Revenus</option>
                <option value="expense">Dépenses</option>
              </select>
              <button onClick={handleExport} className="btn-secondary text-sm py-1.5">
                Export CSV
              </button>
            </div>
          </div>

          {loading && <p className="text-sm text-slate-400 text-center py-8">Chargement...</p>}
          {error   && <p className="text-sm text-red-500 text-center py-8">{error}</p>}
          {!loading && !error && transactions.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-8">Aucune transaction pour l'instant</p>
          )}

          <ul className="divide-y divide-slate-100 -mx-2">
            {transactions.map(t => (
              <TransactionRow key={t.id} transaction={t} onUpdate={update} onDelete={remove} />
            ))}
          </ul>
        </div>
      </div>

      {/* Graphiques */}
      <div className="mt-6">
        <Charts />
      </div>
    </Layout>
  )
}