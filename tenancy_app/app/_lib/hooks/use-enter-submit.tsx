import { useRef, type RefObject } from "react";

export function useEnterSubmit(): {
  formRef: RefObject<HTMLFormElement>;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
} {
  const formRef = useRef<HTMLFormElement>(null);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      // similar to https://github.com/aws-amplify/amplify-js/pull/5333/files, fixing ios safari issue
      const fakeButton = document.createElement("button");
      fakeButton.type = "submit";
      fakeButton.style.display = "none";
      formRef.current?.appendChild(fakeButton);
      fakeButton.click();
      fakeButton.remove();
    }
  };

  return { formRef, onKeyDown: handleKeyDown };
}
