"use client";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";

import { HomeLink } from "./home-link";
import { UserMenu } from "./user-menu";

export const NavHeader: React.FC = () => {
  const { status } = useSession();
  return (
    <header className="fixed left-0 right-0 top-0 z-1 bg-gradient-to-b from-background from-25% to-background/0 mx-auto">
      <div className="flex justify-between text-default py-3 px-3 md:px-6 mx-auto w-full">
        <HomeLink />
        <div className="flex gap-x-2 md:gap-x-4 items-center">
          {status === "authenticated" && <NewChatButton />}
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

function NewChatButton() {
  return (
    <>
      <div className="hidden md:block">
        <Button
          variant="outline"
          className="hidden md:flex gap-x-1"
          onClick={(e) => {
            e.preventDefault();
            window.location.reload();
          }}
        >
          <Plus />
          New Chat
        </Button>
      </div>
      <div className="md:hidden">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className=" p-0 rounded-full md:hidden"
              onClick={(e) => {
                e.preventDefault();
                window.location.reload();
              }}
            >
              <Plus />
              <span className="sr-only">New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
      </div>
    </>
  );
}
