// (e: FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions | undefined) => void

import { Dispatch, RefObject, SetStateAction } from "react";

import { Button } from "@/ui/button";
import { ExternalLink } from "@/ui/external-link";
import { IconArrowRight } from "@/ui/icons";
import { cn } from "@/lib/utils";

type ExampleQuery = {
  message: string;
  hideWhenSmall?: boolean;
};

const exampleQueries: Array<ExampleQuery> = [
  { message: "My landlord is withholding my bond, what should I do?" },
  { message: "The toilet is broken, make an email to my landlord to fix it." },
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

export function EmptyScreen({
  setInput,
  inputRef,
}: {
  setInput: Dispatch<SetStateAction<string>>;
  inputRef: RefObject<HTMLInputElement>;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8 mb-4">
        <h1 className="mb-2 text-lg md:text-2xl font-semibold">
          Welcome to Tenancy Help!
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          This chatbot is a tenancy advisor specifically designed for tenants in
          New Zealand.
        </p>
        <p className="mb-2">
          If you're a tenant, its goal is to resolve disputes between you and
          your landlord/property manager to avoid escalation. Depending on your
          query, it will provide advice backed by relevant sources from the{" "}
          <ExternalLink href="https://www.legislation.govt.nz/act/public/1986/0120/latest/whole.html?search=sw_096be8ed81d2fc65_23+working+days_25_se&p=1">
            New Zealand Residential Tenancy Act
          </ExternalLink>
          ,{" "}
          <ExternalLink href="https://www.tenancy.govt.nz/">
            Tenancy Services NZ
          </ExternalLink>{" "}
          and Tenancy Tribunal cases.
        </p>
        <p className="mb-2 leading-normal text-muted-foreground">
          The chatbot is powered by{" "}
          <ExternalLink href="https://openai.com/chatgpt">ChatGPT</ExternalLink>{" "}
          which may occasionally provide inaccurate information. Please verify
          all advice and references.
        </p>
        <p className="text-gray-500 text-sm">- Made with ♥️ by Ali Harris</p>
      </div>
      <h2 className="text-lg font-semibold mb-2">Try an example!</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
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
          >
            <IconArrowRight className="mr-2 text-muted-foreground shrink-0" />
            {message}
          </Button>
        ))}
      </div>
      <p className="leading-normal text-muted-foreground text-[0.8rem] text-center max-w-96 ml-auto mr-auto">
        Note: This chatbot it is not a substitute for professional legal advice.
        If you need help with a specific situation, please consult a lawyer or a{" "}
        <ExternalLink href="https://communitylaw.org.nz/">
          community law centre
        </ExternalLink>
        .
      </p>
    </div>
  );
}
