import type { FolderNode } from "./MediaPickerModal.helpers";
import { getFolderIcon } from "./MediaPickerModal.helpers";

interface FolderTreeProps {
  nodes: FolderNode[];
  activePath: string;
  onSelect: (path: string) => void;
  depth: number;
}

export function FolderTree({ nodes, activePath, onSelect, depth }: FolderTreeProps) {
  return (
    <ul className="flex flex-col gap-0.5" style={{ paddingInlineStart: depth > 0 ? "12px" : "0" }}>
      {nodes.map((node) => {
        const isActive = activePath === node.path;
        const hasChildren = node.children && node.children.length > 0;
        const Icon = getFolderIcon(isActive);

        return (
          <li key={node.id}>
            <button
              type="button"
              onClick={() => onSelect(node.path)}
              className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-start text-xs font-medium transition-colors duration-150 ${
                isActive
                  ? "bg-surface-action text-accent"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Icon
                className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-accent" : "text-text-muted"}`}
              />
              {node.name}
            </button>
            {hasChildren && node.children && (
              <FolderTree
                nodes={node.children}
                activePath={activePath}
                onSelect={onSelect}
                depth={depth + 1}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}
