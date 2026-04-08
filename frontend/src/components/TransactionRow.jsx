import { useState } from 'react'
import TransactionForm from './TransactionForm'

export default function TransactionRow({ transaction: t, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)

  const isIncome = t.type === 'income'

  if (editing) return (
    <li className="px-4 py-3 bg-slate-50 rounded-lg">
      <TransactionForm
        initial={{
          amount: t.amount, type: t.type,
          category_id: t.category_id,
          description: t.description || '',
          date: t.date.split('T')[0],
        }}
        onSubmit={async (data) => { await onUpdate(t.id, data); setEditing(false) }}
        onCancel={() => setEditing(false)}
      />
    </li>
  )

  return (
    <li className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-xl">{t.category_icon}</span>
        <div>
          <p className="text-sm font-medium text-slate-800">
            {t.category_name}
            {t.description && (
              <span className="font-normal text-slate-500"> — {t.description}</span>
            )}
          </p>
          <p className="text-xs text-slate-400">
            {new Date(t.date).toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`font-semibold ${isIncome ? 'text-emerald-600' : 'text-red-500'}`}>
          {isIncome ? '+' : '-'}{Number(t.amount).toFixed(2)} €
        </span>
        <button
          onClick={() => setEditing(true)}
          className="text-xs text-slate-400 hover:text-brand-600 transition-colors"
        >
          Modifier
        </button>
        <button
          onClick={() => onDelete(t.id)}
          className="text-xs text-slate-400 hover:text-red-500 transition-colors"
        >
          Supprimer
        </button>
      </div>
    </li>
  )
}