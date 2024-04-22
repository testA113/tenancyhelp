import { Dispatch, RefObject, SetStateAction, useState } from "react";
import { ArrowRight, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

type ExampleQuery = {
  message: string;
  example: string;
};

const exampleQueries: Array<ExampleQuery> = [
  {
    message: "Provide advice",
    example: "My landlord is withholding my bond, what should I do?",
  },
  {
    message: "Draft an email to fix something",
    example:
      "The toilet broke, draft an email to my landlord with a 14 day notice to fix it.",
  },
  {
    message: "Find laws from the Residential Tenancies Act",
    example: "My landlord asked to increase my rent, are they allowed to?",
  },
  {
    message: "Find similar Tenancy Tribunal cases",
    example:
      "I'm having issues with repairs not being done. How have similar cases been resolved?",
  },
];

export function ExampleQueries({
  setInput,
  inputRef,
}: {
  setInput: Dispatch<SetStateAction<string>>;
  inputRef: RefObject<HTMLTextAreaElement>;
}) {
  const numberShown = 2;
  const [indecesShown, setIndecesShown] = useState([0, numberShown]);

  // show the first two examples for small screens
  const exampleQueriesShown = exampleQueries.slice(
    indecesShown[0],
    indecesShown[1]
  );

  return (
    <>
      <h2 className="mb-2 text-center">
        What can I do?
        <Button variant="ghost" size="icon" className="ml-2 md:hidden">
          <RefreshCw
            onClick={() => {
              // show the next two examples. If we're at the end, show the first two
              setIndecesShown((prev) => {
                const nextStart = prev[0] + numberShown;
                const nextEnd = prev[1] + numberShown;

                if (nextEnd > exampleQueries.length) {
                  return [0, numberShown];
                }

                return [nextStart, nextEnd];
              });
            }}
          />
        </Button>
      </h2>
      <div className="md:hidden mx-4 md:mx-0 grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
        {exampleQueriesShown.map(({ message, example }) => (
          <ExampleQueryButton
            key={message}
            message={message}
            example={example}
            setInput={setInput}
            inputRef={inputRef}
          />
        ))}
      </div>
      <div className="md:grid mx-4 md:mx-0 hidden grid-cols-1 md:grid-cols-2 gap-2 mb-4">
        {exampleQueries.map(({ message, example }) => (
          <ExampleQueryButton
            key={message}
            message={message}
            example={example}
            setInput={setInput}
            inputRef={inputRef}
          />
        ))}
      </div>
    </>
  );
}

function ExampleQueryButton({
  message,
  example,
  setInput,
  inputRef,
}: ExampleQuery & {
  setInput: Dispatch<SetStateAction<string>>;
  inputRef: RefObject<HTMLTextAreaElement>;
}) {
  return (
    <Button
      key={message}
      className="h-auto text-base p-2 w-full text-start justify-start border border-l-4 border-l-primary"
      onClick={() => {
        setInput(example);
        inputRef.current?.focus();
      }}
      variant="outline"
    >
      <ArrowRight className="mr-2 text-muted-foreground shrink-0" />
      <div className="flex flex-col">
        <div className="font-semibold">{message}</div>
        <div className="text-muted-foreground text-sm">e.g. {example}</div>
      </div>
    </Button>
  );
}
