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
  const [publisher, setPublisher] = useState('') // 출처 필드 추가
  const [content, setContent] = useState('')
  const [advices, setAdvices] = useState<Advice[]>([])
  const [editingId, setEditingId] = useState<string | null>(null) // 수정할 ID 저장
  const [loading, setLoading] = useState(false) // 로딩 상태 관리
  const [error, setError] = useState<string | null>(null) // 에러 상태 관리

  useEffect(() => {
    fetchAdvices()
  }, [])

  const fetchAdvices = async () => {
    setLoading(true)
    setError(null) // 이전 에러 초기화
    try {
      const response = await fetch('/api/advices')
      if (!response.ok) {
        throw new Error('Failed to fetch advices')
      }
      const data = await response.json()
      setAdvices(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newAdvice = {
      id: editingId ? editingId : Date.now().toString(), // 수정 시 기존 ID 사용
      title,
      author,
      publisher,
      content,
      createdAt: new Date(),
    }

    try {
      const response = await fetch('/api/advices', {
        method: editingId ? 'PUT' : 'POST', // 수정 시 PUT 요청 사용
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAdvice),
      })

      if (!response.ok) {
        throw new Error('Failed to save advice')
      }

      // 폼 초기화
      setTitle('')
      setAuthor('')
      setPublisher('') // 출처 초기화
      setContent('')
      setEditingId(null) // 수정 모드 종료

      // 새로 고침하여 리스트 업데이트
      fetchAdvices()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (advice: Advice) => {
    setEditingId(advice.id) // 수정할 ID 설정
    setTitle(advice.title)
    setAuthor(advice.author)
    setPublisher(advice.publisher) // 출처 설정
    setContent(advice.content)
  }

  const handleDelete = async (id: string) => {
    if (confirm('정말로 이 어드바이스를 삭제하시겠습니까?')) { // 삭제 확인 메시지 추가
      try {
        const response = await fetch(`/api/advices/${id}`, {
          method: 'DELETE',
        })
        
        if (!response.ok) {
          throw new Error('Failed to delete advice')
        }

        fetchAdvices() // 리스트 업데이트
      } catch (err) {
        setError(err.message)
      }
    }
  }

  if (!session) {
    return <p>로그인이 필요합니다.</p>
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>어드바이스 공유</h1>
      
      {loading && <p>로딩 중...</p>} {/* 로딩 상태 표시 */}
      
      {error && <p className={styles.error}>{error}</p>} {/* 에러 메시지 표시 */}

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
          <label htmlFor="publisher">출처:</label> {/* 출처 입력 필드 추가 */}
          <input
            type="text"
            id="publisher"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
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
          {editingId ? '수정' : '제출'}
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
              {advice.publisher && <p>출처: {advice.publisher}</p>} {/* 출처 표시 */}
              <p>{advice.content}</p>
              <button onClick={() => handleEdit(advice)} className={styles.editButton}>
                수정
              </button>
              <button onClick={() => handleDelete(advice.id)} className={styles.deleteButton}>
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
