import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { DEFAULT_TEST_USER, isTestMode } from '@/lib/test-user'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let session = await getServerSession(req, res, authOptions)
  
  if (isTestMode && !session) {
    session = { user: DEFAULT_TEST_USER }
  }

  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'POST') {
    try {
      const { url } = req.body

      if (!url) {
        return res.status(400).json({ success: 0, message: 'URL is required' })
      }

      // Validate URL
      try {
        new URL(url)
      } catch {
        return res.status(400).json({ success: 0, message: 'Invalid URL' })
      }

      return res.json({
        success: 1,
        file: {
          url: url,
        }
      })
    } catch (error) {
      console.error('Image URL error:', error)
      res.status(500).json({ success: 0, message: 'Failed to process URL' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}