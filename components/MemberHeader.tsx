import { Search, Mail, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const navItems = [
    "Book Summaries",
    "Leads",
    "Founders",
    "Finance",
    "Growth",
    "Contact",
    "Projects"
  ];

  return (
    <header className="bg-card border-b border-border px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
              <span className="text-card font-bold text-lg">S</span>
            </div>
            <span className="font-semibold text-lg">salesforce</span>
          </div>
          
          <nav className="flex items-center gap-2">
            {navItems.map((item) => (
              <Button
                key={item}
                variant={item === "Leads" ? "default" : "ghost"}
                className={item === "Leads" ? "bg-foreground text-card hover:bg-foreground/90 rounded-full px-6" : "rounded-full"}
              >
                {item}
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Mail className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="w-5 h-5" />
          </Button>
          <Avatar>
            <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
