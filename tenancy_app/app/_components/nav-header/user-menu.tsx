"use client";
import { useSession } from "next-auth/react";
import { Loader2Icon, LogOut, User2Icon } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { signOut } from "next-auth/react";
import Image from "next/image";

import { Button } from "@/ui/button";
import { LoginModalStore } from "@/lib/store/login-modal-store";

export function UserMenu() {
  const loginModal = LoginModalStore();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-12 w-12 flex items-center justify-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Button
        variant="default"
        onClick={() => {
          loginModal.setOpen();
        }}
      >
        Login
      </Button>
    );
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="rounded-full w-12 h-12 inline-flex items-center justify-center"
          aria-label="Customise options"
        >
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              width={48}
              height={48}
              alt="User Profile Image"
              className="h-12 w-auto rounded-full"
            />
          ) : (
            <User2Icon />
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="border border-foreground min-w-40 bg-white p-1 rounded-md mx-4 will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
          sideOffset={5}
        >
          <DropdownMenu.Item
            className="cursor-pointer data-[highlighted]:!outline-1 data-[highlighted]:!outline-dashed data-[highlighted]:!outline-foreground outline-none leading-none rounded-sm flex items-center h-6 p-4 relative"
            onClick={() => signOut()}
          >
            Sign out
            <div className="ml-auto pl-4 text-muted-foreground">
              <LogOut className="h-4" />
            </div>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
