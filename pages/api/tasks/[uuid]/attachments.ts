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
    case 'POST':
      return await addAttachment(req, res, session);
    case 'DELETE':
      return await deleteAttachment(req, res, session);
    default:
      res.status(405).end('Method not allowed');
  }
}

const addAttachment = async (req: NextApiRequest, res: NextApiResponse, session: any) => {
  const { uuid } = req.query;
  const { name, url, type, size } = req.body;

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

    const attachment = await prisma.attachment.create({
      data: {
        uuid: uuidv4(),
        name,
        url,
        type,
        size,
        task_uuid: uuid as string,
        userId: session.user.id,
      },
    });

    res.status(201).json(attachment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add attachment' });
  }
};

const deleteAttachment = async (req: NextApiRequest, res: NextApiResponse, session: any) => {
  const { uuid, attachmentId } = req.query;

  try {
    const attachment = await prisma.attachment.findFirst({
      where: {
        uuid: attachmentId as string,
        userId: session.user.id,
      },
    });

    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }

    await prisma.attachment.delete({
      where: { uuid: attachmentId as string },
    });

    res.status(200).json({ message: 'Attachment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete attachment' });
  }
};