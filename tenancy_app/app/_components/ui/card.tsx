import { ReactNode } from "react";

export const Card = ({ children }: { children: ReactNode }) => {
  return (
    <div className="rounded-lg border border-muted-foreground bg-background p-8 mb-4">
      {children}
    </div>
  );
};
