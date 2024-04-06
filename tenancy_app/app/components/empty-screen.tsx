import { Dispatch, RefObject, SetStateAction } from "react";

import { ExternalLink } from "@/ui/external-link";

type ExampleQuery = {
  message: string;
  hideWhenSmall?: boolean;
};

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4 mb-24">
      <div className="rounded-lg border bg-background p-8 mb-4">
        <h1 className="mb-2 text-lg md:text-2xl font-semibold">
          Welcome to Tenancy Help!
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          The tenancy advisor chatbot specifically designed for tenants in New
          Zealand.
        </p>
        <p className="mb-2 leading-normal text-muted-foreground">
          Its goal is to resolve disputes between you and your landlord/property
          manager to avoid escalation. It will provide advice backed by relevant
          sources from the{" "}
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
          which can provide inaccurate information. Please verify all advice and
          references.
        </p>
      </div>
      <p className="leading-normal text-muted-foreground text-sm text-center max-w-96 ml-auto mr-auto">
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
