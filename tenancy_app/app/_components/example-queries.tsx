import { Dispatch, RefObject, SetStateAction } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/app/_components/ui/button";
import { cn } from "@/app/_lib/utils";

type ExampleQuery = {
  message: string;
  example: string;
  hideWhenSmall?: boolean;
};

const exampleQueries: Array<ExampleQuery> = [
  {
    message: "Provide advice",
    example: "e.g. My landlord is withholding my bond, what should I do?",
  },
  {
    message: "Draft an email to fix something",
    example:
      "e.g. The toilet broke, draft an email to my landlord with a 14 day notice to fix it.",
  },
  {
    message: "Find laws from the Residential Tenancies Act",
    example: "e.g. My landlord asked to increase my rent, are they allowed to?",
    hideWhenSmall: true,
  },
  {
    message: "Find similar Tenancy Tribunal cases",
    example:
      "e.g. I'm having issues with repairs not being done. How have similar cases been resolved?",
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
    <>
      <h2 className="mb-2 text-center">What can I do?</h2>
      <div className="mx-4 md:mx-0 grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
        {exampleQueries.map(({ message, example, hideWhenSmall }) => (
          <Button
            key={message}
            className={cn(
              "h-auto text-base p-2 w-full text-start justify-start border border-l-4 border-l-primary",
              hideWhenSmall && "hidden md:inline-flex"
            )}
            onClick={() => {
              setInput(example);
              inputRef.current?.focus();
            }}
            variant="outline"
          >
            <ArrowRight className="mr-2 text-muted-foreground shrink-0" />
            <div className="flex flex-col">
              <div className="font-semibold">{message}</div>
              <div className="text-muted-foreground text-sm">{example}</div>
            </div>
          </Button>
        ))}
      </div>
    </>
  );
}
