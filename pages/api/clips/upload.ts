// pages/api/clips/upload.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from 'lib/auth'
import { prisma } from '../../../lib/prisma'
import { s3 } from '../../../lib/aws-s3'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import formidable from 'formidable'
import fs from 'fs'

export const config = {
  api: {
    bodyParser: false,
  },
}

const parseForm = (req: NextApiRequest): Promise<{ fields: any; files: any }> => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: false,
      maxFileSize: 100 * 1024 * 1024, // 100MB
    })

    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      resolve({ fields, files })
    })
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    console.log('Starting file upload process...')
    
    const { fields, files } = await parseForm(req)
    const file = files.file?.[0]
    
    if (!file) {
      return res.status(400).json({ error: 'No file provided' })
    }

    const title = fields.title?.[0] || `Recording_${new Date().toISOString()}`
    const description = fields.description?.[0] || ''

    console.log('Processing file:', file.originalFilename)

    const fileId = uuidv4()
    const fileExtension = file.originalFilename?.split('.').pop() || 'webm'
    const fileName = `clips/${fileId}.${fileExtension}`

    // Read file buffer
    const fileBuffer = fs.readFileSync(file.filepath)

    console.log('Uploading to S3...')

    // Upload file to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: fileName,
      Body: fileBuffer,
      ContentType: file.mimetype || 'video/webm',
      ACL: 'public-read',
    })

    await s3.send(uploadCommand)

    const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`

    console.log('Creating database record...')

    // Create database record
    const clip = await prisma.clip.create({
      data: {
        title,
        description,
        fileName,
        fileUrl,
        fileSize: file.size,
        fileType: file.mimetype || 'video/webm',
        thumbnailUrl: null,
        userId: session.user.id,
        shareToken: uuidv4(),
      },
    })

    console.log('Clip created successfully:', clip.id)

    // Clean up temporary file
    fs.unlinkSync(file.filepath)

    res.status(200).json(clip)
  } catch (error) {
    console.error('Upload error:', error)
    
    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes('P2021') || error.message.includes('does not exist')) {
        return res.status(500).json({ 
          error: 'Database table not found. Please run database migrations.',
          details: 'Run: npx prisma migrate dev --name init'
        })
      }
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}