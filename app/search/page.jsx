'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Nav from '../components/nav'
import Footer from '../components/footer'
import { formatAmount } from '../../lib/format'
export default function Search() {
  const [name, setName] = useState('')
  const [amountMin, setAmountMin] = useState('')
  const [amountMax, setAmountMax] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [type, setType] = useState('all') // 'all' | 'incoming' | 'outgoing'
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

  function toggleExpand(id) {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <>
      <main style={{ padding: '16px', paddingBottom: '80px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Search</h2>

        <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>Name / Beneficiary</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Ahmed, Rent…"
              style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '15px', outline: 'none' }}
            />
          </div>

          {/* Amount Range */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>Amount Range (SDG)</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="number"
                value={amountMin}
                onChange={e => setAmountMin(e.target.value)}
                placeholder="Min"
                min="0"
                style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', flex: 1 }}
              />
              <span style={{ color: '#aaa' }}>—</span>
              <input
                type="number"
                value={amountMax}
                onChange={e => setAmountMax(e.target.value)}
                placeholder="Max"
                min="0"
                style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', flex: 1 }}
              />
            </div>
          </div>

          {/* Date Range */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>Date Range</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', flex: 1 }}
              />
              <span style={{ color: '#aaa' }}>—</span>
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', flex: 1 }}
              />
            </div>
          </div>

          {/* Type */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>Type</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['all', 'incoming', 'outgoing'].map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setType(opt)}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                    cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                    background: type === opt
                      ? opt === 'incoming' ? '#2D6A4F' : opt === 'outgoing' ? '#9B2226' : '#111'
                      : '#f0f0f0',
                    color: type === opt ? 'white' : '#666',
                    transition: 'all 0.2s',
                  }}
                >
                  {opt === 'all' ? 'All' : opt === 'incoming' ? '↓ In' : '↑ Out'}
                </button>
              ))}
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            style={{
              padding: '14px', borderRadius: '12px', border: 'none',
              background: '#111', color: 'white', fontSize: '16px',
              fontWeight: '600', cursor: 'pointer', marginTop: '4px',
            }}
          >
            {loading ? 'Searching…' : 'Search'}
          </button>

        </form>

        {/* Results */}
        {searched && (
          <div style={{ marginTop: '28px' }}>
            <span style={{ fontSize: '13px', color: '#888' }}>
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </span>

            {results.length === 0 && (
              <p style={{ color: '#aaa', textAlign: 'center', marginTop: '40px' }}>No transactions found.</p>
            )}

            <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {results.map(tx => (
                <li
                  key={tx.id}
                  onClick={() => toggleExpand(tx.id)}
                  style={{
                    background: tx.is_outgoing ? 'rgba(155, 34, 38, 0.07)' : 'rgba(45, 106, 79, 0.07)',
                    borderLeft: `4px solid ${tx.is_outgoing ? '#E05C62' : '#52B788'}`,
                    borderRadius: '10px', padding: '14px', cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '15px' }}>{tx.name}</div>
                      <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{tx.date}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '700', fontSize: '15px', color: tx.is_outgoing ? '#E05C62' : '#2D6A4F' }}>
                        {tx.is_outgoing ? '−' : '+'}{formatAmount(tx.amount)} SDG 

                      </div>
                      <div style={{ fontSize: '11px', color: '#aaa' }}>{tx.is_outgoing ? 'Outgoing' : 'Incoming'}</div>
                    </div>
                  </div>

                  {expandedId === tx.id && (
                    <div style={{ marginTop: '12px', display: 'flex', gap: '10px' }} onClick={e => e.stopPropagation()}>
                      <a href={`/formPage/edit/${tx.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                        <button style={{
                          width: '100%', padding: '8px', borderRadius: '8px',
                          border: '1px solid #ccc', background: 'white',
                          cursor: 'pointer', fontSize: '13px',
                        }}>
                          ✏️ Edit
                        </button>
                      </a>
                      <button
                        onClick={() => handleDelete(tx.id)}
                        style={{
                          flex: 1, padding: '8px', borderRadius: '8px',
                          border: 'none', background: '#9B2226',
                          color: 'white', cursor: 'pointer', fontSize: '13px',
                        }}
                      >
                        🗑️ Delete
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