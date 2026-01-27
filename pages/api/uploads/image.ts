import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { s3 } from 'lib/aws-s3'
import { nanoid } from 'nanoid'
import { DEFAULT_TEST_USER, isTestMode } from '@/lib/test-user'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let session = await getServerSession(req, res, authOptions)
  
  if (isTestMode && !session) {
    session = { user: DEFAULT_TEST_USER }
  }

  if (!session?.user?.id) {
    return res.status(401).json({ success: 0, message: 'Unauthorized' })
  }

  if (req.method === 'POST') {
    try {
      // Handle file upload from Editor.js
      if (req.body.image) {
        // Base64 image upload
        const base64Data = req.body.image.replace(/^data:image\/\w+;base64,/, '')
        const buffer = Buffer.from(base64Data, 'base64')
        
        const key = `images/${nanoid()}.jpg`
        
        const uploadParams = {
          Bucket: process.env.AWS_S3_BUCKET!,
          Key: key,
          Body: buffer,
          ContentType: 'image/jpeg',
          ACL: 'public-read',
        }

        const result = await s3.upload(uploadParams).promise()
        
        return res.json({
          success: 1,
          file: {
            url: result.Location,
          }
        })
      }

      // Handle URL upload
      if (req.body.url) {
        return res.json({
          success: 1,
          file: {
            url: req.body.url,
          }
        })
      }

      res.status(400).json({ success: 0, message: 'No image provided' })
    } catch (error) {
      console.error('Image upload error:', error)
      res.status(500).json({ success: 0, message: 'Upload failed' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}