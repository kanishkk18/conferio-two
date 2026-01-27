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
      return await addMemberToTask(req, res, session);
    case 'DELETE':
      return await removeMemberFromTask(req, res, session);
    default:
      res.status(405).end('Method not allowed');
  }
}

const addMemberToTask = async (req: NextApiRequest, res: NextApiResponse, session: any) => {
  const { uuid } = req.query;
  const { userId } = req.body;

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

    // Check if user is a board member
    const boardMember = await prisma.boardMember.findFirst({
      where: {
        userId: userId,
        board: {
          columns: {
            some: {
              tasks: {
                some: {
                  uuid: uuid as string
                }
              }
            }
          }
        }
      }
    });

    if (!boardMember) {
      return res.status(400).json({ error: 'User is not a board member' });
    }

    const taskMember = await prisma.taskMember.create({
      data: {
        uuid: uuidv4(),
        task_uuid: uuid as string,
        userId: userId,
      },
      include: {
        user: {
          select: { name: true, image: true, email: true }
        }
      }
    });

    res.status(201).json(taskMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add member to task' });
  }
};

const removeMemberFromTask = async (req: NextApiRequest, res: NextApiResponse, session: any) => {
  const { uuid, memberId } = req.query;

  try {
    const taskMember = await prisma.taskMember.findFirst({
      where: {
        uuid: memberId as string,
        task: {
          userId: session.user.id,
        }
      },
    });

    if (!taskMember) {
      return res.status(404).json({ error: 'Task member not found' });
    }

    await prisma.taskMember.delete({
      where: { uuid: memberId as string },
    });

    res.status(200).json({ message: 'Member removed from task successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove member from task' });
  }
};