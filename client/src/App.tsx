import { useState } from "react";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");

  const handleAsk = async () => {
    setLoading(true);
    setAnswer("");
    // Simulate an API call
    setTimeout(() => {
      setAnswer("This is a simulated answer to your question.");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">DevStack Advisor</h1>
        <textarea className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ask about tech stack ..." value={question} onChange={(e) => setQuestion(e.target.value)}></textarea>
        <button className={`w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500`} onClick={handleAsk} disabled={loading}>
          {loading ? "Thinking ..." : "Ask"}
        </button>
        {answer && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h2 className="text-lg font-semibold mb-2">Answer:</h2>
            <p>{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
