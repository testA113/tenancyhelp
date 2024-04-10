import { Dispatch, RefObject, SetStateAction } from "react";

import { Button } from "@/ui/button";
import { IconArrowRight } from "@/ui/icons";
import { cn } from "@/lib/utils";

type ExampleQuery = {
  message: string;
  hideWhenSmall?: boolean;
};

const exampleQueries: Array<ExampleQuery> = [
  { message: "My landlord is withholding my bond, what should I do?" },
  {
    message:
      "The toilet broke, draft an email to my landlord with a 14 day notice to fix it.",
  },
  {
    message: "My landlord asked to increase my rent, are they allowed to?",
    hideWhenSmall: true,
  },
  {
    message:
      "My landlord entered the property without notice, what are my rights?",
    hideWhenSmall: true,
  },
];

export function ExampleQueries({
  setInput,
  inputRef,
}: {
  setInput: Dispatch<SetStateAction<string>>;
  inputRef: RefObject<HTMLTextAreaElement>;
}) {
  return (
    <div className="mx-4 md:mx-0 grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
      {exampleQueries.map(({ message, hideWhenSmall }) => (
        <Button
          key={message}
          className={cn(
            "h-auto text-base p-2 w-full text-start justify-start border",
            hideWhenSmall && "hidden md:inline-flex"
          )}
          onClick={() => {
            setInput(message);
            inputRef.current?.focus();
          }}
          variant="outline"
        >
          <IconArrowRight className="mr-2 text-muted-foreground shrink-0" />
          {message}
        </Button>
      ))}
    </div>
  );
}
