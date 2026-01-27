import { FileText, File } from "lucide-react";

const recentDocs = [
  { name: "conferio", location: "in conferio", icon: "file" },
  { name: "dvz-ivtc-srb - 12/01/2025", location: "in dvz-ivtc-srb - 12/01/2025", icon: "file" },
  { name: "Untitled", location: "in conferio", icon: "file" },
];

const createdByMe = [
  { name: "Meeting Guidelines", icon: "doc", color: "green" },
  { name: "dvz-ivtc-srb - 12/01/2025", location: "in dvz-ivtc-srb - 12/01/2025", icon: "file" },
  { name: "Project Overview Doc", icon: "file" },
];

export function QuickAccessSection() {
  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      {/* Recent */}
      <div className="dark:bg-[#111111] px-4 py-3 rounded-xl border dark:border-[#222222]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-foreground font-medium text-sm">Recent</h3>
          <button className="text-muted-foreground hover:text-foreground text-xs">
            See all
          </button>
        </div>
        <div className="space-y-2">
          {recentDocs.map((doc, index) => (
            <button
              key={index}
              className="w-full flex items-center gap-2 p-0 rounded hover:bg-secondary transition-colors text-left"
            >
              <File className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex justify-center items-center gap-2">
                <span className="text-foreground text-sm truncate block">{doc.name}</span>
                <span className="text-muted-foreground text-xs truncate block">• {doc.location}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Favorites */}
      <div className="dark:bg-[#111111] px-4 py-3 rounded-xl border dark:border-[#222222]">
        <h3 className="text-foreground font-medium text-sm mb-3">Favorites</h3>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-12 h-14 bg-secondary rounded flex items-center justify-center mb-3">
            <File className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-xs text-center">
            Your favorited Docs will show here.
          </p>
        </div>
      </div>

      {/* Created by Me */}
      <div className="dark:bg-[#111111] px-4 py-3 rounded-xl border dark:border-[#222222]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-foreground font-medium text-sm">Created by Me</h3>
          <button className="text-muted-foreground hover:text-foreground text-xs">
            See all
          </button>
        </div>
        <div className="space-y-1">
          {createdByMe.map((doc, index) => (
            <button
              key={index}
              className="w-full flex items-center gap-2 p-2 rounded hover:bg-secondary transition-colors text-left"
            >
              {doc.color === "green" ? (
                <div className="w-4 h-4 rounded bg-green/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-2.5 h-2.5 text-green" />
                </div>
              ) : (
                <File className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
              <div className="flex justify-center items-center gap-2">
                <span className="text-foreground text-sm truncate block">{doc.name}</span>
                {doc.location && (
                  <span className="text-muted-foreground text-xs truncate block">• {doc.location}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
