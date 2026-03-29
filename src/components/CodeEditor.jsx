// Write your code here
import Editor from "@monaco-editor/react";
import { MONACO_LANGUAGE_MAP } from "../constants/languages.js";

function CodeEditor({ code, onChange, language, readOnly = false }) {
    return (
        <Editor
            height="100%"
            language={MONACO_LANGUAGE_MAP[language] || "plaintext"}
            value={code}
            onChange={(v) => onChange(v || "")}
            theme="vs-dark"
            options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: "on",
                readOnly,
                padding: { top: 14, bottom: 14 },
                automaticLayout: true,
                tabSize: 2,
                lineNumbers: "on",
                renderLineHighlight: "all",
                bracketPairColorization: { enabled: true },
                autoClosingBrackets: "always",
                autoClosingQuotes: "always",
                matchBrackets: "always",
                formatOnPaste: true,
                suggestOnTriggerCharacters: true,
                folding: true,
                smoothScrolling: true,
                fixedOverflowWidgets: true,
            }}
            loading={
                <div className="loading-state">
                    <p>Loading editor...</p>
                </div>
            }
        />
    );
}

export default CodeEditor;