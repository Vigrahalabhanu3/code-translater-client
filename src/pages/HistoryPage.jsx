// Write your code here
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import HistoryList from '../components/HistoryList.jsx';
import CodeEditor from '../components/CodeEditor.jsx';
import { getHistory, deleteHistoryItem, clearHistory } from '../services/historyService.js';
import '../styles/history.css';

function HistoryPage() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalEntries, setTotalEntries] = useState(0);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const ITEMS_PER_PAGE = 8;

    useEffect(() => { fetchHistory(); }, [currentPage]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const data = await getHistory(currentPage, ITEMS_PER_PAGE);
            setEntries(data.entries);
            setTotalPages(data.totalPages);
            setTotalEntries(data.totalEntries);
        } catch { toast.error('Failed to load history'); }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        try {
            await deleteHistoryItem(id);
            toast.success("Deleted");
            if (selectedEntry?._id === id) setSelectedEntry(null);
            fetchHistory();
        } catch {
            toast.error("Failed to delete");
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm("Delete all history?")) return;
        try {
            const r = await clearHistory();
            toast.success(`Cleared ${r.deletedCount} entries`);
            setEntries([]);
            setTotalEntries(0);
            setTotalPages(0);
            setSelectedEntry(null);
            setCurrentPage(1);
        } catch {
            toast.error("Failed to clear");
        }
    };

    return (
        <div className="history-container">
            <div className="history-sidebar">
                <div className="history-header">
                    <h2>History ({totalEntries})</h2>
                    <button className="clear-all-btn" onClick={handleClearAll} disabled={entries.length === 0}>
                        Clear All
                    </button>
                </div>

                {loading ? (
                    <div className="history-loading">Loading...</div>
                ) : (
                    <>
                        <HistoryList
                            entries={entries}
                            onView={setSelectedEntry}
                            onDelete={handleDelete}
                        />
                        {totalPages > 1 && (
                            <div className="history-pagination">
                                <button
                                    className="page-btn"
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    Prev
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        className={`page-btn ${currentPage === p ? "active" : ""}`}
                                        onClick={() => setCurrentPage(p)}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    className="page-btn"
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="history-detail">
                {selectedEntry ? (
                    <div className="detail-panel">
                        <div className="detail-header">
                            <h3>{selectedEntry.type.toUpperCase()}</h3>
                            <span className="detail-date">
                                {new Date(selectedEntry.createdAt).toLocaleString()}
                            </span>
                        </div>

                        <div className="detail-section">
                            <label>Input Code ({selectedEntry.sourceLanguage})</label>
                            <div className="detail-editor">
                                <CodeEditor
                                    code={selectedEntry.inputCode}
                                    language={selectedEntry.sourceLanguage}
                                    readOnly={true}
                                />
                            </div>
                        </div>

                        <div className="detail-section">
                            <label>
                                {selectedEntry.type === "translate" ? "Translated Result" : "AI Output"}
                            </label>
                            <div className="detail-output-box">
                                {selectedEntry.type === "translate" && (
                                    <div>
                                        <span className="detail-lang-badge">
                                            Target: {selectedEntry.targetLanguage}
                                        </span>
                                        <pre className="detail-code-block">
                                            {selectedEntry.output?.translatedCode}
                                        </pre>
                                    </div>
                                )}
                                {selectedEntry.type === "analyze" && (
                                    <div>
                                        <div className="detail-complexity-row">
                                            <div className="detail-complexity-card">
                                                <div className="detail-complexity-label">Time</div>
                                                <div className="detail-complexity-value">
                                                    {selectedEntry.output?.timeComplexity}
                                                </div>
                                            </div>
                                            <div className="detail-complexity-card">
                                                <div className="detail-complexity-label">Space</div>
                                                <div className="detail-complexity-value">
                                                    {selectedEntry.output?.spaceComplexity}
                                                </div>
                                            </div>
                                        </div>
                                        {selectedEntry.output?.explanation && (
                                            <p className="detail-text">{selectedEntry.output.explanation}</p>
                                        )}
                                    </div>
                                )}
                                {selectedEntry.type === "optimize" && (
                                    <div>
                                        <pre className="detail-code-block">
                                            {selectedEntry.output?.optimizedCode}
                                        </pre>
                                        {selectedEntry.output?.suggestions && (
                                            <p className="detail-text">{selectedEntry.output.suggestions}</p>
                                        )}
                                    </div>
                                )}
                                {selectedEntry.type === "explain" && (
                                    <p className="detail-text">{selectedEntry.output?.explanation}</p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="detail-empty">
                        <p>Select an entry from the list to view details</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HistoryPage;