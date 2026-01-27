import { Search, Sparkles, ArrowUpCircle, Plus, Settings, FolderOpen, Bell, LayoutGrid, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import DynamicIslandDemo from "../ui/DynamicIslandDemo";
import { Separator } from "../ui/separator";
import { TaskForm } from "../tasks/task-form";
import UserComponent from "../ui/comp-377";
import { PlusIcon } from "../animate-ui/icons/plus";
import { AnimateIcon } from "../animate-ui/icons/icon";

export function Header() {
  return (
    <div className="h-11 w-full dark:bg-[#222222] flex items-center justify-between px-4">
      {/* Left side - Breadcrumb */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-sm">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground font-medium">Docs</span>
        </div>
      </div>

      {/* Center - Search */}
      <div className=" max-w-lg ">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search"
            className="w-full h-8 bg-secondary border-none rounded-md pl-9 pr-16 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">AI</span>
          </div>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center">
      
        <TaskForm>
          <AnimateIcon animateOnHover>
        <Button variant="ghost" className=" gap-1 !py-0 px-1 text-foreground">
          <PlusIcon className="w-4 h-4" />
          <span className="text-sm">New</span>
        </Button>
        </AnimateIcon>
        </TaskForm>
      <Separator orientation="vertical" className="h-6 mr-1"/>
      <DynamicIslandDemo />
      <Separator orientation="vertical" className="h-6 mr-2"/>
      <UserComponent />
      </div>
    </div>
  );
}

function FileText({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14,2 14,8 20,8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10,9 9,9 8,9"/>
    </svg>
  );
}
