'use client'

import React, { useEffect, useState } from 'react'
import RemoveBtn from '@/components/RemoveBth' // 삭제 버튼 컴포넌트
import Link from 'next/link'
import { HiPencilAlt } from 'react-icons/hi'

interface Review {
  userId: string
  rating: number
  review: string
}

interface Sns {
  _id: string
  title: string
  description: string
  authorName: string
  createdAt: string
  updatedAt: string
  reviews: Review[] // 리뷰 배열 추가
}

export default function SnsList() {
  const [snsList, setSnsList] = useState<Sns[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSns() {
      try {
        const res = await fetch('/api/sns')
        if (!res.ok) {
          throw new Error('Failed to fetch SNS list')
        }
        const data = await res.json()
        setSnsList(data.sns) // API 응답에서 sns 배열 가져오기
      } catch (error) {
        console.error('Error loading SNS:', error)
        setError('Failed to load SNS')
      } finally {
        setLoading(false)
      }
    }
    fetchSns()
  }, [])

  if (loading) return <p>Loading SNS...</p>
  if (error) return <p>Error: {error}</p>
  if (!snsList || snsList.length === 0) return <p>No SNS found</p>

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <>
      {snsList.map((sns) => (
        <div
          key={sns._id}
          className="p-4 border border-slate-300 my-3 flex justify-between items-start gap-5"
        >
          <div>
            <h2 className="text-2xl font-bold">{sns.title}</h2>
            <div>{sns.description}</div>
            <div className="flex gap-4">
              <p>Author: {sns.authorName}</p>
              <p>Created: {formatDate(sns.createdAt)}</p>
              <p>Updated: {formatDate(sns.updatedAt)}</p>
            </div>
            {/* 리뷰 표시 */}
            {sns.reviews.length > 0 && (
              <div className="mt-2">
                <h3 className="font-semibold">Reviews:</h3>
                <ul>
                  {sns.reviews.map((review, index) => (
                    <li key={index}>
                      <strong>{review.userId}:</strong> {review.review} (Rating:{' '}
                      {review.rating})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <RemoveBtn id={sns._id} />
            <Link href={`/editSns/${sns._id}`}>
              <HiPencilAlt size={24} />
            </Link>
          </div>
        </div>
      ))}
    </>
  )
}
