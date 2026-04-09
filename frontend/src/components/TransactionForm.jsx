import { useState, useEffect } from 'react'
import { getCategories } from '../api/categories'

const EMPTY = { amount: '', type: 'expense', category_id: '', description: '', date: new Date().toISOString().split('T')[0] }
export default function TransactionForm({ onSubmit, initial = null, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getCategories().then(r => setCategories(r.data))
  }, [])

  const filtered = categories.filter(c => c.type === form.type)

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({ ...form, amount: parseFloat(form.amount) })
      if (!initial) setForm(EMPTY)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Montant (€)</label>
          <input
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            className="input"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            required
          />
        </div>
        <div>
          <label className="label">Type</label>
          <select name="type" className="input" value={form.type} onChange={handleChange}>
            <option value="expense">Dépense</option>
            <option value="income">Revenu</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label">Catégorie</label>
        <select name="category_id" className="input" value={form.category_id} onChange={handleChange} required>
          <option value="">Choisir...</option>
          {filtered.map(c => (
            <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Date</label>
          <input
            name="date"
            type="date"
            className="input"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="label">Description</label>
          <input
            name="description"
            className="input"
            value={form.description}
            onChange={handleChange}
            placeholder="Optionnel"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button type="submit" className="btn-primary flex-1" disabled={loading}>
          {loading ? 'Enregistrement...' : initial ? 'Mettre à jour' : 'Ajouter'}
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Annuler
          </button>
        )}
      </div>
    </form>
    
  )
}