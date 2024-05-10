import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { PropsWithChildren } from "react";

import { cn } from "@/app/_lib/utils";

type Variant = "info" | "success" | "warning" | "error";

const variantClasses: Record<Variant, string> = {
  info: "bg-blue-100 text-blue-800 border-blue-600",
  success: "bg-green-100 text-green-800 border-green-600",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-600",
  error: "bg-red-100 text-red-800 border-red-600",
};

const variantIcons: Record<Variant, React.ReactNode> = {
  info: <Info className="h-4 w-auto" />,
  success: <CheckCircle2 className="h-4 w-auto" />,
  warning: <AlertTriangle className="h-4 w-auto" />,
  error: <XCircle className="h-4 w-auto" />,
};

export function Alert({
  children,
  variant,
}: PropsWithChildren<{ variant: Variant }>) {
  const icon = variantIcons[variant];
  return (
    <div
      className={cn(
        "w-full p-4 flex border border-solid rounded-lg",
        variantClasses[variant]
      )}
    >
      <div className="shrink-0 flex h-6 items-center mr-1">{icon}</div>
      {children}
    </div>
  );
}
