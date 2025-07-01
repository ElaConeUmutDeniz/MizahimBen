
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../lib/i18n';
import { getAIAssistantResponse } from '../services/geminiService';
import { AIMessage } from '../types';
import SparklesIcon from './icons/SparklesIcon';
import LoadingSpinner from './LoadingSpinner';

const AIAssistant: React.FC = () => {
    const { t } = useTranslation();
    const [messages, setMessages] = useState<AIMessage[]>([
        { role: 'system', content: t('aiWelcome'), timestamp: new Date().toISOString() }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (prompt?: string) => {
        const userMessage = prompt || input;
        if (!userMessage.trim() || isLoading) return;

        const newMessages: AIMessage[] = [...messages, { role: 'user', content: userMessage, timestamp: new Date().toISOString() }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await getAIAssistantResponse(newMessages, userMessage);
            setMessages(prev => [...prev, { role: 'model', content: response, timestamp: new Date().toISOString() }]);
        } catch (error) {
            console.error("Failed to get AI assistant response:", error);
            const errorMessage = `${t('errorAIAssistant')}\n\n${t('errorInstruction')}`;
            setMessages(prev => [...prev, { role: 'system', content: errorMessage, timestamp: new Date().toISOString() }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePresetPrompt = (promptKey: 'generateJoke' | 'evaluateJoke') => {
        let promptText = t(promptKey);
        if (promptKey === 'evaluateJoke') {
             promptText += ': komik mi?';
        }
        setInput(promptText);
    };

    return (
        <div className="bg-[var(--secondary-bg)] rounded-lg shadow-lg p-4 sm:p-6 max-w-4xl mx-auto border border-[var(--border-color)] flex flex-col h-[75vh]">
            <h2 className="text-2xl font-bold text-center mb-4 flex items-center justify-center text-[color:var(--accent-color)]">
                <SparklesIcon />
                <span className="ml-2">{t('aiAssistant')}</span>
            </h2>
            
            <div className="flex-grow overflow-y-auto pr-4 space-y-4 mb-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                       {msg.role !== 'system' && (
                         <div className={`max-w-lg p-3 rounded-xl ${msg.role === 'user' ? 'bg-[color:var(--accent-color)] text-white' : 'bg-[var(--primary-bg)] text-[var(--primary-text)] shadow-sm'}`}>
                             <p className="whitespace-pre-wrap">{msg.content}</p>
                         </div>
                       )}
                       {msg.role === 'system' && (
                         <div className="text-center w-full text-sm text-[var(--secondary-text)] italic">
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                         </div>
                       )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-[var(--primary-bg)] p-3 rounded-xl shadow-sm">
                            <LoadingSpinner />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex-shrink-0">
                 <div className="flex flex-wrap gap-2 mb-3">
                    <button onClick={() => handlePresetPrompt('generateJoke')} className="px-3 py-1.5 text-sm bg-[var(--primary-bg)] rounded-full shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">{t('generateJoke')}</button>
                    <button onClick={() => handlePresetPrompt('evaluateJoke')} className="px-3 py-1.5 text-sm bg-[var(--primary-bg)] rounded-full shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">{t('evaluateJoke')}</button>
                </div>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={t('typeHere')}
                        className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--primary-bg)] text-[var(--primary-text)] focus:ring-2 focus:ring-[color:var(--accent-color)] focus:outline-none transition"
                        disabled={isLoading}
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={isLoading || !input.trim()}
                        className="px-4 py-2 bg-[color:var(--accent-color)] text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {isLoading ? <LoadingSpinner /> : t('send')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant;
