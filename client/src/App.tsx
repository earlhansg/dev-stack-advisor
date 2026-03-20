import { useState } from "react";
import "./App.css";

type HistoryItem = {
  question: string;
  answer: string;
};

function App() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState<number | null>(null);

  const handleAsk = async () => {
    if(!question.trim()) return;
    setLoading(true);
    setAnswer("");
    setSelectedHistoryIndex(null);
    const currentQuestion = question;
    try {
      console.log("URL", import.meta.env.VITE_API_URL);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let fullAnswer = "";
      while (!done) {
        const { value, done: doneReading } = await reader!.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        fullAnswer += chunkValue;
        // Append the new chunk to the existing answer
        setAnswer((prev) => prev + chunkValue);
      }
      // Save to history
      setHistory((prev) => [...prev, { question: currentQuestion, answer: fullAnswer }]);
    } catch (error) {
      console.error("Error while asking:", error);
      setAnswer("Sorry, something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const displayedAnswer = selectedHistoryIndex !== null ? history[selectedHistoryIndex].answer : answer;
  const displayedQuestion = selectedHistoryIndex !== null ? history[selectedHistoryIndex].question : question;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* History Sidebar */}
      {history.length > 0 && (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <span className="text-sx font-semibold text-gray-400 uppercase tracking-wider">
              History
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {history.map((item, index) => (
              <li key={index}>
                <button className={`w-full text-left px-4 py-3 text-sm truncate hover:bg-gray-50 transition-colors ${selectedHistoryIndex === index ? "bg-blue-50 text-blue-700" : "text-gray-600"}`} onClick={() => setSelectedHistoryIndex(index)}>
                  {item.question}
                </button>
              </li>))}
          </div>
        </aside>
      )}
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">DevStack Advisor</h1>
          <textarea className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ask about tech stack ..." value={question} onChange={(e) => setQuestion(e.target.value)}></textarea>
          <button className={`w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500`} onClick={handleAsk} disabled={loading}>
            {loading ? "Thinking ..." : "Ask"}
          </button>
          <div className="mt-4 p-4 bg-gray-100 rounded-md whitespace-pre-wrap min-h-30">
            {answer || (loading && <span className="animate-pulse">|</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
