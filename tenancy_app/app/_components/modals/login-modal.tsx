"use client";
import React from "react";
import { Modal } from "./modal";
import { LoginModalStore } from "@/lib/store/login-modal-store";
import { signIn } from "next-auth/react";
import { Google } from "../icons/google";
import { Button } from "../ui/button";

const LoginModal = () => {
  const loginModal = LoginModalStore();

  return (
    <Modal
      isOpen={loginModal.isOpen}
      title="Login"
      handleClose={loginModal.setClose}
      button={""}
      content={
        <Button
          variant="default"
          className="p-2 w-full gap-x-2"
          onClick={() => signIn("google")}
        >
          <Google />
          Continue with Google
        </Button>
      }
    />
  );
};

export default LoginModal;
