'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Nav from '../components/nav'
import Footer from '../components/footer'

export default function Statistics() {
  const [chartData, setChartData] = useState([])
  const [stats, setStats] = useState(null)
  const [showIncome, setShowIncome] = useState(true)
  const [showOutgoing, setShowOutgoing] = useState(true)



  async function fetchData() {
    const from = new Date()
    from.setDate(from.getDate() - 30)
    const fromStr = from.toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .gte('date', fromStr)
      .order('date', { ascending: true })

    if (error || !data) return

    // Build chart data grouped by date
    const grouped = {}
    data.forEach(tx => {
      if (!grouped[tx.date]) grouped[tx.date] = { date: tx.date, income: 0, outgoing: 0 }
      if (tx.is_outgoing) grouped[tx.date].outgoing += Number(tx.amount)
      else grouped[tx.date].income += Number(tx.amount)
    })
    setChartData(Object.values(grouped))

    // Stats
    const income = data.filter(tx => !tx.is_outgoing)
    const outgoing = data.filter(tx => tx.is_outgoing)
    const totalIncome = income.reduce((sum, tx) => sum + Number(tx.amount), 0)
    const totalExpenses = outgoing.reduce((sum, tx) => sum + Number(tx.amount), 0)
    const biggestIncome = income.reduce((max, tx) => Number(tx.amount) > Number(max?.amount || 0) ? tx : max, null)
    const biggestExpense = outgoing.reduce((max, tx) => Number(tx.amount) > Number(max?.amount || 0) ? tx : max, null)

    setStats({
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      biggestIncome,
      biggestExpense,
      incomeCount: income.length,
      expenseCount: outgoing.length,
    })
  }

    useEffect(() => {
    fetchData()
  }, [])

  return (
    <main style={{ paddingBottom: '80px', padding: '16px 16px 80px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Statistics — Last 30 Days</h2>

      {/* Chart */}
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#52B788" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#52B788" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOutgoing" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E05C62" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#E05C62" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={d => d.slice(5)} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip formatter={(value, name) => [`${value} SDG`, name === 'income' ? 'Income' : 'Outgoing']} />
            {showIncome && (
              <Area type="monotone" dataKey="income" stroke="#52B788" strokeWidth={2} fill="url(#colorIncome)" />
            )}
            {showOutgoing && (
              <Area type="monotone" dataKey="outgoing" stroke="#E05C62" strokeWidth={2} fill="url(#colorOutgoing)" />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend toggles */}
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '12px', marginBottom: '28px' }}>
        <button
          onClick={() => setShowIncome(!showIncome)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '20px', border: 'none',
            background: showIncome ? 'rgba(82, 183, 136, 0.15)' : '#f0f0f0',
            color: showIncome ? '#2D6A4F' : '#aaa',
            cursor: 'pointer', fontSize: '13px', fontWeight: '500',
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#52B788', display: 'inline-block' }} />
          Income
        </button>
        <button
          onClick={() => setShowOutgoing(!showOutgoing)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '20px', border: 'none',
            background: showOutgoing ? 'rgba(224, 92, 98, 0.15)' : '#f0f0f0',
            color: showOutgoing ? '#9B2226' : '#aaa',
            cursor: 'pointer', fontSize: '13px', fontWeight: '500',
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#E05C62', display: 'inline-block' }} />
          Outgoing
        </button>
      </div>

      {/* Stats Table */}
      {stats && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <tbody>
            {[
              { label: 'Total Income', value: `${stats.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SDG`, color: '#2D6A4F' },
              { label: 'Total Expenses', value: `${stats.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SDG`, color: '#9B2226' },
              { label: 'Net Balance', value: `${stats.netBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SDG`, color: stats.netBalance >= 0 ? '#2D6A4F' : '#9B2226' },
              { label: 'Transactions In', value: stats.incomeCount },
              { label: 'Transactions Out', value: stats.expenseCount },
              { label: 'Biggest Income', value: stats.biggestIncome ? `${stats.biggestIncome.name} — ${Number(stats.biggestIncome.amount).toLocaleString()} SDG` : '—', color: '#2D6A4F' },
              { label: 'Biggest Expense', value: stats.biggestExpense ? `${stats.biggestExpense.name} — ${Number(stats.biggestExpense.amount).toLocaleString()} SDG` : '—', color: '#9B2226' },
            ].map(({ label, value, color }) => (
              <tr key={label} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px 8px', color: '#666', fontWeight: '500' }}>{label}</td>
                <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600', color: color || '#111' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Footer />
      <Nav />
    </main>
  )
}