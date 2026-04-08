import { useState } from 'react'

export default function Filters({ onFilter}) {
    const [values, setValues] = useState({ type: '', date_from: '', date_to: ''})
    const handleChange = (e) => {
        const next = { ...values, [e.target.name]: e.target.value }
        setValues(next)
        onFilter(Object.fromEntries(Object.entries(next).filter(([_, v]) => v)))
    }
    const reset = () => {
        setValues({ type: '', date_from: '', date_to: ''})
        onFilter({})
    }
    const hasFilter = Object.values(values).some(Boolean)

    return (
        <div className="flex flex-wrap items-end gap-3">
            <div>
                <label className="label text-xs">Type</label>
                <select name="type" className="input w-auto text-sm" value={values.type} onChange={handleChange}>
                    <option value="">Tout</option>
                    <option value="income">Revenus</option>
                    <option value="expense">Dépenses</option>
                </select>
            </div>
            <div>
                <label className="label text-xs">Du</label>
                <input name="date_from" type="date" className="input text-sm" value={values.date_from} onChange={handleChange} />
            </div>
            <div>
                <label className="label text-xs">Au</label>
                <input name="date_to" type="date" className="input text-sm" value={values.date_to} onChange={handleChange} />
            </div>
            {hasFilter && (
                <button onClick={reset} className="btn-secondary text-sm py-1.5">
                    Réinitialiser
                </button>
            )}
        </div>
    )
}