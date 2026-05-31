import { useEffect, useMemo, useRef, useState } from "react";
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

const defaultBounds = {
  xMin: -12,
  xMax: 12,
  yMin: -5,
  yMax: 5,
};

function getStep(range) {
  const target = range / 8;
  const steps = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100];

  for (const step of steps) {
    if (step >= target) return step;
  }

  return 100;
}

function worldToScreen(x, y, bounds, width, height) {
  return {
    px: ((x - bounds.xMin) / (bounds.xMax - bounds.xMin)) * width,
    py: height - ((y - bounds.yMin) / (bounds.yMax - bounds.yMin)) * height,
  };
}

function screenToWorld(px, py, bounds, width, height) {
  return {
    x: bounds.xMin + (px / width) * (bounds.xMax - bounds.xMin),
    y: bounds.yMax - (py / height) * (bounds.yMax - bounds.yMin),
  };
}

function drawPlot(canvas, evaluator, bounds, theme, cursor) {
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width));
  const height = Math.max(1, Math.floor(rect.height));
  const ratio = window.devicePixelRatio || 1;

  const isLight = theme === "light";

  const gridColor = isLight
    ? "rgba(15, 23, 42, 0.12)"
    : "rgba(255, 255, 255, 0.1)";

  const axisColor = isLight
    ? "rgba(15, 23, 42, 0.5)"
    : "rgba(255, 255, 255, 0.48)";

  const labelColor = isLight
    ? "rgba(15, 23, 42, 0.62)"
    : "rgba(255, 255, 255, 0.55)";

  const cursorColor = isLight
    ? "rgba(124, 58, 237, 0.35)"
    : "rgba(192, 132, 252, 0.35)";

  const curveColor = isLight ? "#7c3aed" : "#c084fc";
  const curveShadow = isLight
    ? "rgba(124, 58, 237, 0.28)"
    : "rgba(192, 132, 252, 0.5)";

  canvas.width = width * ratio;
  canvas.height = height * ratio;

  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const xStep = getStep(bounds.xMax - bounds.xMin);
  const yStep = getStep(bounds.yMax - bounds.yMin);

  ctx.lineWidth = 1;
  ctx.strokeStyle = gridColor;

  for (let x = Math.ceil(bounds.xMin / xStep) * xStep; x <= bounds.xMax; x += xStep) {
    const { px } = worldToScreen(x, 0, bounds, width, height);
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, height);
    ctx.stroke();
  }

  for (let y = Math.ceil(bounds.yMin / yStep) * yStep; y <= bounds.yMax; y += yStep) {
    const { py } = worldToScreen(0, y, bounds, width, height);
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(width, py);
    ctx.stroke();
  }

  ctx.lineWidth = 1.5;
  ctx.strokeStyle = axisColor;

  const origin = worldToScreen(0, 0, bounds, width, height);
  const axisX = origin.px;
  const axisY = origin.py;

  if (axisY >= 0 && axisY <= height) {
    ctx.beginPath();
    ctx.moveTo(0, axisY);
    ctx.lineTo(width, axisY);
    ctx.stroke();
  }

  if (axisX >= 0 && axisX <= width) {
    ctx.beginPath();
    ctx.moveTo(axisX, 0);
    ctx.lineTo(axisX, height);
    ctx.stroke();
  }

  ctx.fillStyle = labelColor;
  ctx.font = "12px Inter, system-ui, sans-serif";

  for (let x = Math.ceil(bounds.xMin / xStep) * xStep; x <= bounds.xMax; x += xStep) {
    if (Math.abs(x) < 1e-9) continue;

    const { px } = worldToScreen(x, 0, bounds, width, height);
    const labelY = Math.min(Math.max(axisY + 18, 18), height - 8);

    if (px > 6 && px < width - 28) {
      ctx.fillText(Number(x.toFixed(3)), px + 4, labelY);
    }
  }

  for (let y = Math.ceil(bounds.yMin / yStep) * yStep; y <= bounds.yMax; y += yStep) {
    if (Math.abs(y) < 1e-9) continue;

    const { py } = worldToScreen(0, y, bounds, width, height);
    const labelX = Math.min(Math.max(axisX + 8, 8), width - 38);

    if (py > 14 && py < height - 8) {
      ctx.fillText(Number(y.toFixed(3)), labelX, py - 4);
    }
  }

  if (axisX >= 0 && axisX <= width && axisY >= 0 && axisY <= height) {
    ctx.fillText("0", axisX + 6, axisY + 16);
  }

  if (cursor) {
    const { px, py } = worldToScreen(cursor.x, cursor.y, bounds, width, height);

    ctx.lineWidth = 1;
    ctx.strokeStyle = cursorColor;
    ctx.setLineDash([6, 8]);

    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(width, py);
    ctx.stroke();

    ctx.setLineDash([]);
  }

  ctx.lineWidth = 3;
  ctx.strokeStyle = curveColor;
  ctx.shadowColor = curveShadow;
  ctx.shadowBlur = 16;

  let drawing = false;
  let previousY = null;

  ctx.beginPath();

  for (let px = 0; px <= width; px += 1) {
    const world = screenToWorld(px, 0, bounds, width, height);
    const x = world.x;
    const y = evaluator(x);

    if (!Number.isFinite(y)) {
      drawing = false;
      previousY = null;
      continue;
    }

    const { py } = worldToScreen(x, y, bounds, width, height);

    if (Math.abs(py) > height * 6) {
      drawing = false;
      previousY = null;
      continue;
    }

    if (previousY !== null && Math.abs(py - previousY) > height * 0.65) {
      drawing = false;
    }

    if (!drawing) {
      ctx.moveTo(px, py);
      drawing = true;
    } else {
      ctx.lineTo(px, py);
    }

    previousY = py;
  }

  ctx.stroke();
  ctx.shadowBlur = 0;
}

function GraphPanel({ theme }) {
  const canvasRef = useRef(null);
  const dragRef = useRef({
    isDragging: false,
    lastX: 0,
    lastY: 0,
  });

  const [expression, setExpression] = useState("sin(x)");
  const [bounds, setBounds] = useState(defaultBounds);
  const [draftBounds, setDraftBounds] = useState(defaultBounds);
  const [cursor, setCursor] = useState(null);
  const [error, setError] = useState("");

  const boundsRef = useRef(bounds);

  useEffect(() => {
    boundsRef.current = bounds;
  }, [bounds]);

  const evaluator = useMemo(() => {
    try {
      setError("");
      return createEvaluator(expression, "RAD");
    } catch {
      setError("Unable to draw this function.");
      return null;
    }
  }, [expression]);

  useEffect(() => {
    if (!evaluator) return;

    drawPlot(canvasRef.current, evaluator, bounds, theme, cursor);

    function handleResize() {
      drawPlot(canvasRef.current, evaluator, bounds, theme, cursor);
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [evaluator, bounds, theme, cursor]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    function handleNativeWheel(event) {
      event.preventDefault();
      event.stopPropagation();

      const rect = canvas.getBoundingClientRect();
      const rawDelta = event.deltaY;

      if (Math.abs(rawDelta) < 8) {
        return;
      }

      const limitedDelta = Math.max(-50, Math.min(50, rawDelta));
      const zoomStrength = 0.0018;
      const factor = Math.exp(-limitedDelta * zoomStrength);

      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      zoomAtPoint(mouseX, mouseY, factor);
    }

    canvas.addEventListener("wheel", handleNativeWheel, { passive: false });

    return () => {
      canvas.removeEventListener("wheel", handleNativeWheel);
    };
  }, []);

  function updateBounds(nextBounds) {
    setBounds(nextBounds);
    setDraftBounds(nextBounds);
    boundsRef.current = nextBounds;
  }

  function zoomAtPoint(mouseX, mouseY, factor) {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const currentBounds = boundsRef.current;
    const world = screenToWorld(mouseX, mouseY, currentBounds, rect.width, rect.height);

    const nextWidth = (currentBounds.xMax - currentBounds.xMin) / factor;
    const nextHeight = (currentBounds.yMax - currentBounds.yMin) / factor;

    const xRatio = (world.x - currentBounds.xMin) / (currentBounds.xMax - currentBounds.xMin);
    const yRatio = (world.y - currentBounds.yMin) / (currentBounds.yMax - currentBounds.yMin);

    updateBounds({
      xMin: world.x - nextWidth * xRatio,
      xMax: world.x + nextWidth * (1 - xRatio),
      yMin: world.y - nextHeight * yRatio,
      yMax: world.y + nextHeight * (1 - yRatio),
    });
  }

  function zoomIn() {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    zoomAtPoint(rect.width / 2, rect.height / 2, 1.15);
  }

  function zoomOut() {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    zoomAtPoint(rect.width / 2, rect.height / 2, 1 / 1.15);
  }

  function resetView() {
    updateBounds(defaultBounds);
    setCursor(null);
  }

  function applyRange() {
    const nextBounds = {
      xMin: Number(draftBounds.xMin),
      xMax: Number(draftBounds.xMax),
      yMin: Number(draftBounds.yMin),
      yMax: Number(draftBounds.yMax),
    };

    if (
      !Number.isFinite(nextBounds.xMin) ||
      !Number.isFinite(nextBounds.xMax) ||
      !Number.isFinite(nextBounds.yMin) ||
      !Number.isFinite(nextBounds.yMax) ||
      nextBounds.xMin >= nextBounds.xMax ||
      nextBounds.yMin >= nextBounds.yMax
    ) {
      setError("Invalid axis range.");
      return;
    }

    updateBounds(nextBounds);
    setError("");
  }

  function handleRangeChange(key, value) {
    setDraftBounds((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handlePointerDown(event) {
    const canvas = canvasRef.current;

    if (!canvas) return;

    dragRef.current = {
      isDragging: true,
      lastX: event.clientX,
      lastY: event.clientY,
    };

    canvas.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const currentBounds = boundsRef.current;

    if (dragRef.current.isDragging) {
      const dx = event.clientX - dragRef.current.lastX;
      const dy = event.clientY - dragRef.current.lastY;

      dragRef.current.lastX = event.clientX;
      dragRef.current.lastY = event.clientY;

      const xRange = currentBounds.xMax - currentBounds.xMin;
      const yRange = currentBounds.yMax - currentBounds.yMin;

      const xShift = -(dx / rect.width) * xRange;
      const yShift = (dy / rect.height) * yRange;

      updateBounds({
        xMin: currentBounds.xMin + xShift,
        xMax: currentBounds.xMax + xShift,
        yMin: currentBounds.yMin + yShift,
        yMax: currentBounds.yMax + yShift,
      });

      return;
    }

    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;

    setCursor(screenToWorld(localX, localY, currentBounds, rect.width, rect.height));
  }

  function handlePointerUp(event) {
    dragRef.current.isDragging = false;

    if (canvasRef.current) {
      canvasRef.current.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <section className="graph-card">
      <div className="graph-header">
        <div>
          <p className="eyebrow">Graphing Mode</p>
          <h2>Function Plotter</h2>
        </div>

        <div className="graph-tools">
          <button onClick={zoomIn}>+</button>
          <button onClick={zoomOut}>−</button>
          <button onClick={resetView}>Reset</button>
        </div>
      </div>

      <div className="graph-input-row">
        <span>f(x)</span>
        <input
          value={expression}
          onChange={(event) => setExpression(event.target.value)}
          placeholder="e.g. sin(x), x^2, log(x)"
        />
      </div>

      <div className="graph-presets">
        {presets.map((preset) => (
          <button key={preset} onClick={() => setExpression(preset)}>
            {preset}
          </button>
        ))}
      </div>

      <div className="graph-range-panel">
        <label>
          <span>X min</span>
          <input
            value={draftBounds.xMin}
            onChange={(event) => handleRangeChange("xMin", event.target.value)}
          />
        </label>

        <label>
          <span>X max</span>
          <input
            value={draftBounds.xMax}
            onChange={(event) => handleRangeChange("xMax", event.target.value)}
          />
        </label>

        <label>
          <span>Y min</span>
          <input
            value={draftBounds.yMin}
            onChange={(event) => handleRangeChange("yMin", event.target.value)}
          />
        </label>

        <label>
          <span>Y max</span>
          <input
            value={draftBounds.yMax}
            onChange={(event) => handleRangeChange("yMax", event.target.value)}
          />
        </label>

        <button onClick={applyRange}>Apply range</button>
      </div>

      <div className="graph-canvas-wrapper">
        <canvas
          ref={canvasRef}
          className="graph-canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => setCursor(null)}
        />

        {cursor && (
          <div className="graph-coordinate-pill">
            x: {cursor.x.toFixed(2)} | y: {cursor.y.toFixed(2)}
          </div>
        )}
      </div>

      <div className="graph-footer">
        <span>Drag to pan</span>
        <span>Scroll to zoom</span>
        <span>Move cursor to show coordinates</span>
        <span>RAD graph mode</span>
      </div>

      {error && <p className="graph-error">{error}</p>}
    </section>
  );
}

export default GraphPanel;