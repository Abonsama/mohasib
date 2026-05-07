'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { formatAmount } from '../../lib/format'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
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

    const grouped = {}
    data.forEach(tx => {
      if (!grouped[tx.date]) grouped[tx.date] = { date: tx.date, income: 0, outgoing: 0 }
      if (tx.is_outgoing) grouped[tx.date].outgoing += Number(tx.amount)
      else grouped[tx.date].income += Number(tx.amount)
    })
    setChartData(Object.values(grouped))

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

  const statRows = stats ? [
    { label: 'Total Income', value: `${formatAmount(stats.totalIncome)} SDG`, color: '#2D6A4F' },
    { label: 'Total Expenses', value: `${formatAmount(stats.totalExpenses)} SDG`, color: '#9B2226' },
    {
      label: 'Net Balance',
      value: `${formatAmount(stats.netBalance)} SDG`,
      color: stats.netBalance >= 0 ? '#2D6A4F' : '#9B2226'
    },
    { label: 'Transactions In', value: stats.incomeCount, color: '#2D6A4F' },
    { label: 'Transactions Out', value: stats.expenseCount, color: '#9B2226' },
    {
      label: 'Biggest Income',
      value: stats.biggestIncome
        ? `${stats.biggestIncome.name} — ${formatAmount(stats.biggestIncome.amount)} SDG`
        : '—',
      color: '#2D6A4F'
    },
    {
      label: 'Biggest Expense',
      value: stats.biggestExpense
        ? `${stats.biggestExpense.name} — ${formatAmount(stats.biggestExpense.amount)} SDG`
        : '—',
      color: '#9B2226'
    },
  ] : []

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
          Statistics — Last 30 Days
        </h2>

        {/* Chart Card */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '20px',
          marginBottom: '12px',
        }}>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#52B788" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#52B788" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOutgoing" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E05C62" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#E05C62" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                tickFormatter={d => d.slice(5)}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                }}
                formatter={(value, name) => [
                  `${formatAmount(value)} SDG`,
                  name === 'income' ? 'Income' : 'Outgoing'
                ]}
              />
              {showIncome && (
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#52B788"
                  strokeWidth={2}
                  fill="url(#colorIncome)"
                  dot={false}
                  activeDot={{ r: 4, fill: '#52B788' }}
                />
              )}
              {showOutgoing && (
                <Area
                  type="monotone"
                  dataKey="outgoing"
                  stroke="#E05C62"
                  strokeWidth={2}
                  fill="url(#colorOutgoing)"
                  dot={false}
                  activeDot={{ r: 4, fill: '#E05C62' }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>

          {/* Legend Toggles */}
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            marginTop: '16px',
          }}>
            {[
              { key: 'income', label: 'Income', color: '#52B788', active: showIncome, toggle: () => setShowIncome(!showIncome) },
              { key: 'outgoing', label: 'Outgoing', color: '#E05C62', active: showOutgoing, toggle: () => setShowOutgoing(!showOutgoing) },
            ].map(item => (
              <button
                key={item.key}
                onClick={item.toggle}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  border: `1px solid ${item.active ? item.color : 'var(--border)'}`,
                  background: item.active ? `${item.color}18` : 'transparent',
                  color: item.active ? item.color : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: item.active ? item.color : 'var(--border)',
                  display: 'inline-block',
                  transition: 'background 0.2s',
                }} />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Table */}
        {stats && (
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            marginTop: '16px',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {statRows.map(({ label, value, color }, i) => (
                  <tr
                    key={label}
                    style={{
                      borderBottom: i < statRows.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    <td style={{
                      padding: '14px 16px',
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      fontWeight: '500',
                    }}>
                      {label}
                    </td>
                    <td style={{
                      padding: '14px 16px',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: color || 'var(--text-primary)',
                      textAlign: 'right',
                    }}>
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Footer />
      </main>
      <Nav />
    </>
  )
}