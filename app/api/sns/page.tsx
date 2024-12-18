import { NextRequest, NextResponse } from 'next/server'
import connectMongoDB from '@/libs/mongodb'
import Sns from '@/models/advice'

// POST - 새로운 sns 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received body:', body) // 받은 데이터 로깅

    const { title, description, authorName, rating, review } = body

    if (
      !title ||
      !description ||
      !authorName ||
      rating === undefined ||
      !review
    ) {
      console.log('Missing required fields') // 누락된 필드 로깅
      return NextResponse.json(
        {
          message:
            'Title, description, authorName, rating, and review are required',
        },
        { status: 400 }
      )
    }

    await connectMongoDB()
    console.log('Connected to MongoDB') // MongoDB 연결 확인

    const newSns = await Sns.create({
      title,
      description,
      authorName,
      reviews: [{ userId: authorName, rating, review }], // 리뷰 배열에 추가
    })
    console.log('New sns created:', newSns) // 생성된 데이터 로깅

    return NextResponse.json(
      { message: 'Sns created', sns: newSns },
      { status: 201 }
    )
  // ... existing code ...
} catch (error: any) {  // error 타입을 any로 지정
  console.error('Error in POST /api/sns', error)
  return NextResponse.json(
    { message: 'Internal server error', error: error.message },
    { status: 500 }
  )
}
}