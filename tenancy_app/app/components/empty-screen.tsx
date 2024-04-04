// (e: FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions | undefined) => void

import { Dispatch, RefObject, SetStateAction } from "react";

import { Button } from "@/ui/button";
import { ExternalLink } from "@/ui/external-link";
import { IconArrowRight } from "@/ui/icons";

const exampleMessages: string[] = [
  "My landlord is withholding my bond, what should I do?",
  "The toilet is broken and hasn't been fixed for weeks, make a draft email for to my landlord to fix it",
  "My landlord asked to increase my rent, are they allowed to?",
  "My landlord entered the property without notice, what are my rights?",
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
        <h1 className="mb-2 text-lg font-semibold">Welcome to Tenancy Help!</h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          This chatbot is a tenancy advisor for tenants in New Zealand.
        </p>
        <p className="mb-2">
          It's main function is to reslove disputes between tenants and
          landlords, to avoid escalation. Depending on what you ask, it's advice
          will reference relevant sources from the{" "}
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
          which is known to sometimes hallucinate - please double check the
          advice and references.
        </p>
        <p className="leading-normal text-muted-foreground">Try an example:</p>
        <div className="mt-4 flex flex-col items-start space-y-2 mb-4">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              className="h-auto text-base p-2 w-full text-start justify-start"
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
