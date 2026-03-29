// Write your code here
import { useState } from 'react';
import toast from 'react-hot-toast';
import CodeEditor from '../components/CodeEditor.jsx';
import OutputPanel from '../components/OutputPanel.jsx';
import LanguageSelector from '../components/LanguageSelector.jsx';
import { STARTER_CODE } from '../constants/languages.js';
import { translateCode, analyzeComplexity, optimizeCode, explainCode } from '../services/codeService.js';
import '../styles/home.css';

const ACTIONS = ['translate', 'analyze', 'optimize', 'explain'];

function HomePage() {
    const [code, setCode] = useState(STARTER_CODE.python);
    const [sourceLanguage, setSourceLanguage] = useState('python');
    const [targetLanguage, setTargetLanguage] = useState('java');
    const [activeAction, setActiveAction] = useState('translate');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);


    const handleSourceChange = (langId) => {
        setSourceLanguage(langId);
        if (STARTER_CODE[langId]) setCode(STARTER_CODE[langId]);
        setResult(null);
    };
    const handleSwap = () => {
        if (activeAction !== "translate") return;
        setSourceLanguage(targetLanguage);
        setTargetLanguage(sourceLanguage);
        if (result?.translatedCode) {
            setCode(result.translatedCode);
            setResult(null);
        }
    };

    const handleCopy = async () => {
        if (!result) return;
        let text = "";
        if (activeAction === "translate") text = result.translatedCode || "";
        else if (activeAction === "optimize") text = result.optimizedCode || "";
        else if (activeAction === "explain") text = result.explanation || "";
        else if (activeAction === "analyze")
            text = `Time: ${result.timeComplexity}\nSpace: ${result.spaceComplexity}\n\n${result.explanation || ""}`;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy");
        }
    };
    const handleRun = async () => {
        if (!code.trim()) return toast.error("Please write some code first.");
        if (!sourceLanguage) return toast.error("Select a source language.");
        if (activeAction === "translate" && !targetLanguage)
            return toast.error("Select a target language.");

        setLoading(true);
        setResult(null);
        try {
            const fns = {
                translate: () => translateCode(code, sourceLanguage, targetLanguage),
                analyze: () => analyzeComplexity(code, sourceLanguage),
                optimize: () => optimizeCode(code, sourceLanguage),
                explain: () => explainCode(code, sourceLanguage),
            };
            setResult(await fns[activeAction]());
            toast.success("Done!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="home">
            {/* Toolbar with action tabs and run button */}
            <div className="toolbar">
                <div className="action-tabs">
                    {ACTIONS.map((a) => (
                        <button
                            key={a}
                            className={`action-tab ${activeAction === a ? "active" : ""}`}
                            onClick={() => {
                                setActiveAction(a);
                                setResult(null);
                            }}
                        >
                            {a}
                        </button>
                    ))}
                </div>
                <button className="run-btn" onClick={handleRun} disabled={loading}>
                    {loading ? "Running..." : "Run"}
                </button>
            </div>

            {/* Two-panel layout: Source and Output */}
            <div className="panels">
                <div className="panel">
                    <div className="panel-header">
                        <div className="panel-header-left">
                            <span className="panel-label">Source</span>
                            <LanguageSelector
                                value={sourceLanguage}
                                onChange={handleSourceChange}
                            />
                        </div>
                        <button className="clear-btn" onClick={() => setCode("")}>
                            Clear
                        </button>
                    </div>
                    <div className="panel-body">
                        <CodeEditor
                            code={code}
                            onChange={setCode}
                            language={sourceLanguage}
                        />
                    </div>
                </div>

                <div className="swap-area">
                    {activeAction === "translate" ? (
                        <button
                            className="swap-btn"
                            onClick={handleSwap}
                            title="Swap languages"
                        >
                            &#8644;
                        </button>
                    ) : (
                        <span className="swap-arrow">&#8594;</span>
                    )}
                </div>

                <div className="panel">
                    <div className="panel-header">
                        <div className="panel-header-left">
                            <span className="panel-label">
                                {activeAction === "translate" ? "Target" : "Output"}
                            </span>
                            {activeAction === "translate" && (
                                <LanguageSelector
                                    value={targetLanguage}
                                    onChange={setTargetLanguage}
                                />
                            )}
                            {result && activeAction !== "translate" && (
                                <span className="action-badge">{activeAction}</span>
                            )}
                        </div>
                        {result && (
                            <button className="copy-btn" onClick={handleCopy}>
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        )}
                    </div>
                    <div className="panel-body">
                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner" />
                                <p>Processing...</p>
                            </div>
                        ) : (
                            <OutputPanel
                                result={result}
                                action={activeAction}
                                targetLanguage={
                                    activeAction === "translate" ? targetLanguage : sourceLanguage
                                }
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;