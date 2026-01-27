import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'lib/prisma';
import { validate } from 'uuid';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'lib/auth';

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
      return await addLabelToTask(req, res, session);
    case 'DELETE':
      return await removeLabelFromTask(req, res, session);
    default:
      res.status(405).end('Method not allowed');
  }
}

const addLabelToTask = async (req: NextApiRequest, res: NextApiResponse, session: any) => {
  const { uuid } = req.query;
  const { labelId } = req.body;

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

    const label = await prisma.label.findFirst({
      where: {
        uuid: labelId,
        userId: session.user.id,
      },
    });

    if (!label) {
      return res.status(404).json({ error: 'Label not found' });
    }

    const updatedTask = await prisma.task.update({
      where: { uuid: uuid as string },
      data: {
        labels: {
          connect: { uuid: labelId }
        }
      },
      include: {
        labels: true
      }
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add label to task' });
  }
};

const removeLabelFromTask = async (req: NextApiRequest, res: NextApiResponse, session: any) => {
  const { uuid } = req.query;
  const { labelId } = req.body;

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

    const updatedTask = await prisma.task.update({
      where: { uuid: uuid as string },
      data: {
        labels: {
          disconnect: { uuid: labelId }
        }
      },
      include: {
        labels: true
      }
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove label from task' });
  }
};