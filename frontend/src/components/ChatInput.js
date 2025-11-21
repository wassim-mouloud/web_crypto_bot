import { useState } from 'react';
import './ChatInput.css';

function ChatInput({ onSubmit, isLoading }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="chat-input"
        placeholder="Ask me anything! (e.g., 'bitcoin price', 'show me top 10', 'what is ethereum')..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isLoading}
      />
      <button
        type="submit"
        className="chat-submit-btn"
        disabled={isLoading || !input.trim()}
      >
        {isLoading ? '⏳ Loading...' : '🚀 Get Price'}
      </button>
    </form>
  );
}

export default ChatInput;
