import { useState, useEffect } from "react";
import { spinner } from "../ui/spinner";

export function ChatResponseLoading({ loadingMessage = "Thinking" }) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setDots((dots) => (dots.length < 3 ? dots + "." : ""));
    }, 300);

    return () => clearInterval(timer);
  }, []);

  return (
    <p className="flex text-muted-foreground">
      {spinner}
      <span className="ml-1">
        {loadingMessage}
        {dots}
      </span>
    </p>
  );
}
