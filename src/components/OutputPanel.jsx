// Write your code here
import CodeEditor from "./CodeEditor.jsx";
import "../styles/output.css";

function OutputPanel({ result, action, targetLanguage }) {
    if (!result) {
        return (
            <div className="empty-state">
                <p>
                    Write code, pick an action, and hit <span>Run</span>
                </p>
            </div>
        );
    }

    if (action === "translate") {
        return (
            <div className="output-full-height">
                <CodeEditor
                    code={result.translatedCode || ""}
                    onChange={() => { }}
                    language={targetLanguage}
                    readOnly
                />
            </div>
        );
    }

    if (action === "analyze") {
        return (
            <div className="output-cards">
                <div className="output-cards-row">
                    <InfoCard label="Time" value={result.timeComplexity || "N/A"} />
                    <InfoCard label="Space" value={result.spaceComplexity || "N/A"} />
                </div>
                {result.explanation && (
                    <p className="output-explanation">{result.explanation}</p>
                )}
            </div>
        );
    }

    if (action === "optimize") {
        return (
            <div className="output-flex-col">
                <div className="output-editor-area">
                    <CodeEditor
                        code={result.optimizedCode || ""}
                        onChange={() => { }}
                        language={targetLanguage}
                        readOnly
                    />
                </div>
                {result.suggestions && (
                    <div className="output-suggestions">
                        <div className="output-suggestions-label">Suggestions</div>
                        <p>{result.suggestions}</p>
                    </div>
                )}
            </div>
        );
    }

    if (action === "explain") {
        return (
            <div className="output-cards">
                <p className="output-explanation">{result.explanation}</p>
            </div>
        );
    }

    return null;
}

function InfoCard({ label, value }) {
    return (
        <div className="info-card">
            <div className="info-card-label">{label}</div>
            <div className="info-card-value">{value}</div>
        </div>
    );
}

export default OutputPanel;