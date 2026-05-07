'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import Nav from './components/nav'
import Footer from './components/footer'

export default function Home() {
  const [transactions, setTransactions] = useState([])
  const [filter, setFilter] = useState('30days')
  const [filterOpen, setFilterOpen] = useState(false)
  const [expandedId, setExpandedId] = useState(null)

  const filterOptions = [
    { key: '30days', label: 'Last 30 Days' },
    { key: '24hours', label: 'Last 24 Hours' },
    { key: 'all', label: 'All Transactions' },
  ]

  useEffect(() => {
    fetchTransactions()
  }, [filter])

  async function fetchTransactions() {
    let query = supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })

    if (filter === '30days') {
      const from = new Date()
      from.setDate(from.getDate() - 30)
      query = query.gte('date', from.toISOString().split('T')[0])
    } else if (filter === '24hours') {
      const from = new Date()
      from.setDate(from.getDate() - 1)
      query = query.gte('date', from.toISOString().split('T')[0])
    }

    const { data, error } = await query
    if (!error) setTransactions(data)
  }

  function toggleExpand(id) {
    setExpandedId(expandedId === id ? null : id)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this transaction?')) return
    await supabase.from('transactions').delete().eq('id', id)
    fetchTransactions()
  }

  const selectedLabel = filterOptions.find(f => f.key === filter)?.label

  return (
    <main style={{ paddingBottom: '80px' }}>

      {/* Add Transaction Button */}
      <Link href="/formPage">
        <button style={{
          background: '#2D6A4F',
          color: 'white',
          padding: '14px 28px',
          borderRadius: '12px',
          border: 'none',
          fontSize: '16px',
          width: '100%',
          marginBottom: '24px',
          cursor: 'pointer',
        }}>
          + Add New Transaction
        </button>
      </Link>

      {/* Header Row: Title + Filter Accordion */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', position: 'relative' }}>
        <span style={{ fontWeight: '600', fontSize: '16px' }}>Latest Transactions</span>

        {/* Accordion Trigger */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            style={{
              background: 'transparent',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            {selectedLabel} ▾
          </button>

          {/* Dropdown — overlays, does not push content */}
          {filterOpen && (
            <div style={{
              position: 'absolute',
              top: '110%',
              right: 0,
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '10px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              zIndex: 100,
              minWidth: '160px',
              overflow: 'hidden',
            }}>
              {filterOptions.map(option => (
                <button
                  key={option.key}
                  onClick={() => { setFilter(option.key); setFilterOpen(false) }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px 16px',
                    background: filter === option.key ? '#f0f0f0' : 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transactions List */}
      {transactions.length === 0 && (
        <p style={{ color: '#888', textAlign: 'center', marginTop: '40px' }}>No transactions found.</p>
      )}

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {transactions.map(tx => (
          <li
            key={tx.id}
            style={{
              background: tx.is_outgoing ? 'rgba(155, 34, 38, 0.07)' : 'rgba(45, 106, 79, 0.07)',
              borderLeft: `4px solid ${tx.is_outgoing ? '#E05C62' : '#52B788'}`,
              borderRadius: '10px',
              padding: '14px',
              cursor: 'pointer',
            }}
            onClick={() => toggleExpand(tx.id)}
          >
            {/* Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '600', fontSize: '15px' }}>{tx.name}</div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{tx.date}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontWeight: '700',
                  fontSize: '15px',
                  color: tx.is_outgoing ? '#E05C62' : '#2D6A4F'
                }}>
                  {tx.is_outgoing ? '−' : '+'}{tx.amount} SDG
                </div>
                <div style={{ fontSize: '11px', color: '#aaa' }}>{tx.is_outgoing ? 'Outgoing' : 'Incoming'}</div>
              </div>
            </div>

            {/* Expanded Actions */}
            {expandedId === tx.id && (
              <div style={{ marginTop: '12px', display: 'flex', gap: '10px' }} onClick={e => e.stopPropagation()}>
                <Link href={`/formPage/edit/${tx.id}`} style={{ flex: 1 }}>
                  <button style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}>
                    ✏️ Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(tx.id)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#9B2226',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <Footer />
      <Nav />
    </main>
  )
}