// import Logo from "./logo";
import { Button } from '@/components/ui/button';
import Search from './search';
import { Home } from 'lucide-react';
import Link from 'next/link';
// import { Input } from "@/components/ui/input";
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SidebarTrigger } from '../ui/sidebar';
import DynamicIslandDemo from '@/components/ui/DynamicIslandDemo';
import { Separator } from '@/components/ui/separator';
import UserComponent from '@/components/ui/comp-377';
import { TaskForm } from '@/components/tasks/task-form';
import { AnimateIcon } from '@/components/animate-ui/icons/icon';
import { CirclePlus } from '@/components/animate-ui/icons/circle-plus';
import Image from 'next/image';

export default function Header() {
  return (
    <div className="flex z-50 h-fit w-full right-0 p-1 items-center justify-between pl-2 pr-4">
       <div className="flex aspect-square size-8 ml-6 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <Image
                        src="https://res.cloudinary.com/kanishkkcloud18/image/upload/v1718475378/CONFERIO/gbkp0siuxyro0cgjq9rq.png"
                        alt="logo"
                        className="p-1 rounded-md h-8 w-8"
                        height={1000}
                        width={1000}
                      />
                    </div>

      <div className="flex !justify-end h-full gap-3 !items-end w-[40%] max-w-[40%]">
        <Link
          href="/maindashboard"
          className="bg-[#121212] p-2 rounded-full text-neutral-400"
        >
          <Home className="h-6 w-6 font-light " />
        </Link>
        <div className="w-[100%]">
          <Search />
        </div>
      </div>

      <div className="flex w-fit justify-center items-center gap-1">
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
        <Separator orientation="vertical" className="h-6 mr-1" />
        <DynamicIslandDemo />
        <Separator orientation="vertical" className="h-6 mr-1" />
        <UserComponent />
      </div>

    </div>
  );
}
