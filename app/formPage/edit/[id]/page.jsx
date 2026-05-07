'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../../lib/supabase'
import Nav from '../../../components/nav'

export default function EditTransaction() {
  const { id } = useParams()
  const router = useRouter()
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [isOutgoing, setIsOutgoing] = useState(false)
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchTransaction() {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        setError('Transaction not found')
        setFetching(false)
        return
      }

      setName(data.name)
      setAmount(data.amount)
      setIsOutgoing(data.is_outgoing)
      setDate(data.date)
      setFetching(false)
    }
    fetchTransaction()
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return setError('Please enter a name')
    if (!amount) return setError('Please enter an amount')

    setLoading(true)
    setError('')

    const { error: err } = await supabase
      .from('transactions')
      .update({
        name: name.trim(),
        amount: parseFloat(amount),
        is_outgoing: isOutgoing,
        date: date,
      })
      .eq('id', id)

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    router.push('/?success=true')
  }

  if (fetching) return <p style={{ padding: '16px' }}>Loading…</p>

  return (
    <>
      <main style={{ padding: '16px', paddingBottom: '80px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>Edit Transaction</h2>

        {error && (
          <div style={{
            background: 'rgba(155, 34, 38, 0.1)',
            border: '1px solid #E05C62',
            borderRadius: '8px',
            padding: '10px 14px',
            color: '#9B2226',
            marginBottom: '16px',
            fontSize: '13px',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>Name / Beneficiary</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Ahmed, Rent, Salary…"
              style={{
                padding: '12px', borderRadius: '10px',
                border: '1px solid #ddd', fontSize: '15px',
                outline: 'none', width: '100%',
              }}
            />
          </div>

          {/* Amount */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>Amount</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                style={{
                  padding: '12px', borderRadius: '10px',
                  border: '1px solid #ddd', fontSize: '15px',
                  outline: 'none', flex: 1,
                }}
              />
              <span style={{ fontWeight: '600', color: '#888', fontSize: '14px' }}>SDG</span>
            </div>
          </div>

          {/* Date */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{
                padding: '12px', borderRadius: '10px',
                border: '1px solid #ddd', fontSize: '15px',
                outline: 'none', width: '100%',
              }}
            />
          </div>

          {/* Outgoing toggle */}
          <div
            onClick={() => setIsOutgoing(!isOutgoing)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px', borderRadius: '10px', cursor: 'pointer',
              background: isOutgoing ? 'rgba(155, 34, 38, 0.07)' : 'rgba(45, 106, 79, 0.07)',
              border: `1px solid ${isOutgoing ? '#E05C62' : '#52B788'}`,
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontWeight: '600', fontSize: '14px', color: isOutgoing ? '#9B2226' : '#2D6A4F' }}>
              {isOutgoing ? '↑ Outgoing' : '↓ Incoming'}
            </span>
            <div style={{
              width: '44px', height: '24px', borderRadius: '12px',
              background: isOutgoing ? '#E05C62' : '#52B788',
              position: 'relative', transition: 'background 0.2s',
            }}>
              <div style={{
                position: 'absolute', top: '2px',
                left: isOutgoing ? '22px' : '2px',
                width: '20px', height: '20px',
                borderRadius: '50%', background: 'white',
                transition: 'left 0.2s',
              }} />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px', borderRadius: '12px', border: 'none',
              background: '#2D6A4F', color: 'white', fontSize: '16px',
              fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, marginTop: '8px',
            }}
          >
            {loading ? 'Saving…' : 'Save Changes'}
          </button>

        </form>
      </main>
      <Nav />
    </>
  )
}