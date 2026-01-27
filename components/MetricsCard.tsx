import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricsCardProps {
  value: string;
  unit?: string;
  change: string;
  isPositive: boolean;
  label: string;
}

const MetricsCard = ({ value, unit, change, isPositive, label }: MetricsCardProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-semibold">{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      
      <div className={cn(
        "flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium",
        isPositive ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
      )}>
        {isPositive ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
        <span>{change}</span>
      </div>
      
      <Button variant="ghost" size="icon" className="rounded-full border border-border">
        <ArrowUpRight className="w-4 h-4" />
      </Button>
      
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
};

export default MetricsCard;

const Button = ({ variant, size, className, children }: any) => (
  <button className={cn("inline-flex items-center justify-center", className)}>
    {children}
  </button>
);
