'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { formatAmount } from '../../lib/format'
import Nav from '../components/nav'
import Footer from '../components/footer'
import { Search as SearchIcon, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function Search() {
  const [name, setName] = useState('')
  const [amountMin, setAmountMin] = useState('')
  const [amountMax, setAmountMax] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [type, setType] = useState('all')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSearch(e) {
    e.preventDefault()
    setLoading(true)
    setSearched(true)
    setExpandedId(null)

    let query = supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })

    if (name.trim()) query = query.ilike('name', `%${name.trim()}%`)
    if (amountMin) query = query.gte('amount', parseFloat(amountMin))
    if (amountMax) query = query.lte('amount', parseFloat(amountMax))
    if (dateFrom) query = query.gte('date', dateFrom)
    if (dateTo) query = query.lte('date', dateTo)
    if (type === 'incoming') query = query.eq('is_outgoing', false)
    if (type === 'outgoing') query = query.eq('is_outgoing', true)

    const { data, error } = await query
    if (!error) setResults(data)
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this transaction?')) return
    await supabase.from('transactions').delete().eq('id', id)
    setResults(results.filter(tx => tx.id !== id))
  }

  const inputStyle = {
    padding: '10px 14px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    transition: 'border 0.15s',
  }

  const labelStyle = {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '6px',
    display: 'block',
  }

  return (
    <>
      <main style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '24px 16px',
        paddingBottom: 'calc(var(--nav-height) + 24px)',
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: 'var(--text-primary)',
          marginBottom: '24px',
        }}>
          Search
        </h2>

        <form onSubmit={handleSearch} style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '28px',
        }}>

          {/* Name */}
          <div>
            <label style={labelStyle}>Name / Beneficiary</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Ahmed, Rent…"
              style={inputStyle}
            />
          </div>

          {/* Amount Range */}
          <div>
            <label style={labelStyle}>Amount Range (SDG)</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="number"
                value={amountMin}
                onChange={e => setAmountMin(e.target.value)}
                placeholder="Min"
                min="0"
                style={{ ...inputStyle }}
              />
              <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>—</span>
              <input
                type="number"
                value={amountMax}
                onChange={e => setAmountMax(e.target.value)}
                placeholder="Max"
                min="0"
                style={{ ...inputStyle }}
              />
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label style={labelStyle}>Date Range</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                style={{ ...inputStyle }}
            />
            <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                style={{ ...inputStyle }}
            />
            </div>
          </div>

          {/* Type */}
          <div>
            <label style={labelStyle}>Type</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { key: 'all', label: 'All' },
                { key: 'incoming', label: '↓ Incoming' },
                { key: 'outgoing', label: '↑ Outgoing' },
              ].map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setType(opt.key)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    transition: 'all 0.15s',
                    background: type === opt.key
                      ? opt.key === 'incoming' ? '#2D6A4F'
                        : opt.key === 'outgoing' ? '#9B2226'
                        : '#1a1a1a'
                      : 'var(--bg)',
                    color: type === opt.key ? 'white' : 'var(--text-secondary)',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            style={{
              padding: '12px',
              borderRadius: 'var(--radius)',
              border: 'none',
              background: '#2D6A4F',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '4px',
            }}
          >
            <SearchIcon size={15} />
            {loading ? 'Searching…' : 'Search'}
          </button>

        </form>

        {/* Results */}
        {searched && (
          <div>
            <span style={{
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </span>

            {results.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '60px 0',
                color: 'var(--text-muted)',
                fontSize: '14px',
              }}>
                No transactions found.
              </div>
            )}

            <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {results.map(tx => (
                <li
                  key={tx.id}
                  onClick={() => setExpandedId(expandedId === tx.id ? null : tx.id)}
                  style={{
                    background: tx.is_outgoing ? 'var(--red-tint)' : 'var(--green-tint)',
                    border: '1px solid var(--border)',
                    borderLeft: `3px solid ${tx.is_outgoing ? '#E05C62' : '#52B788'}`,
                    borderRadius: 'var(--radius)',
                    padding: '14px',
                    cursor: 'pointer',
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
                        color: tx.is_outgoing ? '#E05C62' : '#2D6A4F',
                      }}>
                        {tx.is_outgoing ? '−' : '+'}{formatAmount(tx.amount)} SDG
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: tx.is_outgoing ? '#E05C62' : '#52B788',
                        marginTop: '2px',
                        fontWeight: '500',
                      }}>
                        {tx.is_outgoing ? 'Outgoing' : 'Incoming'}
                      </div>
                    </div>
                  </div>

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
                          background: '#9B2226',
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
          </div>
        )}

        <Footer />
      </main>
      <Nav />
    </>
  )
}