"use client";
import { Plus } from "lucide-react";

import { Button } from "../ui/button";

import { HomeLink } from "./home-link";
import { UserMenu } from "./user-menu";

export const NavHeader: React.FC = () => {
  return (
    <header className="fixed left-0 right-0 top-0 z-10 bg-gradient-to-b from-background from-25% to-background/0 mx-auto">
      <div className="flex justify-between text-default py-3 px-3 md:px-6 mx-auto w-full">
        <HomeLink />
        <div className="flex gap-x-2 md:gap-x-4 items-center">
          <NewChatButton />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

function NewChatButton() {
  return (
    <Button
      variant="outline"
      className="flex gap-x-1"
      onClick={(e) => {
        e.preventDefault();
        window.location.reload();
      }}
    >
      <Plus />
      New Chat
    </Button>
  );
}
