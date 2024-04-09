import React, { ReactNode } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { CaretDownIcon } from "@radix-ui/react-icons";
import { cn } from "@/app/lib/utils";
import { Button } from "./button";

export function CollapsibleContent({
  childWhenOpen,
  childWhenClosed,
  collapsibleContent,
  className,
}: {
  childWhenOpen: ReactNode;
  childWhenClosed: ReactNode;
  collapsibleContent: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible.Root
      className={cn("w-full", className)}
      open={open}
      onOpenChange={setOpen}
    >
      <Collapsible.Trigger asChild>
        <Button
          variant="link"
          type="button"
          aria-roledescription="collapsible trigger"
          className="!pl-0 mb-2 leading-normal text-muted-foreground border-none inset-0 w-fit flex gap-1 items-center"
        >
          {open ? childWhenOpen : childWhenClosed}
          <CaretDownIcon
            className={cn(
              open ? "rotate-180" : "rotate-0",
              "transform duration-200"
            )}
          />
        </Button>
      </Collapsible.Trigger>

      <Collapsible.Content>{collapsibleContent}</Collapsible.Content>
    </Collapsible.Root>
  );
}
