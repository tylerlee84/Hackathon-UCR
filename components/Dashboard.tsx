import React, { useState, useEffect } from 'react';
import { UserCircleIcon, SparklesIcon, CalendarDaysIcon, GlobeAltIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import type { UserProfile as UserProfileType } from '../types';
import { GoogleGenAI, Type } from '@google/genai';

const UserProfile: React.FC<{ profile: UserProfileType | null }> = ({ profile }) => (
    <div className="glass-pane rounded-xl p-6 flex items-center space-x-6">
        <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-fuchsia-600/20 to-cyan-500/20 flex items-center justify-center ring-2 ring-white/10">
              <UserCircleIcon className="w-16 h-16 text-cyan-300" />
            </div>
            <span className="absolute bottom-1 right-1 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-gray-800">Online</span>
        </div>
        <div>
            <h3 className="font-bold text-xl text-white font-orbitron">Operator</h3>
            <p className="text-sm text-cyan-300">{profile?.passion || 'Adept of the Biotech, Life Science VC'}</p>
            <p className="text-xs text-gray-400 mt-1">{profile ? `Objective: ${profile.story.substring(0, 40)}...` : 'Classification: Hyper-Specific'}</p>
        </div>
    </div>
);

const SkeletonLoader: React.FC<{ count?: number }> = ({ count = 3 }) => (
    <div className="space-y-4 animate-pulse">
        <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-700/50 rounded-lg"></div>
            ))}
        </div>
    </div>
);

const DailyBriefing: React.FC<{
    summary: string | null;
    events: any[];
    suggestedTasks: any[];
    isLoading: boolean;
}> = ({ summary, events, suggestedTasks, isLoading }) => (
    <div className="glass-pane rounded-xl p-6 h-full">
        <div className="flex items-center mb-4">
            <DocumentTextIcon className="w-6 h-6 mr-3 text-cyan-400" />
            <h3 className="font-bold text-lg text-white font-orbitron">
                Daily Briefing
            </h3>
        </div>
        {isLoading ? <SkeletonLoader /> : (
            <div>
                <p className="text-sm text-gray-300 mb-6 italic">{summary}</p>

                <h4 className="font-semibold text-base mb-3 text-white flex items-center">
                    <CalendarDaysIcon className="w-5 h-5 mr-2 text-cyan-400" />
                    Scheduled Events
                </h4>
                <div className="space-y-3 mb-6">
                    {events.map((event, index) => (
                        <div key={index} className="bg-gray-900/50 p-3 rounded-lg flex items-center space-x-3 hover:bg-gray-800/60 transition-colors">
                            <div className="flex flex-col items-center justify-center w-20 text-center bg-black/20 p-1 rounded-md">
                                <span className="text-xs text-cyan-400 font-bold">{new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                <span className="text-xs text-gray-500">to</span>
                                <span className="text-xs text-gray-400">{new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                            </div>
                            <div>
                                <h4 className="text-white font-semibold text-sm">{event.summary}</h4>
                                <p className="text-xs text-gray-400 flex items-center mt-1"><ClockIcon className="w-3 h-3 mr-1" /> {event.source}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <h4 className="font-semibold text-base mb-3 text-white flex items-center">
                    <SparklesIcon className="w-5 h-5 mr-2 text-fuchsia-400" />
                    AI Suggested Tasks
                </h4>
                <div className="space-y-3">
                    {suggestedTasks.map((task, index) => (
                         <div key={index} className="bg-gray-900/50 p-3 rounded-lg group hover:bg-gray-700/50 transition-colors border-l-2 border-fuchsia-500/50">
                             <h4 className="font-semibold text-sm text-white">{task.title}</h4>
                             <p className="text-xs text-gray-400 mt-1">{task.reason}</p>
                         </div>
                    ))}
                </div>
            </div>
        )}
    </div>
);

const NewsFeed: React.FC<{ articles: any[]; isLoading: boolean; }> = ({ articles, isLoading }) => (
    <div className="glass-pane rounded-xl p-6 h-full">
        <h3 className="font-bold text-lg mb-4 text-white font-orbitron flex items-center">
            <GlobeAltIcon className="w-5 h-5 mr-2 text-fuchsia-400" />
            Intel Feed
        </h3>
         {isLoading ? <SkeletonLoader /> : (
            <div className="space-y-4">
                {articles.map((article, index) => (
                    <div key={index} className="bg-gray-900/50 p-3 rounded-lg group hover:bg-gray-700/50 transition-colors">
                         <a href={article.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-sm text-white group-hover:text-cyan-400 transition-colors">{article.title}</a>
                         <p className="text-xs text-gray-500 mt-1 mb-2">{article.source}</p>
                         <div className="flex items-start text-xs text-gray-300 border-l-2 border-fuchsia-500/50 pl-2">
                             <SparklesIcon className="w-4 h-4 mr-1.5 flex-shrink-0 text-fuchsia-400" />
                             <p><span className="font-bold text-fuchsia-400">Relevance:</span> {article.relevance}</p>
                         </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);

export const Dashboard: React.FC<{ userProfile: UserProfileType | null }> = ({ userProfile }) => {
    const [dailyBriefing, setDailyBriefing] = useState<{ summary: string | null; events: any[] }>({ summary: null, events: [] });
    const [suggestedTasks, setSuggestedTasks] = useState<any[]>([]);
    const [newsArticles, setNewsArticles] = useState<any[]>([]);
    const [isBriefingLoading, setIsBriefingLoading] = useState(true);
    const [isNewsLoading, setIsNewsLoading] = useState(true);

    useEffect(() => {
        if (!userProfile) return;

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const fetchBriefing = async () => {
            setIsBriefingLoading(true);

            const passion = userProfile.passion;
            const story = userProfile.story;
            const rituals = userProfile.rituals;

            // Mock existing events until ICS parsing is implemented
            const now = new Date();
            const mockEvents = [
                { summary: 'Biomechanics Midterm', start: new Date(now.setHours(9, 0, 0)).toISOString(), end: new Date(now.setHours(11, 0, 0)).toISOString(), source: 'Canvas' },
                { summary: 'Sync with Dr. Evans', start: new Date(now.setHours(13, 0, 0)).toISOString(), end: new Date(now.setHours(13, 30, 0)).toISOString(), source: 'Google Calendar' },
            ];

            const briefingPrompt = `Based on my user profile: Passion - ${passion}, Goal - ${story}, Daily Rituals - ${rituals}. And my current schedule today: ${JSON.stringify(mockEvents)}. Please generate a concise, encouraging, one-paragraph daily briefing summary and suggest 3 actionable tasks for a to-do list that will help me achieve my main goal. The tasks should be distinct from my existing calendar events and rituals.`;

            const briefingSchema = {
                type: Type.OBJECT,
                properties: {
                    summary: { type: Type.STRING, description: "A short, one-paragraph summary for the day." },
                    suggested_tasks: {
                        type: Type.ARRAY,
                        description: "A list of exactly 3 suggested tasks.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING, description: "The task title." },
                                reason: { type: Type.STRING, description: "A brief reason why this task is important for the user's goal." },
                            },
                        },
                    },
                },
                required: ["summary", "suggested_tasks"],
            };

            try {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: briefingPrompt,
                    config: {
                        responseMimeType: 'application/json',
                        responseSchema: briefingSchema,
                    },
                });
                
                const data = JSON.parse(response.text);
                setDailyBriefing({ summary: data.summary, events: mockEvents.map(e => ({...e, start: new Date(e.start), end: new Date(e.end)})) });
                setSuggestedTasks(data.suggested_tasks || []);
            } catch (error) {
                console.error("Error fetching daily briefing:", error);
                setDailyBriefing({ summary: "Could not generate briefing. An error occurred.", events: mockEvents.map(e => ({...e, start: new Date(e.start), end: new Date(e.end)})) });
            } finally {
                setIsBriefingLoading(false);
            }
        };

        const fetchNews = async () => {
            setIsNewsLoading(true);
            const passion = userProfile.passion;
            const story = userProfile.story;

            const newsPrompt = `Acting as an intelligence analyst, find the 3 most recent and relevant articles for me based on my profile: I am passionate about "${passion}" and my goal is to "${story}". For each article, provide a title and a "relevance" analysis explaining in one sentence why it's critical for me. Format each as: "Title: [Title]\nRelevance: [Relevance Analysis]" separated by "---".`;

            try {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: newsPrompt,
                    config: {
                        tools: [{ googleSearch: {} }],
                    },
                });

                const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
                const textResponse = response.text;
                
                const articles = textResponse.split('---').map((entry, index) => {
                    const titleMatch = entry.match(/Title: (.*)/);
                    const relevanceMatch = entry.match(/Relevance: (.*)/);
                    
                    if (titleMatch && relevanceMatch) {
                        const sourceInfo = groundingChunks[index]?.web;
                        return {
                            title: titleMatch[1].trim(),
                            relevance: relevanceMatch[1].trim(),
                            url: sourceInfo?.uri || '#',
                            source: sourceInfo?.title || new URL(sourceInfo?.uri || 'https://google.com').hostname,
                        };
                    }
                    return null;
                }).filter(Boolean);
                
                setNewsArticles(articles);

            } catch (error) {
                console.error("Error fetching news feed:", error);
                setNewsArticles([{ title: "Could not fetch intel feed.", relevance: "An error occurred.", url: "#", source: "System" }]);
            } finally {
                setIsNewsLoading(false);
            }
        };

        fetchBriefing();
        fetchNews();

    }, [userProfile]);

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-white font-orbitron">System Status</h2>
                <p className="text-gray-400">Your directives and data streams for this cycle, Operator.</p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3">
                    <UserProfile profile={userProfile} />
                </div>
                <div className="lg:col-span-2">
                    <DailyBriefing 
                        summary={dailyBriefing.summary} 
                        events={dailyBriefing.events} 
                        suggestedTasks={suggestedTasks}
                        isLoading={isBriefingLoading} 
                    />
                </div>
                <div>
                    <NewsFeed articles={newsArticles} isLoading={isNewsLoading} />
                </div>
            </div>
        </div>
    );
};