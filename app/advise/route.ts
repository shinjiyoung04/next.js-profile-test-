// app/api/advices/route.ts
import { NextResponse } from 'next/server'
import dbConnect from '@/libs/dbConnet' // Ensure this utility exists
import Advice from '@/models/Advice' // Your Mongoose model

export async function GET() {
  await dbConnect() // Connect to MongoDB
  try {
    const advices = await Advice.find({})
    return NextResponse.json(advices) // Return the list of advices
  } catch (error) {
    console.error('Error fetching advices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch advices' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  await dbConnect() // Connect to MongoDB
  try {
    const body = await request.json() // Parse incoming JSON data
    const advice = new Advice(body) // Create a new advice instance
    await advice.save() // Save the advice to the database
    return NextResponse.json(advice, { status: 201 }) // Return the created advice
  } catch (error) {
    console.error('Error saving advice:', error)
    return NextResponse.json(
      { error: 'Failed to save advice' },
      { status: 400 }
    )
  }
}

// Additional methods (PUT, DELETE) can be added similarly if needed
