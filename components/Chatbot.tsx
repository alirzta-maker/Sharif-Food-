import React, { useState, useEffect, useRef, useContext } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AppContext } from '../App';
import { useTranslation } from '../i18n';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

interface ChatbotProps {
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
  const { t, direction } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Create GoogleGenAI instance right before making an API call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userMessage.text,
      });

      const aiText = response.text || t('error_ai_response');
      setMessages((prev) => [...prev, { sender: 'ai', text: aiText }]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: String(t('error_ai_response')) },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      dir={direction}
    >
      <div className="relative w-full max-w-md h-full max-h-[80vh] bg-sharif-yellow border-3 border-black rounded-5xl shadow-study flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-3 border-black bg-white rounded-t-4xl">
          <h2 className="text-xl font-bold">{t('chatbot')}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black text-3xl font-bold bouncy-button"
            aria-label={String(t('close'))}
          >
            &times;
          </button>
        </div>

        {/* Chat Messages */}
        <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-3xl border-2 border-black shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-sharif-gir text-white'
                    : 'bg-white text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[75%] p-3 rounded-3xl border-2 border-black shadow-sm bg-white text-gray-800 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                <span>{t('waiting_for_response')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="flex p-4 border-t-3 border-black bg-white rounded-b-4xl">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={String(t('type_message'))}
            className="flex-grow p-3 bg-gray-100 border-2 border-black rounded-full focus:outline-none focus:ring-2 ring-sharif-gir mr-2"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-sharif-gir text-white w-12 h-12 rounded-full text-2xl font-bold border-2 border-black bouncy-button flex-shrink-0 flex items-center justify-center"
            disabled={isLoading}
            aria-label={String(t('send'))}
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;