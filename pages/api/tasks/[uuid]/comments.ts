import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'lib/prisma';
import { validate } from 'uuid';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'lib/auth';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).end('Unauthorized');
  }

  const { uuid } = req.query;

  if (!validate(uuid as string)) {
    return res.status(400).json({ error: 'Invalid task UUID' });
  }

  switch (req.method) {
    case 'GET':
      return await getComments(req, res, session);
    case 'POST':
      return await addComment(req, res, session);
    default:
      res.status(405).end('Method not allowed');
  }
}

const getComments = async (req: NextApiRequest, res: NextApiResponse, session: any) => {
  const { uuid } = req.query;

  try {
    const comments = await prisma.comment.findMany({
      where: {
        task_uuid: uuid as string,
      },
      include: {
        user: {
          select: { name: true, image: true, email: true }
        },
        commentAttachments: true
      },
      orderBy: { created_at: 'desc' }
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

const addComment = async (req: NextApiRequest, res: NextApiResponse, session: any) => {
  const { uuid } = req.query;
  const { content, attachments = [] } = req.body;

  try {
    const task = await prisma.task.findFirst({
      where: {
        uuid: uuid as string,
        userId: session.user.id,
      },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const comment = await prisma.comment.create({
      data: {
        uuid: uuidv4(),
        content,
        task_uuid: uuid as string,
        userId: session.user.id,
        commentAttachments: {
          create: attachments.map((attachment: any) => ({
            uuid: uuidv4(),
            name: attachment.name,
            url: attachment.url,
            type: attachment.type,
            size: attachment.size,
          }))
        }
      },
      include: {
        user: {
          select: { name: true, image: true, email: true }
        },
        commentAttachments: true
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};