import { ExternalLink } from "@/app/_components/ui/external-link";
import { CollapsibleContent } from "@/app/_components/ui/collapsible-content";

import { Card } from "./ui/card";

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <Card>
        <h1 className="mb-2 text-center">Welcome to Tenancy Help!</h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          If you&apos;re flatting in New Zealand, I&apos;m here to help. Backed
          by local laws and solid sources, I can give you advice on common
          tenancy issues.
        </p>
        <CollapsibleContent
          className="sm:hidden"
          childWhenOpen={<p>Less info</p>}
          childWhenClosed={<p>More info</p>}
          collapsibleContent={<MoreInfo />}
        ></CollapsibleContent>
        <MoreInfo className="hidden sm:block" />
      </Card>
    </div>
  );
}

function MoreInfo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="mb-2 leading-normal text-muted-foreground">
        The chatbot is powered by{" "}
        <ExternalLink href="https://openai.com/chatgpt">ChatGPT</ExternalLink>{" "}
        which can provide inaccurate information. Please verify all advice and
        references.
      </p>
      <p className="leading-normal text-muted-foreground">
        This chatbot it is not a substitute for professional legal advice. If
        you need help with a specific situation, please consult a lawyer or the{" "}
        <ExternalLink href="https://www.cab.org.nz/">
          Citizens Advice Bureau
        </ExternalLink>
        .
      </p>
    </div>
  );
}
