import { useState } from "react";
import Display from "./Display";
import CalcButton from "./CalcButton";
import HistoryPanel from "./HistoryPanel";
import ThemeToggle from "./ThemeToggle";
import ScienceToolbar from "./ScienceToolbar";
import GraphPanel from "./GraphPanel";
import { mainButtons, scientificButtons } from "../logic/constants";
import { useCalculator } from "../hooks/useCalculator";
import { useKeyboard } from "../hooks/useKeyboard";
import { useLocalStorage } from "../hooks/useLocalStorage";

function Calculator() {
    const {
        expression,
        result,
        history,
        angleMode,
        handleInput,
        clearHistory,
        useHistoryItem,
        toggleAngleMode,
    } = useCalculator();

    const [theme, setTheme] = useLocalStorage("calculator-theme", "dark");
    const [activeView, setActiveView] = useState("calculator");

    useKeyboard(handleInput);

    function toggleTheme() {
        setTheme((current) => (current === "dark" ? "light" : "dark"));
    }

    return (
        <main className={`app ${theme}`}>
            <div className="background-orb orb-one"></div>
            <div className="background-orb orb-two"></div>
            <div className="background-orb orb-three"></div>

            <section
                className={`calculator-shell ${activeView === "calculator"
                    ? "calculator-shell--compact"
                    : "calculator-shell--wide"
                    }`}
            >
                <div className="top-bar">
                    <div>
                        <p className="eyebrow">React Scientific Calculator</p>
                        <h1>Calculator</h1>
                        <p className="subtitle">Advanced calculations with graphing mode</p>

                    </div>

                    <div className="top-actions">
                        <div className="view-switch">
                            <button
                                className={activeView === "calculator" ? "active" : ""}
                                onClick={() => setActiveView("calculator")}
                            >
                                Calculator
                            </button>
                            <button
                                className={activeView === "graph" ? "active" : ""}
                                onClick={() => setActiveView("graph")}
                            >
                                Graph
                            </button>
                        </div>

                        <button className="mode-button" onClick={toggleAngleMode}>
                            {angleMode}
                        </button>

                        <ThemeToggle theme={theme} onToggle={toggleTheme} />
                    </div>
                </div>

                {activeView === "calculator" ? (
                    <div className="calculator-layout">
                        <section className="calculator-card">
                            <Display expression={expression} result={result} />

                            <ScienceToolbar onInput={handleInput} />

                            <div className="scientific-grid">
                                {scientificButtons.map((button) => (
                                    <CalcButton key={button} value={button} onClick={handleInput} />
                                ))}
                            </div>

                            <div className="main-grid">
                                {mainButtons.map((button) => (
                                    <CalcButton key={button} value={button} onClick={handleInput} />
                                ))}
                            </div>
                        </section>

                        <HistoryPanel
                            history={history}
                            onUseItem={useHistoryItem}
                            onClear={clearHistory}
                        />
                    </div>
                ) : (
                    <GraphPanel theme={theme} />
                )}
            </section>
        </main>
    );
}

export default Calculator;