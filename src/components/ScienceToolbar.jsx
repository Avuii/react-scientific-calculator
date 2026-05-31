import { useEffect, useRef, useState } from "react";

const trigonometryOptions = [
  { label: "sin", value: "sin" },
  { label: "cos", value: "cos" },
  { label: "tan", value: "tan" },
];

const functionOptions = [
  { label: "√x", value: "√" },
  { label: "x²", value: "x²" },
  { label: "xʸ", value: "xʸ" },
  { label: "10ˣ", value: "10ˣ" },
  { label: "1/x", value: "1/x" },
  { label: "|x|", value: "|x|" },
  { label: "ln", value: "ln" },
  { label: "log", value: "log" },
  { label: "exp", value: "exp" },
];

function FunctionMenu({ title, options, onInput }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
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

  function handleOptionClick(value) {
    onInput(value);
    setIsOpen(false);
  }

  return (
    <div className={`function-menu ${isOpen ? "open" : ""}`} ref={menuRef}>
      <button
        type="button"
        className="function-menu-trigger"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>
          <small>{title}</small>
          <strong>Select function</strong>
        </span>
        <span className="function-menu-arrow">⌄</span>
      </button>

      {isOpen && (
        <div className="function-menu-list">
          {options.map((option) => (
            <button
              type="button"
              key={option.value}
              className="function-menu-option"
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ScienceToolbar({ onInput }) {
  return (
    <div className="science-toolbar">
      <FunctionMenu
        title="Trigonometry"
        options={trigonometryOptions}
        onInput={onInput}
      />

      <FunctionMenu
        title="Functions"
        options={functionOptions}
        onInput={onInput}
      />
    </div>
  );
}

export default ScienceToolbar;