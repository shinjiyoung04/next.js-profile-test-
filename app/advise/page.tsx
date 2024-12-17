'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect, FormEvent } from 'react'
import styles from '@/AdviceShare.module.css'

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

  useEffect(() => {
    fetchAdvices()
  }, [])

  const fetchAdvices = async () => {
    const response = await fetch('/api/advices')
    const data = await response.json()
    setAdvices(data)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newAdvice = {
      id: Date.now().toString(), // 또는 UUID 사용
      title,
      author,
      publisher,
      content,
      createdAt: new Date(),
    }

    await fetch('/api/advices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAdvice),
    })

    // 폼 초기화
    setTitle('')
    setAuthor('')
    setPublisher('')
    setContent('')

    // 새로 고침하여 리스트 업데이트
    fetchAdvices()
  }

  if (!session) {
    return <p>로그인이 필요합니다.</p>
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>어드바이스 공유</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="author">작성자:</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="content">어드바이스:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="어드바이스를 작성하세요"
            required
            className={styles.textarea}
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          제출
        </button>
      </form>

      <h2>어드바이스 리스트</h2>
      {advices.length === 0 ? (
        <p>작성된 어드바이스가 없습니다.</p>
      ) : (
        <ul className={styles.adviceList}>
          {advices.map((advice) => (
            <li key={advice.id} className={styles.adviceItem}>
              <h3>작성자: {advice.author}</h3>
              <p>{advice.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
