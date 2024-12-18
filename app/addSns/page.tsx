'use client' // 브라우저에서 실행되는 클라이언트 컴포넌트임을 명시

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'

export default function AddSnsPage() {
  const { status, data: session } = useSession()
  const router = useRouter()

  // 상태 변수 정의
  const [title, setTitle] = useState('') // 책 제목
  const [author, setAuthor] = useState('') // 작가
  const [publisher, setPublisher] = useState('') // 출판사
  const [content, setContent] = useState('') // 내용

  useEffect(() => {
    // 세션이 없는 경우 로그인 페이지로 리다이렉트
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!title || !author || !publisher || !content) {
      alert('All fields are required')
      return
    }

    try {
      const res = await fetch('/api/sns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description: content,
          authorName: session?.user?.name || 'Anonymous', // 세션에서 사용자 이름 가져오기
          // rating과 review는 아예 포함하지 않음
        }),
      })

      if (res.ok) {
        alert('Topic successfully created!')
        setTitle('')
        setAuthor('')
        setPublisher('')
        setContent('')
        router.push('/addvice')
      } else {
        throw new Error('Failed to create a topic')
      }
    } catch (error) {
      console.error(error)
    }
  }

  // 세션 확인 중이면 로딩 메시지 표시
  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <div className="items-center px-10">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          className="border border-slate-700 p-4"
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border border-slate-700 p-4"
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          className="border border-slate-700 p-4"
          type="text"
          placeholder="Publisher"
          value={publisher}
          onChange={(e) => setPublisher(e.target.value)}
        />
        <textarea
          className="border border-slate-500 p-4 h-40"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          className="bg-green-800 text-white font-bold px-6 py-3 w-fit rounded-md"
          type="submit"
        >
          Add Advice
        </button>
      </form>
    </div>
  )
}
