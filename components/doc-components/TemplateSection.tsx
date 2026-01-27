import { X, FileText, CheckCircle } from "lucide-react";

const templates = [
  {
    icon: "📋",
    iconBg: "bg-yellow/20",
    title: "Project Overview",
    description: "Summarize goals, scope, and milestones",
  },
  {
    icon: "📝",
    iconBg: "bg-orange/20",
    title: "Meeting Notes",
    description: "Capture an agenda, notes, and action items",
  },
  {
    icon: "📖",
    iconBg: "bg-blue/20",
    title: "Wiki",
    description: "Organize information in one place",
    verified: true,
  },
];

export function TemplateSection() {
  return (
    <div className="dark:bg-[#191919] bg-[#FCFCFC] shadow-sm rounded-xl border dark:border-[#2A2A2A] p-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-foreground font-medium text-sm">Start with a template</h3>
        <div className="flex items-center gap-3">
          <button className="text-muted-foreground hover:text-foreground text-xs">
            Browse Templates
          </button>
          <button className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {templates.map((template, index) => (
          <button
            key={index}
            className="flex items-center shadow-sm gap-2 p-3 dark:bg-[#111111] bg-[#fff] rounded-xl border dark:border-[#272727] hover:bg-secondary transition-colors text-left"
          >
            <div className={`w-10 h-10 rounded-lg ${template.iconBg} flex items-center justify-center text-lg`}>
              {template.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-foreground font-medium text-sm truncate">
                  {template.title}
                </span>
                {template.verified && (
                  <CheckCircle className="w-3.5 h-3.5 text-blue flex-shrink-0" />
                )}
              </div>
              <p className="text-muted-foreground text-xs truncate">
                {template.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
