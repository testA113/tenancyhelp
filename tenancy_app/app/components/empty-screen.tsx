import { ExternalLink } from "@/ui/external-link";
import { CollapsibleContent } from "@/ui/collapsible-content";
import { cn } from "@/lib/utils";

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4 mb-24">
      <div className="rounded-lg border bg-background p-8 mb-4">
        <h1 className="mb-2 text-lg md:text-2xl font-semibold">
          Welcome to Tenancy Help!
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          The tenancy advisor chatbot specifically designed for tenants in New
          Zealand. Backed by local laws and solid sources, its goal is to
          resolve disputes between you and your landlord/property manager to
          avoid escalation.
        </p>
        <CollapsibleContent
          className="sm:hidden"
          childWhenOpen={<p>Less info</p>}
          childWhenClosed={<p>More info</p>}
          collapsibleContent={
            <>
              <MoreInfo />
              <Disclosure />
            </>
          }
        ></CollapsibleContent>
        <MoreInfo className="hidden sm:block" />
      </div>
      <div className="text-sm text-center ml-auto mr-auto max-w-96">
        <Disclosure className="hidden sm:block" />
      </div>
    </div>
  );
}

function MoreInfo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="mb-2 leading-normal text-muted-foreground">
        The advice it gives is backed by relevant sources from the{" "}
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
  );
}

function Disclosure({ className }: { className?: string }) {
  return (
    <p className={cn(className, "leading-normal text-muted-foreground")}>
      Note: This chatbot it is not a substitute for professional legal advice.
      If you need help with a specific situation, please consult a lawyer or a{" "}
      <ExternalLink href="https://communitylaw.org.nz/">
        community law centre
      </ExternalLink>
      .
    </p>
  );
}
