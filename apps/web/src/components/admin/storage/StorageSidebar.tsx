import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChevronLeft, Folder, FolderOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../ui/collapsible";

export interface FolderNode {
  id: string;
  name: string;
  slug: string;
  children?: FolderNode[];
  filesCount: number;
}

export interface StorageSidebarProps {
  activePath: string;
  folders: FolderNode[];
}

interface FolderTreeItemProps {
  folder: FolderNode;
  activePath: string;
  depth: number;
}

function FolderTreeItem({ folder, activePath, depth }: FolderTreeItemProps) {
  const navigate = useNavigate();
  const hasChildren = folder.children && folder.children.length > 0;

  // Normalize paths for matching
  const normActive = activePath.replace(/^\/|\/$/g, "");
  const normSlug = folder.slug.replace(/^\/|\/$/g, "");

  const isActive = normActive === normSlug;
  const isChildActive = normActive === normSlug || normActive.startsWith(normSlug + "/");

  const [isOpen, setIsOpen] = useState(isChildActive);

  // Sync open state when path changes externally (e.g. breadcrumbs or direct navigation)
  useEffect(() => {
    if (isChildActive) {
      setIsOpen(true);
    }
  }, [activePath, folder.slug, isChildActive]);

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate({
      search: (old) => ({
        ...old,
        dir: folder.slug,
      }),
    });
  };

  const FolderIcon = isOpen ? FolderOpen : Folder;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="relative flex w-full items-center">
        {/* Premium Horizontal Glow Indicator */}
        {isActive && (
          <motion.div
            layoutId="active-folder-glow"
            className="absolute bottom-0 start-2 end-2 h-0.5 bg-accent shadow-[0_0_10px_2px_rgba(99,102,241,0.6)]"
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        )}

        {hasChildren ? (
          <div className="flex w-full items-center justify-between gap-1 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-secondary">
            <button
              type="button"
              onClick={handleSelect}
              className={`flex flex-1 items-center gap-2 text-start text-xs transition-colors duration-150 ${
                isActive ? "text-accent font-medium" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <FolderIcon
                className={`h-4 w-4 shrink-0 ${isActive ? "text-accent" : "text-text-muted"}`}
              />
              <span className="truncate">{folder.name}</span>
              <span className="ms-auto bg-accent/10 text-accent text-[10px] px-2 py-0.5 rounded-full font-sans">
                {folder.filesCount.toLocaleString("fa-IR")}
              </span>
            </button>

            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="p-1 rounded-md text-text-muted hover:bg-surface hover:text-text-primary transition-colors"
              >
                <ChevronLeft
                  data-state={isOpen ? "open" : "closed"}
                  className="h-3.5 w-3.5 transition-transform duration-300 data-[state=open]:-rotate-90"
                />
              </button>
            </CollapsibleTrigger>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSelect}
            className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-start text-xs transition-colors hover:bg-surface-secondary ${
              isActive ? "text-accent font-medium" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <FolderIcon
              className={`h-4 w-4 shrink-0 ${isActive ? "text-accent" : "text-text-muted"}`}
            />
            <span className="truncate">{folder.name}</span>
            <span className="ms-auto bg-accent/10 text-accent text-[10px] px-2 py-0.5 rounded-full font-sans">
              {folder.filesCount.toLocaleString("fa-IR")}
            </span>
          </button>
        )}
      </div>

      {hasChildren && folder.children && (
        <CollapsibleContent className="transition-all duration-200 overflow-hidden data-[state=closed]:h-0">
          <div className="ps-4 border-s border-border/30 ms-2 flex flex-col gap-0.5 mt-0.5">
            {folder.children.map((child) => (
              <FolderTreeItem
                key={child.id}
                folder={child}
                activePath={activePath}
                depth={depth + 1}
              />
            ))}
          </div>
        </CollapsibleContent>
      )}
    </Collapsible>
  );
}

export function StorageSidebar({ activePath, folders }: StorageSidebarProps) {
  return (
    <aside className="w-full shrink-0 bg-surface/60 backdrop-blur-md border border-border/50 rounded-2xl h-[calc(100vh-theme(spacing.24))] p-4 font-sans lg:w-56">
      <h3 className="mb-3 px-2 text-xs font-medium uppercase text-text-secondary">پوشه‌ها</h3>
      <div className="flex flex-col gap-0.5">
        {folders.map((folder) => (
          <FolderTreeItem key={folder.id} folder={folder} activePath={activePath} depth={0} />
        ))}
      </div>
    </aside>
  );
}
