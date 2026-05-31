import { useEffect, useMemo, useRef, useState } from "react";

const converterGroups = {
  length: {
    label: "Length",
    units: {
      mm: 0.001,
      cm: 0.01,
      m: 1,
      km: 1000,
      inch: 0.0254,
      ft: 0.3048,
      mile: 1609.344,
    },
  },
  mass: {
    label: "Mass",
    units: {
      mg: 0.000001,
      g: 0.001,
      kg: 1,
      t: 1000,
      oz: 0.0283495,
      lb: 0.453592,
    },
  },
  temperature: {
    label: "Temperature",
    units: {
      "°C": "celsius",
      "°F": "fahrenheit",
      K: "kelvin",
    },
  },
  time: {
    label: "Time",
    units: {
      ms: 0.001,
      s: 1,
      min: 60,
      h: 3600,
      day: 86400,
    },
  },
  data: {
    label: "Data",
    units: {
      B: 1,
      KB: 1024,
      MB: 1024 ** 2,
      GB: 1024 ** 3,
      TB: 1024 ** 4,
    },
  },
  speed: {
    label: "Speed",
    units: {
      "m/s": 1,
      "km/h": 1000 / 3600,
      mph: 1609.344 / 3600,
      knot: 1852 / 3600,
    },
  },
};

function convertTemperature(value, from, to) {
  let celsius = value;

  if (from === "°F") celsius = ((value - 32) * 5) / 9;
  if (from === "K") celsius = value - 273.15;

  if (to === "°C") return celsius;
  if (to === "°F") return (celsius * 9) / 5 + 32;
  if (to === "K") return celsius + 273.15;

  return celsius;
}

function formatConvertedValue(value) {
  if (!Number.isFinite(value)) return "—";

  if ((Math.abs(value) >= 1e9 || Math.abs(value) < 1e-6) && value !== 0) {
    return value.toExponential(6);
  }

  return Number(value.toPrecision(10)).toString();
}

function UnitDropdown({ label, value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function chooseOption(option) {
    onChange(option);
    setIsOpen(false);
  }

  return (
    <div className={`converter-dropdown ${isOpen ? "open" : ""}`} ref={dropdownRef}>
      <button
        type="button"
        className="converter-dropdown-trigger"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>
          <small>{label}</small>
          <strong>{value}</strong>
        </span>
        <span className="converter-dropdown-arrow">⌄</span>
      </button>

      {isOpen && (
        <div className="converter-dropdown-list">
          {options.map((option) => (
            <button
              type="button"
              key={option}
              className={option === value ? "converter-dropdown-option active" : "converter-dropdown-option"}
              onClick={() => chooseOption(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ConverterPanel() {
  const [groupKey, setGroupKey] = useState("length");
  const [inputValue, setInputValue] = useState("1");

  const group = converterGroups[groupKey];
  const unitNames = Object.keys(group.units);

  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");

  function changeGroup(nextGroupKey) {
    const nextUnits = Object.keys(converterGroups[nextGroupKey].units);

    setGroupKey(nextGroupKey);
    setFromUnit(nextUnits[0]);
    setToUnit(nextUnits[1] || nextUnits[0]);
  }

  const result = useMemo(() => {
    const numericValue = Number(String(inputValue).replace(",", "."));

    if (!Number.isFinite(numericValue)) return "—";

    if (groupKey === "temperature") {
      return formatConvertedValue(
        convertTemperature(numericValue, fromUnit, toUnit)
      );
    }

    const baseValue = numericValue * group.units[fromUnit];
    const convertedValue = baseValue / group.units[toUnit];

    return formatConvertedValue(convertedValue);
  }, [inputValue, groupKey, group, fromUnit, toUnit]);

  function swapUnits() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }

  return (
    <section className="converter-card">
      <div className="converter-header">
        <div>
          <p className="eyebrow">Conversion Mode</p>
          <h2>Unit Converter</h2>
        </div>
      </div>

      <div className="converter-layout">
        <aside className="converter-sidebar">
          {Object.entries(converterGroups).map(([key, item]) => (
            <button
              key={key}
              className={groupKey === key ? "active" : ""}
              onClick={() => changeGroup(key)}
            >
              {item.label}
            </button>
          ))}
        </aside>

        <div className="converter-main">
          <div className="converter-input-card">
            <label>Value</label>
            <input
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              inputMode="decimal"
              placeholder="Enter value"
            />
          </div>

          <div className="converter-units">
            <UnitDropdown
              label="From unit"
              value={fromUnit}
              options={unitNames}
              onChange={setFromUnit}
            />

            <button className="converter-swap" onClick={swapUnits}>
              ⇄
            </button>

            <UnitDropdown
              label="To unit"
              value={toUnit}
              options={unitNames}
              onChange={setToUnit}
            />
          </div>

          <div className="converter-result">
            <span>Result</span>
            <strong>{result}</strong>
            <small>
              {inputValue || "0"} {fromUnit} = {result} {toUnit}
            </small>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ConverterPanel;