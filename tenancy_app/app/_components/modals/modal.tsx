"use client";

import { X } from "lucide-react";

interface ModalProps {
  isOpen?: boolean;
  handleClose?: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  button: any;
  content: any;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  content,
  button,
  handleClose,
  isOpen,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-[80%] md:w-[50%] lg:w-[40%] xl:w-[30%] my-6mx-auto h-auto lg:h-auto md:h-auto bg-black">
          <div
            className={`translate duration-300 h-full 
            ${isOpen ? "translate-y-0" : "translate-y-full"}
            ${isOpen ? "opacity-100" : "opacity-0"}`}
          >
            <div className="translate h-full lg:h-auto md:h-auto border-0 rounded-2xl shadow-lg relative flex flex-col w-full outline-none focus:outline-none">
              {/*header*/}
              <div className="flex items-center p-6 rounded-t justify-center relative border-b-[1px]">
                <button
                  className="p-1 border-0 hover:opacity-70 transition absolute left-9"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="text-lg font-semibold">{title}</div>
              </div>
              {/*body*/}
              <div className="relative p-6  flex-auto">{content}</div>
              {/*footer*/}
              <div className="flex flex-col gap-2 p-6 ">
                <div className="flex flex-row items-center gap-4 w-full">
                  {button}
                </div>
                {/*footer*/}
                <div className="text-center mt-2 text-xs">
                  Secure Login With Google
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
