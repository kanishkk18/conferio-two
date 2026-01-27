import { Search, ChevronDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContentHeader() {
  return (
    <div className="flex dark:bg-[#111111] items-center justify-between px-4 py-2 border-b dark:border-[#1C1C1C]">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-sm">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground font-medium">Docs</span>
        </div>
      </div>

      <div className="flex justify-center items-center gap-2">
        <Button variant="outline" size="sm" className="gap-1 bg-transparent dark:border-[#262626] text-foreground hover:bg-muted rounded-lg">
          <Search className="w-3.5 h-3.5" />
          <span className="text-sm">Search Docs</span>
        </Button>
        
        <Button size="sm" className="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
          <span className="text-sm font-medium">New Doc</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
