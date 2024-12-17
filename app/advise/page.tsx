'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect, FormEvent } from 'react'
import styles from '@/advise.module.css'

interface Advice {
  id: string
  title: string
  author: string
  publisher: string
  content: string
}

export default function AdviceShare() {
  const { data: session } = useSession()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [publisher, setPublisher] = useState('')
  const [content, setContent] = useState('')
  const [advices, setAdvices] = useState<Advice[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAdvices()
  }, [])

  const fetchAdvices = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/advices')
      if (!response.ok) {
        throw new Error('Failed to fetch advices')
      }
      const data = await response.json()
      setAdvices(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newAdvice = {
      id: editingId ? editingId : Date.now().toString(),
      title,
      author,
      publisher,
      content,
    }

    try {
      const response = await fetch('/api/advices', {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAdvice),
      })

      if (!response.ok) {
        throw new Error('Failed to save advice')
      }

      // Reset form fields
      setTitle('')
      setAuthor('')
      setPublisher('')
      setContent('')
      setEditingId(null)

      // Refresh advice list
      fetchAdvices()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    }
  }

  // Edit and delete functions remain unchanged...

  if (!session) {
    return <p>로그인이 필요합니다.</p>
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>어드바이스 공유</h1>

      {loading && <p>로딩 중...</p>}

      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Form fields remain unchanged */}
        <button type="submit" className={styles.submitButton}>
          {editingId ? '수정' : '제출'}
        </button>
      </form>

      <h2>어드바이스 리스트</h2>
      {advices.length === 0 ? (
        <p>작성된 어드바이스가 없습니다.</p>
      ) : (
        <ul className={styles.adviceList}>
          {/* Rendering advice items remains unchanged */}
        </ul>
      )}
    </div>
  )
}
