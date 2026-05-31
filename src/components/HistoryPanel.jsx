function HistoryPanel({ history, onUseItem, onClear }) {
  return (
    <aside className="history-panel">
      <div className="history-header">
        <h2>History</h2>
        <button onClick={onClear}>Clear</button>
      </div>

      <div className="history-list">
        {history.length === 0 ? (
          <p className="empty-history">No calculations yet.</p>
        ) : (
          history.map((item, index) => (
            <button
              key={`${item.expression}-${index}`}
              className="history-item"
              onClick={() => onUseItem(item)}
            >
              <span>{item.expression}</span>
              <strong>{item.result}</strong>
              <small>{item.date}</small>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}

export default HistoryPanel;