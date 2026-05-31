import { useEffect } from "react";

export function useKeyboard(onInput) {
  useEffect(() => {
    function handleKeyDown(event) {
      const key = event.key;

      if (/^[0-9]$/.test(key)) onInput(key);
      if (key === ".") onInput(".");
      if (key === "+") onInput("+");
      if (key === "-") onInput("−");
      if (key === "*") onInput("×");
      if (key === "/") onInput("÷");
      if (key === "%") onInput("%");
      if (key === "(") onInput("(");
      if (key === ")") onInput(")");
      if (key === "Enter") onInput("=");
      if (key === "Backspace") onInput("DEL");
      if (key === "Escape") onInput("C");
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onInput]);
}