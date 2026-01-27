import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { BoardIcon } from '../Icons/Icons';
import type { Board } from '../../types';
import { useBoardsContext } from '../../store/BoardListContext';
import BoardForm from '../Modals/BoardForm';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from '../ui/animated-modal';
// import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AnimateIcon } from '../animate-ui/icons/icon';
import { SquareKanban } from '../animate-ui/icons/square-kanban';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';

// type BoardFormProps = {
//   onNewBoardCreated?: Function;
//   onBoardUpdated?: Function;
//   boardData?: Board;
//   formType: 'new' | 'edit';
//   onCancel?: () => void;
// };


const BoardLink: FC<{ board: Board }> = ({ board }) => {
  const router = useRouter();
  const isActive = router.query.boardId === board.uuid;
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
    
    <Card className="h-fit dark:bg-[#1e1e1f] bg-[#F9F9FA] w-48 p-0 overflow-hidden border-none shadow-md rounded-lg">
        <CardContent className="flex flex-col space-y-3 p-2 bg-transparent boder-none overflow-hidden h-full w-full ">
          <Image
            src={imageUrl}
            alt="Add Board"
            width={1000}
            height={1000}
            className="object-cover h-[6rem] w-full rounded-lg transition-transform duration-300 group-hover:scale-105"
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

const BoardList: FC<{ handleBoardSelect?: Function }> = ({
  handleBoardSelect,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { boards, isLoading } = useBoardsContext();
  const router = useRouter();
  const { mutateBoards } = useBoardsContext();

  const boardSelectHandler = () => {
    handleBoardSelect && handleBoardSelect();
    setDialogOpen(false);
  };

  // const handleNewBoardCreated = (newBoardUUID: string) => {
  //   mutateBoards();
  //   setDialogOpen(false);
  //   setShowForm(false);
  //   router.push(`/board/${newBoardUUID}`);
  //   handleBoardSelect && handleBoardSelect();
  // };

  return (
    <Modal open={dialogOpen} onOpenChange={(open) => {
      setDialogOpen(open);
      if (!open) setShowForm(false); // Reset to list view when closing
    }}>
      <AnimateIcon animateOnHover loop loopDelay={1000}> 
        <ModalTrigger className='!py-0 !px-0'>
          <Button variant="outline" className="rounded-lg dark:bg-[#1D1D1D] flex dark:border-neutral-800 items-center justify-center px-2 py-1 text-center">
            <SquareKanban /><p>Boards</p>
          </Button>
      </ModalTrigger>
      </AnimateIcon>
      <ModalBody className=" !max-w-[56%] !min-h-fit !h-[40%] !max-h-[76%] dark:bg-neutral-900 !w-[20%]">
        <div className="px-5 py-4 flex flex-col gap-2 text-center sm:text-left">
        <h1 className='text-lg leading-none font-semibold'>Select Board</h1>
        </div>
      <ModalContent className=" gap-4 !pt-3 !px-4 grid grid-cols-4">
          <>
                {boards?.map((board) => (
                  <div key={board.uuid} onClick={boardSelectHandler} className=" h-fit w-fit ">
                    <BoardLink board={board} />
                  </div>
                ))}
          </>
      </ModalContent>
      </ModalBody>
    </Modal>
  );
};

export default BoardList;