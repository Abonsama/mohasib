'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function SuccessToast() {
  const searchParams = useSearchParams()
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }, [searchParams])

  if (!showSuccess) return null

  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#2D6A4F',
      color: 'white',
      padding: '10px 22px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '600',
      zIndex: 999,
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      whiteSpace: 'nowrap',
    }}>
      ✓ Transaction saved
    </div>
  )
}