export function formatResult(value) {
  if (!Number.isFinite(value)) return "Error";

  const rounded = Number(value.toPrecision(12));

  if (Object.is(rounded, -0)) return "0";

  if ((Math.abs(rounded) >= 1e12 || Math.abs(rounded) < 1e-9) && rounded !== 0) {
    return rounded.toExponential(8);
  }

  return String(rounded);
}

const functionNames = [
  "sin",
  "cos",
  "tan",
  "sec",
  "csc",
  "cot",
  "asin",
  "acos",
  "atan",
  "sinh",
  "cosh",
  "tanh",
  "ln",
  "log",
  "sqrt",
  "abs",
  "exp",
  "floor",
  "ceil",
  "round",
  "fact",
  "random",
];

function replaceFactorials(expression) {
  let prepared = expression;
  let previous = "";

  while (prepared !== previous) {
    previous = prepared;
    prepared = prepared.replace(
      /(\d+(?:\.\d+)?|pi|e|x|\([^()]*\))!/g,
      "fact($1)"
    );
  }

  return prepared;
}

function normalizeExpression(expression) {
  const functionPattern = functionNames.join("|");

  let prepared = expression
    .replaceAll("÷", "/")
    .replaceAll("×", "*")
    .replaceAll("−", "-")
    .replaceAll("π", "pi")
    .replaceAll("√", "sqrt")
    .replaceAll(",", ".")
    .replaceAll("^", "**")
    .replace(/\bmod\b/gi, "%");

  prepared = prepared.replace(
    new RegExp(`\\b(${functionPattern})\\s+(-?\\d+(?:\\.\\d+)?|pi|e|x)\\b`, "gi"),
    "$1($2)"
  );

  prepared = prepared.replace(/\s+/g, "");
  prepared = replaceFactorials(prepared);

  const implicitTargets = `\\(|\\b(?:x|pi|e)\\b|\\b(?:${functionPattern})\\b`;

  prepared = prepared.replace(
    new RegExp(`(\\d+(?:\\.\\d+)?|\\)|\\bpi\\b|\\be\\b|\\bx\\b)(?=${implicitTargets})`, "g"),
    "$1*"
  );

  return prepared;
}

function factorial(value) {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error("Factorial is defined only for non-negative integers");
  }

  if (value > 170) {
    throw new Error("Factorial value is too large");
  }

  let result = 1;

  for (let i = 2; i <= value; i += 1) {
    result *= i;
  }

  return result;
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
    "sec",
    "csc",
    "cot",
    "asin",
    "acos",
    "atan",
    "sinh",
    "cosh",
    "tanh",
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
    "random",
    "fact",
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

  const fromAngle = (value) => {
    if (angleMode === "DEG") return (value * 180) / Math.PI;
    return value;
  };

  const sin = (value) => Math.sin(toAngle(value));
  const cos = (value) => Math.cos(toAngle(value));
  const tan = (value) => Math.tan(toAngle(value));

  const sec = (value) => 1 / cos(value);
  const csc = (value) => 1 / sin(value);
  const cot = (value) => 1 / tan(value);

  const asin = (value) => fromAngle(Math.asin(value));
  const acos = (value) => fromAngle(Math.acos(value));
  const atan = (value) => fromAngle(Math.atan(value));

  const evaluator = Function(
    "x",
    "sin",
    "cos",
    "tan",
    "sec",
    "csc",
    "cot",
    "asin",
    "acos",
    "atan",
    "sinh",
    "cosh",
    "tanh",
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
    "random",
    "fact",
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
      sec,
      csc,
      cot,
      asin,
      acos,
      atan,
      Math.sinh,
      Math.cosh,
      Math.tanh,
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
      Math.random,
      factorial,
      Math.PI,
      Math.E
    );
}

export function calculateExpression(expression, angleMode) {
  const evaluator = createEvaluator(expression, angleMode);
  const result = evaluator(0);

  return formatResult(result);
}