export function formatResult(value) {
  if (!Number.isFinite(value)) return "Error";

  const rounded = Number(value.toPrecision(12));

  if (Object.is(rounded, -0)) return "0";

  if ((Math.abs(rounded) >= 1e12 || Math.abs(rounded) < 1e-9) && rounded !== 0) {
    return rounded.toExponential(8);
  }

  return String(rounded);
}

function normalizeExpression(expression) {
  return expression
    .replaceAll("÷", "/")
    .replaceAll("×", "*")
    .replaceAll("−", "-")
    .replaceAll("π", "pi")
    .replaceAll("√", "sqrt")
    .replaceAll(",", ".")
    .replaceAll("^", "**")
    .replace(/\s+/g, "")
    .replace(/\bmod\b/gi, "%")
    .replace(/(\d|\))(?=(x|pi|e|\(|sin|cos|tan|ln|log|sqrt|abs|exp))/g, "$1*")
    .replace(/\b(x|pi|e)\b(?=\()/g, "$1*");
}

export function createEvaluator(expression, angleMode = "DEG") {
  if (!expression || expression.trim() === "") {
    throw new Error("Empty expression");
  }

  const prepared = normalizeExpression(expression);

  if (/[^0-9A-Za-z+\-*/%().]/.test(prepared)) {
    throw new Error("Invalid characters");
  }

  const allowedIdentifiers = new Set([
    "x",
    "sin",
    "cos",
    "tan",
    "ln",
    "log",
    "sqrt",
    "abs",
    "exp",
    "pow",
    "floor",
    "ceil",
    "round",
    "min",
    "max",
    "pi",
    "e",
  ]);

  const identifiers = prepared.match(/[A-Za-z]+/g) || [];

  for (const identifier of identifiers) {
    if (!allowedIdentifiers.has(identifier)) {
      throw new Error("Invalid identifier");
    }
  }

  const toAngle = (value) => {
    if (angleMode === "DEG") return (value * Math.PI) / 180;
    return value;
  };

  const sin = (value) => Math.sin(toAngle(value));
  const cos = (value) => Math.cos(toAngle(value));
  const tan = (value) => Math.tan(toAngle(value));

  const evaluator = Function(
    "x",
    "sin",
    "cos",
    "tan",
    "ln",
    "log",
    "sqrt",
    "abs",
    "exp",
    "pow",
    "floor",
    "ceil",
    "round",
    "min",
    "max",
    "pi",
    "e",
    `"use strict"; return (${prepared});`
  );

  return (xValue = 0) =>
    evaluator(
      xValue,
      sin,
      cos,
      tan,
      Math.log,
      Math.log10,
      Math.sqrt,
      Math.abs,
      Math.exp,
      Math.pow,
      Math.floor,
      Math.ceil,
      Math.round,
      Math.min,
      Math.max,
      Math.PI,
      Math.E
    );
}

export function calculateExpression(expression, angleMode) {
  const evaluator = createEvaluator(expression, angleMode);
  const result = evaluator(0);

  return formatResult(result);
}