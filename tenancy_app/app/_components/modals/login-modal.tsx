"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { signIn } from "next-auth/react";

import { LoginModalStore } from "@/app/_lib/store/login-modal-store";

import { Button } from "../ui/button";
import { Google } from "../icons/google";

export const LoginModal = () => {
  const loginModal = LoginModalStore();
  return (
    <Dialog.Root open={loginModal.isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-2xl translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none overflow-y-auto border border-foreground">
          <Dialog.Title className="mb-2">
            Welcome to Tenancy Help Insiders!
          </Dialog.Title>
          <Dialog.Description className="mb-5 leading-normal">
            <p className="mb-2">
              You&apos;re the first to get access to Tenancy Help! It&apos;s
              been able to help with my most complicated flatting situations
              over 10 years - I hope it can help you too.
            </p>
            <p className="mb-2">
              Your queries will help train the GPT model to improve it&apos;s
              answers for everyone in the public release.
            </p>
            <p className="mb-2">
              While in this insiders group, please don&apos;t send any personal
              or identifying information.
            </p>
          </Dialog.Description>
          <Button
            variant="default"
            className="p-2 w-full gap-x-2"
            onClick={() => signIn("google")}
          >
            <Google />
            Continue with Google
          </Button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};