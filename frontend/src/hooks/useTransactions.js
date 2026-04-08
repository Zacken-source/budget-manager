import { useState, useEffect, useCallback } from 'react'
import {
  getTransactions, createTransaction,
  updateTransaction, deleteTransaction
} from '../api/transactions'

export const useTransactions = (filters = {}) => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await getTransactions(filters)
      setTransactions(data)
    } catch {
      setError('Impossible de charger les transactions')
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filters)])

  useEffect(() => { fetchTransactions() }, [fetchTransactions])

  const add = async (data) => {
    const { data: created } = await createTransaction(data)
    setTransactions(prev => [created, ...prev])
  }

  const update = async (id, data) => {
    const { data: updated } = await updateTransaction(id, data)
    setTransactions(prev => prev.map(t => t.id === id ? updated : t))
  }

  const remove = async (id) => {
    await deleteTransaction(id)
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  return { transactions, loading, error, add, update, remove, refetch: fetchTransactions }
}