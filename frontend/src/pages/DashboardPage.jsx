import { useState } from 'react'
import Layout from '../components/Layout'
import TransactionForm from '../components/TransactionForm'
import TransactionRow from '../components/TransactionRow'
import Charts from '../components/Charts'
import { useTransactions } from '../hooks/useTransactions'
import { exportCSV } from '../api/transactions'
import Filters from '../components/Filters'

export default function DashboardPage() {
  const [filters, setFilters] = useState({})
  const { transactions, loading, error, add, update, remove } =
    useTransactions(filters)

  const [refreshKey, setRefreshKey] = useState(0)

  const handleAdd = async (data) => {
    await add(data)
    setRefreshKey(prev => prev + 1) // 🔥 trigger charts refresh
  }

  const handleUpdate = async (id, data) => {
    await update(id, data)
    setRefreshKey(prev => prev + 1)
  }

  const handleRemove = async (id) => {
    await remove(id)
    setRefreshKey(prev => prev + 1)
  }

  const balance = transactions.reduce((acc, t) =>
    t.type === 'income'
      ? acc + Number(t.amount)
      : acc - Number(t.amount), 0)

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((a, t) => a + Number(t.amount), 0)

  const expenses = transactions
    .filter(t => t.type === 'expense')
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
          <p className="text-xs text-slate-500">Solde</p>
          <p className="text-2xl font-bold">
            {balance.toFixed(2)} €
          </p>
        </div>

        <div className="card text-center">
          <p className="text-xs text-slate-500">Revenus</p>
          <p className="text-2xl font-bold text-green-500">
            +{income.toFixed(2)} €
          </p>
        </div>

        <div className="card text-center">
          <p className="text-xs text-slate-500">Dépenses</p>
          <p className="text-2xl font-bold text-red-500">
            -{expenses.toFixed(2)} €
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* FORM */}
        <div className="card">
          <h2 className="font-semibold mb-4">Nouvelle transaction</h2>
          <TransactionForm onSubmit={handleAdd} />
        </div>

        {/* LIST */}
        <div className="col-span-2 card">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold">Transactions</h2>

            <div className="flex gap-2">
              <Filters onFilter={setFilters} />

              <button onClick={handleExport} className="btn-secondary">
                Export CSV
              </button>
            </div>
          </div>

          {loading && <p>Chargement...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <ul className="divide-y">
            {transactions.map(t => (
              <TransactionRow
                key={t.id}
                transaction={t}
                onUpdate={handleUpdate}
                onDelete={handleRemove}
              />
            ))}
          </ul>
        </div>
      </div>

      {/* CHARTS */}
      <div className="mt-6">
        <Charts refreshKey={refreshKey} />
      </div>
    </Layout>
  )
}