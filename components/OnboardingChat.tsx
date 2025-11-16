import React, { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon, UserIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { ChatMessage, UserProfile } from '../types';
import { getOnboardingResponse, nextOnboardingState, OnboardingState } from '../services/geminiService';

const MessageBubble: React.FC<{ msg: ChatMessage }> = ({ msg }) => {
    const isAgent = msg.sender === 'agent';
    
    return (
        <div className={`flex items-start gap-3 ${!isAgent ? 'justify-end' : ''} animate-fade-in-up`}>
            {isAgent && (
                <div className="w-8 h-8 bg-gradient-to-br from-fuchsia-600 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-white/10">
                    <SparklesIcon className="w-5 h-5 text-white" />
                </div>
            )}
            <div className={`max-w-md p-3.5 rounded-2xl shadow-lg ${isAgent ? 'bg-gray-700/80 text-gray-200 rounded-tl-none' : 'bg-cyan-600 text-white rounded-br-none'}`}>
                <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
            </div>
            {!isAgent && (
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-white/10">
                    <UserIcon className="w-5 h-5 text-white" />
                </div>
            )}
        </div>
    );
};


export const OnboardingChat: React.FC<{onOnboardingComplete: (profile: UserProfile) => void}> = ({ onOnboardingComplete }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversationState, setConversationState] = useState<OnboardingState>('START');
    const [profileData, setProfileData] = useState<Partial<UserProfile>>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages, isLoading]);

    useEffect(() => {
        // Start the conversation
        setIsLoading(true);
        setTimeout(() => {
            setMessages([getOnboardingResponse('START')]);
            setConversationState(nextOnboardingState['START']);
            setIsLoading(false);
        }, 500);
    }, []);

    const handleSendMessage = async (e: React.FormEvent | React.KeyboardEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            sender: 'user',
            text: userInput,
        };
        
        setMessages(prev => [...prev, userMessage]);
        const currentInput = userInput;
        setUserInput('');
        setIsLoading(true);

        // 1. Update profile data based on the question the user just answered
        const updatedProfile = { ...profileData };
        switch(conversationState) {
            case 'AWAITING_STORY':
                updatedProfile.story = currentInput;
                break;
            case 'AWAITING_PASSION':
                updatedProfile.passion = currentInput;
                break;
            case 'AWAITING_ICS':
                updatedProfile.ics = currentInput;
                break;
            case 'AWAITING_RITUALS':
                updatedProfile.rituals = currentInput;
                break;
        }
        setProfileData(updatedProfile);

        // 2. Determine next state
        const nextState = nextOnboardingState[conversationState];
        
        // 3. Get and show agent's response
        setTimeout(() => {
            const agentResponse = getOnboardingResponse(nextState);
            setMessages(prev => [...prev, agentResponse]);
            setIsLoading(false);
            
            // 4. Advance state for the *next* user input
            setConversationState(nextState);

            // 5. Check for completion
            if (nextState === 'DONE') {
                // Call complete with a small delay to allow the final message to be seen
                setTimeout(() => onOnboardingComplete(updatedProfile as UserProfile), 2000);
            }
        }, 1200);
    };

    return (
        <div className="flex flex-col h-full p-4 sm:p-6 lg:p-8">
            <header className="mb-6">
                <h2 className="text-3xl font-bold text-white font-orbitron">AI Synchronizer</h2>
                <p className="text-gray-400">Calibrate your Operator Profile to begin.</p>
            </header>
            <div className="flex-1 overflow-y-auto glass-pane rounded-xl p-4 space-y-6">
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} msg={msg} />
                ))}
                 {isLoading && (
                    <div className="flex items-start gap-3 animate-fade-in-up">
                        <div className="w-8 h-8 bg-gradient-to-br from-fuchsia-600 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse ring-2 ring-white/10">
                                <SparklesIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="max-w-md p-3.5 rounded-2xl rounded-tl-none bg-gray-700/80">
                           <div className="flex space-x-1.5">
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
                <div className="flex items-center glass-pane rounded-lg focus-within:ring-2 focus-within:ring-cyan-500 transition-all">
                    <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                handleSendMessage(e);
                                e.preventDefault();
                            }
                        }}
                        placeholder="Transmit message..."
                        className="flex-1 bg-transparent p-3 text-gray-200 focus:outline-none resize-none"
                        rows={1}
                        disabled={isLoading || conversationState === 'DONE'}
                    />
                    <button type="submit" className="p-3 text-gray-400 hover:text-cyan-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors" disabled={isLoading || !userInput.trim() || conversationState === 'DONE'}>
                        <PaperAirplaneIcon className="w-6 h-6" />
                    </button>
                </div>
            </form>
        </div>
    );
};