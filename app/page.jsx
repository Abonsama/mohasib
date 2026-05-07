'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import { formatAmount } from '../lib/format'
import Nav from './components/nav'
import Footer from './components/footer'
import { Plus, ChevronDown, Pencil, Trash2 } from 'lucide-react'
import { Suspense } from 'react'
import SuccessToast from './components/SuccessToast'

export default function Home() {
  const [transactions, setTransactions] = useState([])
  const [filter, setFilter] = useState('30days')
  const [filterOpen, setFilterOpen] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const searchParams = useSearchParams()

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
    <main style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '24px 16px',
      paddingBottom: 'calc(var(--nav-height) + 24px)',
    }}>
      <Suspense fallback={null}>
        <SuccessToast />
      </Suspense>


      {/* Add Button */}
      <Link href="/formPage" style={{ textDecoration: 'none' }}>
        <button style={{
          width: '100%',
          padding: '13px',
          borderRadius: 'var(--radius)',
          border: 'none',
          background: 'var(--green)',
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '48px',
          marginBottom: '28px',
          transition: 'opacity 0.15s',
        }}>
          <Plus size={16} />
          Add New Transaction
        </button>
      </Link>

      {/* Header Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '14px',
      }}>
        <span style={{
          fontSize: '13px',
          fontWeight: '600',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Latest Transactions
        </span>

        {/* Filter Accordion */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '20px',
              border: '1px solid var(--border)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            {selectedLabel}
            <ChevronDown
              size={13}
              style={{
                transform: filterOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
          </button>

          {filterOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              right: 0,
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
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
                    padding: '10px 14px',
                    background: filter === option.key ? 'var(--bg-secondary)' : 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: filter === option.key ? '600' : '400',
                    color: filter === option.key ? 'var(--text-primary)' : 'var(--text-secondary)',
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
        <div style={{
          textAlign: 'center',
          padding: '60px 0',
          color: 'var(--text-muted)',
          fontSize: '14px',
        }}>
          No transactions found.
        </div>
      )}

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {transactions.map(tx => (
          <li
            key={tx.id}
            onClick={() => toggleExpand(tx.id)}
            style={{
              background: tx.is_outgoing ? 'var(--red-tint)' : 'var(--green-tint)',
              border: '1px solid var(--border)',
              borderLeft: `3px solid ${tx.is_outgoing ? 'var(--red-light)' : 'var(--green-light)'}`,
              borderRadius: 'var(--radius)',
              padding: '14px',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>
                  {tx.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
                  {tx.date}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontWeight: '700',
                  fontSize: '14px',
                  color: tx.is_outgoing ? 'var(--red-light)' : 'var(--green)',
                }}>
                  {tx.is_outgoing ? '−' : '+'}{formatAmount(tx.amount)} SDG
                </div>
                <div style={{
                  fontSize: '11px',
                  color: tx.is_outgoing ? 'var(--red-light)' : 'var(--green-light)',
                  marginTop: '2px',
                  fontWeight: '500',
                }}>
                  {tx.is_outgoing ? 'Outgoing' : 'Incoming'}
                </div>
              </div>
            </div>

            {/* Expanded */}
            {expandedId === tx.id && (
              <div
                style={{ marginTop: '12px', display: 'flex', gap: '8px' }}
                onClick={e => e.stopPropagation()}
              >
                <Link href={`/formPage/edit/${tx.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                  <button style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}>
                    <Pencil size={13} /> Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(tx.id)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--red)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Trash2 size={13} /> Delete
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