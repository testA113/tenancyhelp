import { ReactNode } from "react";
import { IconUser } from "../ui/icons";

export function UserMessage({ children }: { children: ReactNode }) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-secondary">
        <IconUser />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1 py-1">
        {children}
      </div>
    </div>
  );
}
