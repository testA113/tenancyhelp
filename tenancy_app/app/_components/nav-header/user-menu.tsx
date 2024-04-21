"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Loader2Icon, User2Icon } from "lucide-react";

import { LoginModalStore } from "@/lib/store/login-modal-store";
import { Button } from "@/ui/button";

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

  if (!session?.user?.image) {
    return (
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-secondary-foreground bg-secondary">
        <User2Icon />
      </div>
    );
  }
  return (
    <Image
      src={session.user.image}
      width={48}
      height={48}
      alt="User Profile Image"
      className="h-12 w-auto rounded-full"
    />
  );
}
