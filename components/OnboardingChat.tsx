
import React, { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon, UserIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { ChatMessage } from '../types';
import { getOnboardingResponse } from '../services/geminiService';

export const OnboardingChat: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        // Start the conversation
        const startConversation = async () => {
            setIsLoading(true);
            const initialMessage = await getOnboardingResponse('');
            setMessages([initialMessage]);
            setIsLoading(false);
        };
        startConversation();
    }, []);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            sender: 'user',
            text: userInput,
        };
        
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        // Simulate API call
        setTimeout(async () => {
            const agentResponse = await getOnboardingResponse(userInput);
            setMessages(prev => [...prev, agentResponse]);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-full p-4 sm:p-6 lg:p-8">
            <header className="mb-6">
                <h2 className="text-3xl font-bold text-white font-orbitron">Guild Registrar</h2>
                <p className="text-gray-400">Forge your Adventurer's Profile to begin your quest.</p>
            </header>
            <div className="flex-1 overflow-y-auto bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'agent' && (
                            <div className="w-8 h-8 bg-gradient-to-br from-fuchsia-600 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <SparklesIcon className="w-5 h-5 text-white" />
                            </div>
                        )}
                        <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'agent' ? 'bg-gray-700 text-gray-200' : 'bg-cyan-600 text-white'}`}>
                           <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                        </div>
                        {msg.sender === 'user' && (
                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <UserIcon className="w-5 h-5 text-white" />
                            </div>
                        )}
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-fuchsia-600 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                                <SparklesIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="max-w-md p-3 rounded-lg bg-gray-700">
                           <div className="flex space-x-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                           </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="mt-6">
                <div className="flex items-center bg-gray-800 rounded-lg border border-gray-700/50 focus-within:ring-2 focus-within:ring-cyan-500 transition-all">
                    <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                handleSendMessage(e);
                                e.preventDefault();
                            }
                        }}
                        placeholder="Speak with the registrar..."
                        className="flex-1 bg-transparent p-3 text-gray-200 focus:outline-none resize-none"
                        rows={1}
                        disabled={isLoading}
                    />
                    <button type="submit" className="p-3 text-gray-400 hover:text-cyan-400 disabled:text-gray-600" disabled={isLoading || !userInput.trim()}>
                        <PaperAirplaneIcon className="w-6 h-6" />
                    </button>
                </div>
            </form>
        </div>
    );
};
