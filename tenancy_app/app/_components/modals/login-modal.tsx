"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { signIn } from "next-auth/react";
import { browserName } from "react-device-detect";
import { X } from "lucide-react";

import { LoginModalStore } from "@/lib/store/login-modal-store";
import { Button } from "@/ui/button";
import { InternalLink } from "@/ui/internal-link";

import { Google } from "../icons/google";
import { Alert } from "../ui/alert";

export const LoginModal = () => {
  const isEmbeddedBrowser =
    browserName === "Facebook" || browserName === "Instagram";

  const loginModal = LoginModalStore();
  return (
    <Dialog.Root open={loginModal.isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0 z-20" />
        <Dialog.Content
          onPointerDownOutside={loginModal.setClose}
          className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-2xl translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none overflow-y-auto border border-foreground z-30"
        >
          <Dialog.Title className="mb-2">
            Welcome to Tenancy Help Insiders!
          </Dialog.Title>
          <Dialog.Close
            className="absolute right-5 top-5"
            onClick={loginModal.setClose}
          >
            <X />
          </Dialog.Close>
          <div className="mb-5 leading-normal">
            <p className="mb-2">
              You&apos;re the first to get access to Tenancy Help! It&apos;s
              been able to help with my most complicated flatting situations
              over 10 years - I hope it can help you too - Ali Harris
            </p>
            <p className="mb-2">
              Your queries will help train the GPT model to improve it&apos;s
              answers for everyone in the public release.
            </p>
            <p className="mb-2">
              While in this insiders group, please don&apos;t send any personal
              or identifying information.
            </p>
            <div className="w-full flex justify-between">
              <InternalLink target="_blank" href="/terms">
                Terms
              </InternalLink>
              <InternalLink target="_blank" href="/privacy">
                Privacy Policy
              </InternalLink>
            </div>
          </div>
          <Button
            variant="default"
            className="p-2 w-full gap-x-2"
            onClick={() => signIn("google")}
          >
            <Google />
            Continue with Google
          </Button>
          {isEmbeddedBrowser && (
            <Dialog.Description className="mt-5 leading-normal">
              <Alert variant="warning">
                You&apos;re using a browser that doesn&apos;t support login.
                Please open this page in your main browser.
              </Alert>
            </Dialog.Description>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
