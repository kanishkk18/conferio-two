import React from 'react';
import UserAvatar from '@/components/ui/comp-377';
import DashboardHeader from './overviewHeader';
import { ThemeToggle } from './ThemeToggle';
import DynamicIslandDemo from './DynamicIslandDemo';
import { Separator } from './separator';
import { TaskForm } from '../tasks/task-form';
import { AnimateIcon } from '../animate-ui/icons/icon';
import { Button } from './button';
import { CirclePlus } from '../animate-ui/icons/circle-plus';

const Navigation: React.FC = () => {
  return (
    <div className="flex items-center px-3 justify-between py-0 h-fit bg-[#f3f2f2] dark:bg-[#222222]">
      <div className="flex items-center justify-start">
        <DashboardHeader name="" />
      </div>

      <div className="flex items-center justify-between gap-0">
        <TaskForm>
          <AnimateIcon animateOnHover>
            <Button
              variant="ghost"
              className=" px-1.5 !py-1.5 h-fit rounded-md flex justify-center items-center text-center"
            >
              <CirclePlus />
              <p>New</p>
            </Button>
          </AnimateIcon>
        </TaskForm>
        <Separator orientation="vertical" className="h-6 mr-2" />
        <DynamicIslandDemo />
        <Separator orientation="vertical" className="h-6 mr-2" />
        <UserAvatar />
      </div>
    </div>
  );
};

export default Navigation;
