import "../styles/history.css";

function HistoryList({ entries, onView, onDelete }) {
  if (entries.length === 0) {
    return <div className="history-empty">No history yet</div>;
  }

  return (
    <div>
      {entries.map((entry) => (
        <div
          key={entry._id}
          className="history-item"
          onClick={() => onView(entry)}
        >
          <div className="history-item-left">
            <span className="history-item-type">{entry.type}</span>
            <span className="history-item-langs">
              {entry.sourceLanguage}
              {entry.targetLanguage && ` → ${entry.targetLanguage}`}
            </span>
          </div>
          <div className="history-item-right">
            <span className="history-item-date">
              {new Date(entry.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
            <button
              className="history-item-delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(entry._id);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HistoryList;