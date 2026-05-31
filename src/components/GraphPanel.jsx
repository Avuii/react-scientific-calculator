import { useEffect, useRef, useState } from "react";
import { createEvaluator } from "../logic/calculator";

const presets = [
  "sin(x)",
  "cos(x)",
  "tan(x)",
  "x^2",
  "x^3 - 3*x",
  "sqrt(x)",
  "log(x)",
  "exp(x/4)",
];

function getStep(scale) {
  const target = 60 / scale;
  const steps = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100];

  for (const step of steps) {
    if (step >= target) return step;
  }

  return 100;
}

function drawPlot(canvas, evaluator, scale, theme) {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width));
  const height = Math.max(1, Math.floor(rect.height));
  const ratio = window.devicePixelRatio || 1;

  const isLight = theme === "light";

  const gridColor = isLight
    ? "rgba(15, 23, 42, 0.12)"
    : "rgba(255, 255, 255, 0.1)";

  const axisColor = isLight
    ? "rgba(15, 23, 42, 0.48)"
    : "rgba(255, 255, 255, 0.5)";

  const labelColor = isLight
    ? "rgba(15, 23, 42, 0.62)"
    : "rgba(255, 255, 255, 0.55)";

  const curveColor = isLight ? "#7c3aed" : "#c084fc";
  const curveShadow = isLight
    ? "rgba(124, 58, 237, 0.32)"
    : "rgba(192, 132, 252, 0.55)";

  canvas.width = width * ratio;
  canvas.height = height * ratio;

  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;
  const step = getStep(scale);

  const minX = -centerX / scale;
  const maxX = centerX / scale;
  const minY = -centerY / scale;
  const maxY = centerY / scale;

  ctx.lineWidth = 1;
  ctx.strokeStyle = gridColor;

  for (let x = Math.ceil(minX / step) * step; x <= maxX; x += step) {
    const px = centerX + x * scale;
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, height);
    ctx.stroke();
  }

  for (let y = Math.ceil(minY / step) * step; y <= maxY; y += step) {
    const py = centerY - y * scale;
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(width, py);
    ctx.stroke();
  }

  ctx.lineWidth = 1.5;
  ctx.strokeStyle = axisColor;

  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(width, centerY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, height);
  ctx.stroke();

  ctx.fillStyle = labelColor;
  ctx.font = "12px Inter, system-ui, sans-serif";

  for (let x = Math.ceil(minX / step) * step; x <= maxX; x += step) {
    if (Math.abs(x) < 1e-9) continue;
    const px = centerX + x * scale;
    ctx.fillText(Number(x.toFixed(3)), px + 4, centerY + 18);
  }

  for (let y = Math.ceil(minY / step) * step; y <= maxY; y += step) {
    if (Math.abs(y) < 1e-9) continue;
    const py = centerY - y * scale;
    ctx.fillText(Number(y.toFixed(3)), centerX + 8, py - 4);
  }

  ctx.fillText("0", centerX + 6, centerY + 16);

  ctx.lineWidth = 3;
  ctx.strokeStyle = curveColor;
  ctx.shadowColor = curveShadow;
  ctx.shadowBlur = 16;

  let drawing = false;

  ctx.beginPath();

  for (let px = 0; px <= width; px += 1) {
    const x = (px - centerX) / scale;
    const y = evaluator(x);
    const py = centerY - y * scale;

    if (!Number.isFinite(y) || Math.abs(py) > height * 5) {
      drawing = false;
      continue;
    }

    if (!drawing) {
      ctx.moveTo(px, py);
      drawing = true;
    } else {
      ctx.lineTo(px, py);
    }
  }

  ctx.stroke();
  ctx.shadowBlur = 0;
}

function GraphPanel({ theme }) {
  const canvasRef = useRef(null);
  const [expression, setExpression] = useState("sin(x)");
  const [scale, setScale] = useState(45);
  const [error, setError] = useState("");

  useEffect(() => {
    function redraw() {
      try {
        const evaluator = createEvaluator(expression, "RAD");
        drawPlot(canvasRef.current, evaluator, scale, theme);
        setError("");
      } catch {
        setError("Nie można narysować tej funkcji.");
      }
    }

    redraw();
    window.addEventListener("resize", redraw);

    return () => window.removeEventListener("resize", redraw);
  }, [expression, scale, theme]);

  function zoomIn() {
    setScale((current) => Math.min(current * 1.25, 160));
  }

  function zoomOut() {
    setScale((current) => Math.max(current / 1.25, 12));
  }

  function resetZoom() {
    setScale(45);
  }

  return (
    <section className="graph-card">
      <div className="graph-header">
        <div>
          <p className="eyebrow">Graphing mode</p>
          <h2>Function Plotter</h2>
        </div>

        <div className="graph-tools">
          <button onClick={zoomIn}>+</button>
          <button onClick={zoomOut}>−</button>
          <button onClick={resetZoom}>Reset</button>
        </div>
      </div>

      <div className="graph-input-row">
        <span>f(x)</span>
        <input
          value={expression}
          onChange={(event) => setExpression(event.target.value)}
          placeholder="np. sin(x), x^2, log(x)"
        />
      </div>

      <div className="graph-presets">
        {presets.map((preset) => (
          <button key={preset} onClick={() => setExpression(preset)}>
            {preset}
          </button>
        ))}
      </div>

      <div className="graph-canvas-wrapper">
        <canvas ref={canvasRef} className="graph-canvas" />
      </div>

      {error && <p className="graph-error">{error}</p>}
    </section>
  );
}

export default GraphPanel;