import { useCallback, useState } from "react";
import { calculateExpression } from "../logic/calculator";
import { useLocalStorage } from "./useLocalStorage";

export function useCalculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");
  const [angleMode, setAngleMode] = useLocalStorage("angle-mode", "DEG");
  const [history, setHistory] = useLocalStorage("calculator-history", []);

  const addToExpression = useCallback((value) => {
    setExpression((current) => current + value);
  }, []);

  const clear = useCallback(() => {
    setExpression("");
    setResult("0");
  }, []);

  const deleteLast = useCallback(() => {
    setExpression((current) => current.slice(0, -1));
  }, []);

  const calculate = useCallback(() => {
    try {
      const calculated = calculateExpression(expression, angleMode);

      if (calculated === "") return;

      setResult(calculated);

      const item = {
        expression,
        result: calculated,
        date: new Date().toLocaleTimeString(),
      };

      setHistory((current) => [item, ...current].slice(0, 10));
      setExpression(calculated);
    } catch {
      setResult("Error");
    }
  }, [expression, angleMode, setHistory]);

  const handleInput = useCallback(
    (value) => {
      if (value === "C") {
        clear();
        return;
      }

      if (value === "DEL") {
        deleteLast();
        return;
      }

      if (value === "=") {
        calculate();
        return;
      }

      if (["sin", "cos", "tan", "ln", "log", "exp"].includes(value)) {
        addToExpression(`${value}(`);
        return;
      }

      if (value === "√") {
        addToExpression("sqrt(");
        return;
      }

      if (value === "x²") {
        addToExpression("^2");
        return;
      }

      if (value === "xʸ") {
        addToExpression("^");
        return;
      }

      if (value === "10ˣ") {
        addToExpression("10^");
        return;
      }

      if (value === "1/x") {
        addToExpression("1/");
        return;
      }

      if (value === "|x|") {
        addToExpression("abs(");
        return;
      }

      if (value === "mod") {
        addToExpression("%");
        return;
      }

      if (value === "ANS") {
        addToExpression(result);
        return;
      }

      if (value === "±") {
        if (expression.startsWith("-")) {
          setExpression(expression.slice(1));
        } else {
          setExpression("-" + expression);
        }
        return;
      }

      addToExpression(value);
    },
    [expression, result, addToExpression, calculate, clear, deleteLast]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  const useHistoryItem = useCallback((item) => {
    setExpression(item.result);
    setResult(item.result);
  }, []);

  const toggleAngleMode = useCallback(() => {
    setAngleMode((current) => (current === "DEG" ? "RAD" : "DEG"));
  }, [setAngleMode]);

  return {
    expression,
    result,
    history,
    angleMode,
    handleInput,
    clearHistory,
    useHistoryItem,
    toggleAngleMode,
  };
}