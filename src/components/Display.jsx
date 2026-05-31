function Display({ expression, result }) {
  return (
    <div className="display">
      <div className="display-expression">
        {expression || "Ready"}
      </div>
      <div className="display-result">
        {result}
      </div>
    </div>
  );
}

export default Display;