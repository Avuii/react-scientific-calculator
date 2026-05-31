import { buttonTypes } from "../logic/constants";

function CalcButton({ value, onClick }) {
  const type = buttonTypes[value] || "number";

  return (
    <button className={`calc-button ${type}`} onClick={() => onClick(value)}>
      {value}
    </button>
  );
}

export default CalcButton;