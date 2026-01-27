// import { FC, MouseEventHandler, useEffect, useRef, useState } from 'react';
// import { mutate } from 'swr';
// import useInput from '../../hooks/useInput';
// import useModal from '../../hooks/useModal';
// import usePopover from '../../hooks/usePopover';
// import { useBoardsContext } from '../../store/BoardListContext';
// import { Column, Subtask, Task } from '../../types';
// import { VerticalEllipsisIcon } from '../Icons/Icons';
// import { Checkbox, Dropdown } from '../Inputs/Inputs';
// import useSWR from 'swr';
// import { fetcher } from '../../utils/utils';
// import { LinkContainer, PopoverLink } from '../Popover/Popover';
// import TaskForm from './TaskForm';
// import Spinner from '../Spinner/Spinner';

// const SubtaskRow: FC<{
//     subtask: Subtask;
//     i: number;
//     setSubtaskStatus: (subtask: Subtask) => void;
//     disabled: boolean;
// }> = ({ subtask, i, setSubtaskStatus, disabled }) => {
//     const checkboxRef = useRef<HTMLInputElement>(null);
//     const [isChecked, setIsChecked] = useState(subtask.completed);

//     const subtaskClickHandler = async () => {
//         if (disabled) return;
//         const newValue = !isChecked;
//         setIsChecked(newValue);
//         setSubtaskStatus(subtask);
//     };

//     return (
//         <li
//             tabIndex={0}
//             data-testid="subtask"
//             key={subtask.uuid}
//             className={`mb-2 flex cursor-pointer items-center gap-4 rounded bg-light-grey p-3 transition-all  dark:bg-v-dark-grey  ${
//                 isChecked ? '' : 'hover:bg-primary hover:bg-opacity-25 dark:hover:bg-primary dark:hover:bg-opacity-25'
//             }`}
//             onClick={subtaskClickHandler}
//             onKeyDown={(e) => {
//                 if (e.key === 'Enter') {
//                     subtaskClickHandler();
//                 }
//             }}
//         >
//             <Checkbox
//                 className="pointer-events-none"
//                 ref={checkboxRef}
//                 checked={isChecked}
//                 id={`subtask-checkbox-${i + 1}`}
//             />
//             <span
//                 className={`text-xs font-medium text-black transition-all dark:text-white ${
//                     isChecked ? 'line-through opacity-50' : ''
//                 }`}
//             >
//                 {subtask.name}
//             </span>
//         </li>
//     );
// };

// const TaskDetails: FC<{ taskUUID: string; columns: Column[]; closeModal: Function }> = ({
//     taskUUID,
//     columns,
//     closeModal,
// }) => {
//     const { mutate: mutateTask, data: taskData } = useSWR<Task>(`/api/tasks/${taskUUID}`, fetcher, {});
//     const [subtaskUpdating, setSubtaskUpdating] = useState(false);
//     const { selectedBoard } = useBoardsContext();
//     const columnDropdown = useInput<string>({
//         initialValue: columns.find((col) => col.uuid === taskData?.column_uuid)?.name,
//     });

//     const { Component: OptionsPopover, ...optionsPopover } = usePopover();

//     const handleOptionsClick: MouseEventHandler<HTMLButtonElement> = (e) => {
//         optionsPopover.toggle(e);
//     };

//     const modalTitle = 'Delete this task?';
//     const modalMessage = `Are you sure you want to delete the ‘${taskData?.name}’ task? This action cannot be reversed.`;

//     const confirmDeleteHandler = async () => {
//         await fetch(`/api/tasks/${taskData!.uuid}`, {
//             method: 'DELETE',
//         });
//         closeModal();
//     };

//     const { Component: EditTaskModal, ...editTaskModal } = useModal();

//     const { Component: DeleteTaskModal, ...deleteTaskModal } = useModal({
//         type: 'danger',
//         dangerHeader: modalTitle,
//         dangerMessage: modalMessage,
//         onConfirmDelete: confirmDeleteHandler,
//     });

//     const taskDeleteHandler = () => {
//         optionsPopover.close();
//         deleteTaskModal.toggle();
//     };

//     const taskEditHandler = () => {
//         optionsPopover.close();
//         editTaskModal.toggle();
//     };

//     const statusChangeHandler = async (val: string) => {
//         const column = columns.find((col) => col.name === val);
//         if (column?.uuid && column.uuid !== taskData!.column_uuid) {
//             await fetch(`/api/tasks/${taskData!.uuid}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     column_uuid: column.uuid,
//                 }),
//             });
//             mutateTask({ ...taskData!, column_uuid: column.uuid });
//             mutate(`/api/boards/${selectedBoard?.uuid}`);
//         }
//     };

//     const subtaskChangeHandler = async (subtask: Subtask) => {
//         const newSubtasks = taskData!.subtasks.map((sub) => {
//             if (sub.uuid === subtask.uuid) {
//                 return { ...sub, completed: !sub.completed };
//             }
//             return sub;
//         });
//         setSubtaskUpdating(true);
//         const fetchPromise = fetch(`/api/subtasks/${subtask.uuid}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 completed: !subtask.completed,
//             }),
//         });
//         taskData!.subtasks = newSubtasks;
//         await fetchPromise;
//         setSubtaskUpdating(false);
//         mutateTask({ ...taskData!, subtasks: newSubtasks });
//         mutate(`/api/boards/${selectedBoard?.uuid}`);
//     };

//     const handleTaskUpdate = async (task: Task) => {
//         mutate(`/api/boards/${selectedBoard?.uuid}`);
//         mutateTask(task);
//         editTaskModal.close();
//     };

//     const completedTasks = taskData?.subtasks.filter((subtask) => subtask.completed).length;

//     useEffect(() => {
//         const col = columns.find((col) => col.uuid === taskData?.column_uuid);
//         if (col) columnDropdown.setValue(col.name);
//     }, [taskData?.column_uuid]);

//     return (
//         <div data-testid="task-details" className={deleteTaskModal.isOpen || editTaskModal.isOpen ? 'hidden' : ''}>
//             {taskData && !editTaskModal.isOpen ? (
//                 <>
//                     <div className="mb-6 flex items-center justify-between">
//                         <h2 data-testid="task-name" className="text-lg font-bold dark:text-white">
//                             {taskData.name}
//                         </h2>
//                         <button data-testid="task-options" className="h-5 pl-5" onClick={handleOptionsClick}>
//                             <VerticalEllipsisIcon className="pointer-events-none" />
//                         </button>
//                         <OptionsPopover
//                             className={`mt-8 ${window.innerWidth > 620 ? '-translate-x-24' : '-translate-x-44'}`}
//                         >
//                             <LinkContainer>
//                                 <PopoverLink id="task-edit" onClick={taskEditHandler}>
//                                     Edit Task
//                                 </PopoverLink>
//                                 <PopoverLink id="task-delete" onClick={taskDeleteHandler} danger>
//                                     Delete Task
//                                 </PopoverLink>
//                             </LinkContainer>
//                         </OptionsPopover>
//                         <DeleteTaskModal />
//                     </div>
//                     <p
//                         data-testid="task-description"
//                         className="mb-6 whitespace-pre-wrap text-sm font-medium leading-6 text-mid-grey"
//                     >
//                         {taskData.description}
//                     </p>
//                     {taskData.subtasks.length > 0 && (
//                         <span data-testid="subtasks-header" className="text-sm font-bold text-mid-grey dark:text-white">
//                             {`Subtasks (${completedTasks} of ${taskData.subtasks.length})`}
//                         </span>
//                     )}
//                     <ul className="mt-4 mb-6">
//                         {taskData.subtasks.map((subtask, i) => (
//                             <SubtaskRow
//                                 disabled={subtaskUpdating}
//                                 key={subtask.uuid}
//                                 subtask={subtask}
//                                 i={i}
//                                 setSubtaskStatus={subtaskChangeHandler}
//                             />
//                         ))}
//                     </ul>
//                     <label
//                         htmlFor="column-select"
//                         className="pointer-events-none text-sm font-bold text-mid-grey dark:text-white"
//                     >
//                         Current status
//                     </label>
//                     {
//                         <Dropdown
//                             className="mt-2"
//                             setValue={columnDropdown.setValue}
//                             value={columnDropdown.value}
//                             id="column-select"
//                             options={columns.map((col) => col.name)}
//                             onValueSelected={statusChangeHandler}
//                         />
//                     }
//                 </>
//             ) : (
//                 <div className="my-16 flex justify-center">
//                     <Spinner />
//                 </div>
//             )}
//             <EditTaskModal>
//                 <TaskForm
//                     formType="edit"
//                     taskData={taskData}
//                     closeModal={editTaskModal.close}
//                     columns={columns}
//                     onTaskUpdated={handleTaskUpdate}
//                 />
//             </EditTaskModal>
//         </div>
//     );
// };

// export default TaskDetails;

import { FC, MouseEventHandler, useEffect, useRef, useState } from 'react';
import { mutate } from 'swr';
import useInput from '../../hooks/useInput';
import usePopover from '../../hooks/usePopover';
import { useBoardsContext } from '../../store/BoardListContext';
import { Column, Subtask, Task } from '../../types';
import { VerticalEllipsisIcon } from '../Icons/Icons';
import { Checkbox, Dropdown } from '../Inputs/Inputs';

import useSWR from 'swr';
import { fetcher } from '../../utils/utils';
import { LinkContainer, PopoverLink } from '../Popover/Popover';
import TaskForm from './TaskForm';
import Spinner from '../Spinner/Spinner';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DrawerDescription } from '../ui/drawer';
import { MdAttachFile, MdDescription } from 'react-icons/md';
import {
  MoveUpRight,
  EditIcon,
  Ellipsis,
  MessageSquareIcon,
  MessageSquareMoreIcon,
} from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Editor, EditorTextChangeEvent } from 'primereact/editor';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandCheck,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/reui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const SubtaskRow: FC<{
  subtask: Subtask;
  i: number;
  setSubtaskStatus: (subtask: Subtask) => void;
  disabled: boolean;
}> = ({ subtask, i, setSubtaskStatus, disabled }) => {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const [isChecked, setIsChecked] = useState(subtask.completed);

  const subtaskClickHandler = async () => {
    if (disabled) return;
    const newValue = !isChecked;
    setIsChecked(newValue);
    setSubtaskStatus(subtask);
  };

  return (
    <li
      tabIndex={0}
      data-testid="subtask"
      key={subtask.uuid}
      className={`mb-2 flex cursor-pointer items-center gap-4 rounded bg-light-grey p-3 transition-all  dark:bg-v-dark-grey  ${
        isChecked
          ? ''
          : 'hover:bg-primary hover:bg-opacity-25 dark:hover:bg-primary dark:hover:bg-opacity-25'
      }`}
      onClick={subtaskClickHandler}
      onKeyDown={(e) => {
        if (e.key === 'Enter') subtaskClickHandler();
      }}
    >
      <Checkbox
        className="pointer-events-none"
        ref={checkboxRef}
        checked={isChecked}
        id={`subtask-checkbox-${i + 1}`}
      />
      <span
        className={`text-xs font-medium text-black transition-all dark:text-white ${
          isChecked ? 'line-through opacity-50' : ''
        }`}
      >
        {subtask.name}
      </span>
    </li>
  );
};

const TaskDetails: FC<{
  taskUUID: string;
  columns: Column[];
  closeModal: Function;
}> = ({ taskUUID, columns, closeModal }) => {
  const { mutate: mutateTask, data: taskData } = useSWR<Task>(
    `/api/tasks/${taskUUID}`,
    fetcher,
    {}
  );
  const [subtaskUpdating, setSubtaskUpdating] = useState(false);
  const { selectedBoard } = useBoardsContext();
  const columnDropdown = useInput<string>({
    initialValue: columns.find((col) => col.uuid === taskData?.column_uuid)
      ?.name,
  });
  const [text, setText] = useState<string>('');

  const { Component: OptionsPopover, ...optionsPopover } = usePopover();
  const handleOptionsClick: MouseEventHandler<HTMLButtonElement> = (e) =>
    optionsPopover.toggle(e);

  const modalTitle = 'Delete this task?';
  const modalMessage = `Are you sure you want to delete the '${taskData?.name}' task? This action cannot be reversed.`;

  const confirmDeleteHandler = async () => {
    await fetch(`/api/tasks/${taskData!.uuid}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    closeModal();
  };

  // State for dialogs
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [open, setOpen] = React.useState(false);

  const taskDeleteHandler = () => {
    optionsPopover.close();
    setIsDeleteDialogOpen(true);
  };

  const taskEditHandler = () => {
    optionsPopover.close();
    setIsEditDialogOpen(true);
  };

  const statusChangeHandler = async (val: string) => {
    const column = columns.find((col) => col.name === val);
    if (column?.uuid && column.uuid !== taskData!.column_uuid) {
      await fetch(`/api/tasks/${taskData!.uuid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ column_uuid: column.uuid }),
      });

      mutateTask({ ...taskData!, column_uuid: column.uuid });
      mutate(`/api/boards/${selectedBoard?.uuid}`);
    }
  };

  const subtaskChangeHandler = async (subtask: Subtask) => {
    const newSubtasks = taskData!.subtasks.map((sub) =>
      sub.uuid === subtask.uuid ? { ...sub, completed: !sub.completed } : sub
    );

    setSubtaskUpdating(true);

    await fetch(`/api/subtasks/${subtask.uuid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        completed: !subtask.completed,
      }),
    });

    setSubtaskUpdating(false);
    taskData!.subtasks = newSubtasks;
    mutateTask({ ...taskData!, subtasks: newSubtasks });
    mutate(`/api/boards/${selectedBoard?.uuid}`);
  };

  const handleTaskUpdate = async (task: Task) => {
    mutate(`/api/boards/${selectedBoard?.uuid}`);
    mutateTask(task);
    setIsEditDialogOpen(false);
  };

  const completedTasks = taskData?.subtasks.filter(
    (subtask) => subtask.completed
  ).length;

  useEffect(() => {
    const col = columns.find((col) => col.uuid === taskData?.column_uuid);
    if (col) columnDropdown.setValue(col.name);
  }, [taskData?.column_uuid]);

  return (
    <div data-testid="task-details" className="">
      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Make changes to your task here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <TaskForm
            formType="edit"
            taskData={taskData}
            closeModal={() => setIsEditDialogOpen(false)}
            columns={columns}
            onTaskUpdated={handleTaskUpdate}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Task Dialog */}
      {/* <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">{modalTitle}</DialogTitle>
            <DialogDescription>{modalMessage}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteHandler}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog> */}

      <Dialog open={true} onOpenChange={() => closeModal()}>
        <DialogContent className="max-h-[80%] h-[80%] md:min-w-[60rem] lg:min-w-[66rem] rounded-xl max-w-7xl overflow-hidden p-0 border-none bg-transparent shadow-none">
          <ResizablePanelGroup
            direction="horizontal"
            className="h-full w-full border-none"
          >
            <ResizablePanel>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel
                  defaultSize={30}
                  minSize={30}
                  maxSize={60}
                  className="flex h-32 items-start"
                >
                  <div className="h-full w-full flex-grow">
                    <img
                      className="h-full w-full object-cover "
                      src="https://i.pinimg.com/736x/5d/fe/8e/5dfe8e75553fe840d671ade101f4ce3f.jpg"
                      alt=""
                    />
                  </div>
                  <div className="absolute top-0 left-0  flex px-4 py-3 justify-between w-full  items-center">
                    <div className="">
                      {/* <Dropdown
                      className="p-0 w-32 z-50"
                      setValue={columnDropdown.setValue}
                      value={columnDropdown.value}
                      id="column-select"
                      options={columns.map((col) => col.name)}
                      onValueSelected={statusChangeHandler}
                    /> */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="btn">column</button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                          <DropdownMenuSeparator />

                          {columns.map((col) => (
                            <DropdownMenuItem
                              key={col.name}
                              onClick={() => statusChangeHandler(col.name)}
                            >
                              {col.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          onClick={handleOptionsClick}
                          variant="outline"
                          size={'icon'}
                          className=""
                        >
                          <VerticalEllipsisIcon className="pointer-events-none" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[250px] p-0">
                        <Command>
                          <CommandGroup onClick={taskEditHandler}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start font-normal px-2.5"
                            >
                              <Plus className="size-4" aria-hidden="true" />
                              Edit Task
                            </Button>
                          </CommandGroup>
                          <CommandSeparator />
                          <CommandGroup>
                            <Button
                              variant="destructive"
                              onClick={confirmDeleteHandler}
                              size="sm"
                              className="w-full justify-start font-normal px-2.5 cursor-pointer bg-red-500"
                            >
                              <Plus className="size-4" aria-hidden="true" />
                              Delete Task
                            </Button>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </ResizablePanel>
                <ResizableHandle className="bg-transparent border-none" />
                <ResizablePanel>
                  <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel
                      defaultSize={60}
                      className="dark:bg-neutral-900 overflow-hidden"
                    >
                      <ScrollArea className="h-full overflow-auto px-8 py-6 ">
                        {taskData && !isEditDialogOpen ? (
                          <>
                            <div className="mb-6 ">
                              <h2
                                data-testid="task-name"
                                className="text-2xl font-bold dark:text-white/70"
                              >
                                {taskData.name}
                              </h2>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                className="bg-transparent"
                              >
                                Add
                              </Button>
                              <Button
                                variant="outline"
                                className="bg-transparent"
                              >
                                Dates
                              </Button>
                              <Button
                                variant="outline"
                                className="bg-transparent"
                              >
                                Checklist
                              </Button>
                              <Button
                                variant="outline"
                                className="bg-transparent"
                              >
                                Attachment
                              </Button>
                              <Button
                                variant="outline"
                                className="bg-transparent"
                              >
                                Members
                              </Button>
                            </div>

                            <div className="flex justify-between items-start w-full mt-6 mb-2">
                              <div className="flex items-center gap-2">
                                <MdDescription />
                                <p className="font-bold dark:text-white/70">
                                  Description
                                </p>
                              </div>
                              <Button
                                onClick={taskEditHandler}
                                variant="outline"
                                className="bg-transparent"
                              >
                                <EditIcon /> Edit
                              </Button>
                            </div>
                            <div className=" text-white/70 rounded-md overflow-hidden">

                              <Editor
                                value={taskData.description}
                                onTextChange={(e: EditorTextChangeEvent) =>
                                  setText(e.htmlValue as string)
                                }
                                style={{
                                  height: '200px',
                                  borderRadius: '8px',
                                  border: 'none',
                                }}
                                className=""
                              />
                            </div>

                            <div className="flex justify-between items-start w-full mt-6 mb-2">
                              <div className="flex items-center gap-2">
                                <MdAttachFile />
                                <p className="font-bold dark:text-white/70">
                                  Attachments
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                className="bg-transparent"
                              >
                                Add
                              </Button>
                            </div>

                            <div className="space-y-4">
                              <p> Files</p>

                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                  <img
                                    className="h-12 w-16 rounded-md object-cover"
                                    src="https://i.pinimg.com/1200x/e0/d4/e3/e0d4e34e431614832360b167bff21946.jpg"
                                    alt=""
                                  />
                                  <div className="">
                                    <p>file name.png</p>
                                    <p>added sep 24, 2025, 8:44 PM</p>
                                  </div>
                                </div>
                                <div className="flex gap-2 justify-center items-center ">
                                  <MoveUpRight className="h-3 w-3 text-white/70" />
                                  <Button
                                    variant="secondary"
                                    className="px-2 bg-transparent text-white/70"
                                  >
                                    <Ellipsis />
                                  </Button>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                  <img
                                    className="h-12 w-16 rounded-md object-cover"
                                    src="https://i.pinimg.com/1200x/e0/d4/e3/e0d4e34e431614832360b167bff21946.jpg"
                                    alt=""
                                  />
                                  <div className="">
                                    <p>file name.png</p>
                                    <p>added sep 24, 2025, 8:44 PM</p>
                                  </div>
                                </div>
                                <div className="flex gap-2 justify-center items-center ">
                                  <MoveUpRight className="h-3 w-3 text-white/70" />
                                  <Button
                                    variant="secondary"
                                    className="px-2 bg-transparent text-white/70"
                                  >
                                    <Ellipsis />
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {taskData.subtasks.length > 0 && (
                              <span
                                data-testid="subtasks-header"
                                className="text-sm font-bold text-mid-grey dark:text-white"
                              >
                                {`Subtasks (${completedTasks} of ${taskData.subtasks.length})`}
                              </span>
                            )}
                            <ul className="mt-4 mb-6">
                              {taskData.subtasks.map((subtask, i) => (
                                <SubtaskRow
                                  disabled={subtaskUpdating}
                                  key={subtask.uuid}
                                  subtask={subtask}
                                  i={i}
                                  setSubtaskStatus={subtaskChangeHandler}
                                />
                              ))}
                            </ul>
                          </>
                        ) : (
                          <div className="my-16 flex justify-center">
                            <Spinner />
                          </div>
                        )}
                      </ScrollArea>
                    </ResizablePanel>
                    <ResizableHandle className="dark:bg-neutral-900" />
                    <ResizablePanel
                      defaultSize={40}
                      className="dark:bg-neutral-950"
                    >
                      <ScrollArea className="h-full overflow-auto px-4 py-6 ">
                        <div className="flex justify-between items-start w-full">
                          <span className="flex items-center gap-2">
                            {' '}
                            <MessageSquareMoreIcon className="text-white/70" />{' '}
                            <p className=" text-white/70 font-medium">
                              Comments and activity
                            </p>
                          </span>
                          <Button
                            variant="default"
                            className=" text-white bg-neutral-900"
                          >
                            Show details
                          </Button>
                        </div>
                      </ScrollArea>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskDetails;
