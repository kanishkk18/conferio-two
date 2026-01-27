import { getSession, GetSessionParams } from 'next-auth/react';
// import Head from 'next/head';
import { useEffect, useState } from 'react';
import React, { FC } from 'react';
import { mutate } from 'swr';
import Board from '@/components/Board/Board';
import Layout from '@/components/Layout/Layout';
import TaskDetails from '@/components/Modals/TaskDetails';
import useModal from 'hooks/useModal';
import { useBoardsContext } from 'store/BoardListContext';
import Header from '@/components/Layout/Header/Header';
import SideBar from '@/components/ui/mainSideBar';
import { Clock, EditIcon } from 'lucide-react';
import { MdEmail } from 'react-icons/md';
import SearchInput from '@/components/ui/Search';
import UserAvatar from '@/components/ui/comp-377';
// import BoardNotify from '@/components/board-notification/index';
import BoardList from '@/components/BoardList/BoardList';
import Image from 'next/image';
import BoardForm from '@/components/Modals/BoardForm';
import { MagicCard } from '@/components/magicui/magic-card';
import { useTheme } from 'next-themes';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { AnimatedTooltip } from '@/components/ui/board-tooltip';
import CircularText from '@/components/ui/CircularTextLoader';
import DynamicIslandDemo from '@/components/ui/DynamicIslandDemo';
import { Separator } from '@/components/ui/separator';
import { AnimateIcon } from '@/components/animate-ui/icons/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskEmptyState from "@/components/tasks/task-empty-state";
import { UserTask } from "interfaces/task";
import { TaskList } from "@/components/tasks/task-list";
import  BoardsProvider  from "store/BoardListContext";
import { ScrollArea } from '@/components/ui/scroll-area';
import { LayoutDashboard } from '@/components/animate-ui/icons/layout-dashboard';
import { ListIcon } from '@/components/animate-ui/icons/list';

// import type { Board } from 'types';

// interface CircularProgressProps {
//   percentage: number;
//   size?: number;
//   strokeWidth?: number;
//   circleColor?: string;
//   progressColor?: string;
// }

const people = [
  {
    id: 1,
    name: 'John Doe',
    designation: 'Software Engineer',
    image:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80',
  },
  {
    id: 2,
    name: 'Robert Johnson',
    designation: 'Product Manager',
    image:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: 3,
    name: 'Jane Smith',
    designation: 'Data Scientist',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: 4,
    name: 'Emily Davis',
    designation: 'UX Designer',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: 5,
    name: 'Tyler Durden',
    designation: 'Soap Developer',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80',
  },
  {
    id: 6,
    name: 'Dora',
    designation: 'The Explorer',
    image:
      'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80',
  },
];

const BoardLink: FC<{ board }> = ({ board }) => {
  // const isActive = router.query.boardId === board.uuid;
  // const imageUrl = `https://picsum.photos/seed/${board.uuid}/400/200`;
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(
    'https://i.pinimg.com/1200x/46/f0/5c/46f05c604d64a25948b9ad15ba4ee35a.jpg'
  );

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(`/api/board-image?q=${board.name}`);
        const data = await res.json();
        if (data.imageUrl) {
          setImageUrl(data.imageUrl);
        }
      } catch (err) {
        console.error('Image fetch error:', err);
      }
    };

    fetchImage();
  }, [board.name]);

  return (
    <>
      <Card className="h-52 dark:bg-[#1e1e1f] bg-[#F9F9FA] w-64 p-0 overflow-hidden border-none shadow-md rounded-lg">
        <CardContent className="flex flex-col space-y-6 p-2 bg-transparent boder-none overflow-hidden h-full w-full ">
          <Image
            src={imageUrl}
            alt="Add Board"
            width={1000}
            height={1000}
            className="object-cover h-[8.5rem] w-full rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
          <div className=" flex space-x-2 justify-center items-center ">
            <Button
              onClick={(e) => router.push(`/board/${board.uuid}`)}
              variant="outline"
              size="sm"
              className="w-full hover:bg-neutral-900 text-white border-none bg-[#5C47CD]"
            >
              {board.name}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default function BoardPage({
  size = 130,
  strokeWidth = 5,
  circleColor = '#fff000',
  progressColor = '#4CD964',
  handleBoardSelect,
}) {
  const {
    selectedBoard,
    selectedTask,
    setSelectedTask,
    isLoading,
    boards,
    isValidating,
  } = useBoardsContext();
  const taskDetailsModal = useModal();
  const Modal = taskDetailsModal.Component;
  const { theme } = useTheme();
  // Compute percentage safely after selectedBoard is available
  const percentage =
    selectedBoard &&
    selectedBoard.columns &&
    selectedBoard.columns.length > 2 &&
    Array.isArray(selectedBoard.columns[2]?.tasks)
      ? selectedBoard.columns[2].tasks.length
      : 0;

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const { mutateBoards } = useBoardsContext();

  const boardSelectHandler = () => {
    handleBoardSelect && handleBoardSelect();
    setDialogOpen(false);
  };

  const handleNewBoardCreated = (newBoardUUID: string) => {
    mutateBoards();
    setDialogOpen(false);
    setShowForm(false);
    router.push(`/board/${newBoardUUID}`);
    handleBoardSelect && handleBoardSelect();
  };

  useEffect(() => {
    if (selectedTask) {
      taskDetailsModal.open();
    }
  }, [selectedTask, taskDetailsModal]);

  useEffect(() => {
    if (selectedBoard && !taskDetailsModal.isOpen) {
      setSelectedTask(null);
      mutate(`/api/boards/${selectedBoard.uuid}`);
    }
  }, [taskDetailsModal.isOpen]);


  return (
    <div className="flex overflow-hidden">
     
      <SideBar />
      <Layout>
        <Tabs
          defaultValue="account"
          className="w-full !overflow-hidden h-fit !py-0"
        > 
          <TabsContent value="account">
            <div className=" flex w-full justify-between items-center px-4 pt-4">
              <div className=" w-full flex-grow flex gap-4 justify-start items-center">
                <SearchInput />
                <BoardList />
                <AnimateIcon animateOnHover>
                <TabsList className="!px-0 !py-0">
                  <TabsTrigger value="account" className='rounded-r-none'><LayoutDashboard /></TabsTrigger>
                  <TabsTrigger value="password" className='rounded-l-none'><ListIcon /></TabsTrigger>
                </TabsList>
                </AnimateIcon>

                <div className="flex flex-row items-center justify-center w-fit">
                  <AnimatedTooltip items={people} />
                </div>
              </div>

              <div className="w-full flex flex-grow px-1 justify-end items-center">
                <div className="flex justify-center items-center gap-0">
                  <DynamicIslandDemo />
                  <Separator orientation="vertical" className="h-6 mr-1" />
                  <UserAvatar />
                </div>
              </div>
            </div>

            <div className="flex justify-start px-4 py-3 gap-4 items-start w-full h-full overflow-hidden">
              <main className="text-semibold bg-white/30 dark:bg-black/50 min-w-[60%] w-full max-w-[100%] box-shadow dark:shadow-none rounded-2xl m-0 min-h-[88vh] max-h-[89vh] px-4 py-6 text-center border-b border-r dark:border-[#262626] font-jakarta text-lg text-mid-grey">
                {selectedBoard ? (
                  <div className="">
                    <Header boardUUID={selectedBoard.uuid} />
                    <div className=" overflow-x-auto max-h-full h-[80vh] overflow-y-scroll thin-scrollbar">
                      <Board boardUUID={selectedBoard.uuid} />
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center ">
                    {isLoading || isValidating ? (
                      <div className="h-[89vh] flex items-center justify-center">
                        <CircularText
                          text="CONFERIO*CALLS*"
                          onHover="speedUp"
                          spinDuration={5}
                          className="custom-class"
                        />
                      </div>
                    ) : (
                      <div className="max-h-[95%] h-[95%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 px-4">
                        <Card className="h-52 dark:bg-[#1e1e1f] bg-[#F9F9FA] w-64 p-0 overflow-hidden border-none shadow-md rounded-lg">
                          <MagicCard
                            gradientColor={
                              theme === 'dark' ? '#1e1e1f' : '#D9D9D955'
                            }
                            className="p-0 bg-transparent h-full"
                          >
                            <CardContent className="flex flex-col space-y-6 p-2 bg-transparent boder-none overflow-hidden h-full w-full ">
                              <Image
                                src="https://i.pinimg.com/1200x/f2/be/85/f2be854e748d3557367ebd2eaebfafee.jpg"
                                alt="Add Board"
                                width={1000}
                                height={1000}
                                className="object-cover h-[8.5rem] w-full rounded-lg transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className=" flex space-x-2 justify-center items-center ">
                                <Dialog
                                  open={dialogOpen}
                                  onOpenChange={(open) => {
                                    setDialogOpen(open);
                                    if (!open) setShowForm(false);
                                  }}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="default"
                                      size="sm"
                                      className="w-full hover:bg-[#5C47CD] text-white bg-[#5C47CD]"
                                    >
                                      Create Board
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="min-w-5xl">
                                    <DialogHeader>
                                      <DialogTitle>Create Board</DialogTitle>
                                    </DialogHeader>
                                    <BoardForm
                                      formType="new"
                                      onNewBoardCreated={handleNewBoardCreated}
                                    />
                                    <Button
                                      variant="outline"
                                      onClick={() => setShowForm(false)}
                                      className=""
                                    >
                                      Cancel
                                    </Button>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </CardContent>
                          </MagicCard>
                        </Card>

                        {boards?.map((board) => (
                          <div key={board.uuid} onClick={boardSelectHandler}>
                            <BoardLink board={board} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {/* <Modal> */}
                {selectedBoard && selectedTask && (
                  <TaskDetails
                    closeModal={taskDetailsModal.close}
                    taskUUID={selectedTask}
                    columns={selectedBoard.columns}
                  />
                )}
              </main>

              {selectedBoard && (
                <div className="space-y-4 h-[100%] max-h-full">
                  <Card className=" w-72 p-4 max-h-full h-[66.1svh] dark:bg-black/50 dark:border-t border rounded-2xl box-shadow dark:shadow-none">
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2 bg-muted/90 p-4 rounded-2xl">
                        <h3 className="font-semibold capitalize ">
                          {selectedBoard?.name}
                        </h3>
                        <span className="text-xs font-medium bg-orange-100 text-orange-600 px-2 py-1 rounded">
                          SELECTED
                        </span>
                      </div>
                    </div>
                    <div className="relative flex justify-center items-center  py-2 w-38 h-fit mx-auto">
                      <div
                        className="relative flex items-center justify-center"
                        style={{ width: size, height: size }}
                      >
                        <svg
                          width={size}
                          height={size}
                          viewBox={`0 0 ${size} ${size}`}
                          className="transform -rotate-90"
                        >
                          <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="transparent"
                            stroke={circleColor}
                            strokeWidth={strokeWidth}
                          />
                          <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="transparent"
                            stroke={progressColor}
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center dark:text-white font-bold">
                          {percentage}%
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <h1 className="font-semibold text-[18px] capitalize">
                        {selectedBoard?.name}
                      </h1>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded-xl">
                        <div className="text-sm text-gray-600">Total</div>
                        <div className="text-xl dark:text-black font-semibold">
                          {selectedBoard?.columns.length}
                        </div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-xl">
                        <div className="text-sm text-gray-600">
                          {selectedBoard?.columns &&
                          selectedBoard.columns.length > 0
                            ? selectedBoard.columns[0].name
                            : 'No columns'}
                        </div>
                        <div className="text-xl dark:text-black font-semibold">
                          {selectedBoard?.columns &&
                          selectedBoard.columns.length > 0
                            ? (selectedBoard.columns[0]?.tasks?.length ?? 0)
                            : 0}
                        </div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-xl">
                        <div className="text-sm text-gray-600">
                          {' '}
                          {selectedBoard?.columns &&
                          selectedBoard.columns.length > 1
                            ? selectedBoard.columns[1].name
                            : 'No columns'}
                        </div>
                        <div className="text-xl dark:text-black font-semibold">
                          {selectedBoard?.columns[1]?.tasks?.length || '0'}
                        </div>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-xl">
                        <div className="text-sm text-gray-600">
                          {' '}
                          {selectedBoard?.columns &&
                          selectedBoard.columns.length > 2
                            ? selectedBoard.columns[2].name
                            : 'No columns'}
                        </div>
                        <div className="text-xl dark:text-black font-semibold">
                          0
                        </div>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 max-h-full space-y-4 border-none rounded-2xl box-shadow dark:shadow-none">
                    <div className="flex gap-3 justify-start items-center">
                      <Clock className="text-white p-2 h-9 w-9 bg-purple-400 rounded-sm" />
                      <div className="mr-10">
                        <p className="text-sm font-semibold text-neutral-500">
                          {selectedBoard?.created_at
                            ? new Date(selectedBoard.created_at)
                                .toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  day: '2-digit',
                                  month: 'long',
                                })
                                .toLowerCase()
                            : ''}
                        </p>
                        <p className="text-md font-semibold">
                          {selectedBoard?.created_at
                            ? new Date(
                                selectedBoard.created_at
                              ).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              })
                            : ''}
                        </p>
                      </div>
                      <EditIcon className="h-5 w-5" />
                    </div>
                    <hr />
                    <div className="flex gap-3 justify-start items-center">
                      <MdEmail className="text-white p-2 h-9 w-9 bg-blue-500 rounded-sm" />
                      <div className="mr-10">
                        <p className="text-sm font-semibold text-neutral-500">
                          {selectedBoard?.updated_at
                            ? new Date(selectedBoard.updated_at)
                                .toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  day: '2-digit',
                                  month: 'long',
                                })
                                .toLowerCase()
                            : ''}
                        </p>
                        <p className="text-md font-semibold">
                          {selectedBoard?.updated_at
                            ? new Date(
                                selectedBoard.updated_at
                              ).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              })
                            : ''}
                        </p>
                      </div>
                      <EditIcon className="h-5 w-5" />
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="password" className='px-0 py-0 !overflow-y-hidden'>
            <ScrollArea className="h-full !overflow-y-scroll">
            <BoardListView/>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </Layout>
    </div>
  );
}

 function BoardListView() {
  const [task, setTask] = useState<UserTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/tasks", { 
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();
        
        // Transform the API response to match UserTask type
        const transformedTasks = data.map((task: any) => ({
          id: task.uuid || task.id,
          title: task.name,
          description: task.description,
          priority: task.priority || 'medium',
          dueTime: task.due_date || task.createdAt,
          createdAt: task.created_at || task.createdAt,
          itsDone: task.completed || task.itsDone || false,
          category: task.category || { 
            name: task.column?.name || 'No Category',
            color: task.column?.color,
            icon: task.column?.icon
          }
        }));
        
        setTask(transformedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
      setIsLoading(false);
    };

    const verifyUser = async () => {
      try {
        const response = await fetch("/api/auth/services-signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("Failed to verify user");
        }
      } catch (error) {
        console.error("Error verifying user:", error);
      }
    };

    fetchTasks();
    verifyUser();
  }, []);

  const handleTaskUpdate = (updatedTask: UserTask) => {
    setTask(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const handleTaskDelete = (taskId: string) => {
    setTask(prevTasks => 
      prevTasks.filter(task => task.id !== taskId)
    );
  };

  return (
    <BoardsProvider>
      <div>
        {isLoading ? (
          <div className="h-screen flex items-center justify-center">
            <CircularText
              text="CONFERIO*CALLS*"
              onHover="speedUp"
              spinDuration={5}
              className="custom-class"
            />
          </div>
        ) : task.length > 0 ? (
          <TaskList 
            task={task as any} 
            setTask={setTask as any} 
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
          />
        ) : (
          <TaskEmptyState />
        )}
      </div>
    </BoardsProvider>
  );
}

export async function getServerSideProps(context: GetSessionParams) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
