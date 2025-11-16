import React, { useState, useEffect } from 'react';
import { UserCircleIcon, SparklesIcon, CalendarDaysIcon, GlobeAltIcon, ClockIcon } from '@heroicons/react/24/solid';
import type { UserProfile as UserProfileType } from '../types';

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

const SkeletonLoader: React.FC = () => (
    <div className="space-y-4 animate-pulse">
        <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
        <div className="space-y-3">
            <div className="h-12 bg-gray-700/50 rounded-lg"></div>
            <div className="h-12 bg-gray-700/50 rounded-lg"></div>
            <div className="h-12 bg-gray-700/50 rounded-lg w-5/6"></div>
        </div>
    </div>
);

const DailyBriefing: React.FC<{
    summary: string | null;
    events: any[];
    isLoading: boolean;
}> = ({ summary, events, isLoading }) => (
    <div className="glass-pane rounded-xl p-6 h-full">
        <h3 className="font-bold text-lg mb-4 text-white font-orbitron flex items-center">
            <CalendarDaysIcon className="w-5 h-5 mr-2 text-cyan-400" />
            Daily Briefing
        </h3>
        {isLoading ? <SkeletonLoader /> : (
            <div>
                <p className="text-sm text-gray-300 mb-4 italic">{summary}</p>
                <div className="space-y-3">
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
                             <p><span className="font-bold text-fuchsia-400">Relevance Analysis:</span> {article.relevance}</p>
                         </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);

export const Dashboard: React.FC<{ userProfile: UserProfileType | null }> = ({ userProfile }) => {
    const [dailyBriefing, setDailyBriefing] = useState<{ summary: string | null; events: any[] }>({ summary: null, events: [] });
    const [newsArticles, setNewsArticles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAndProcessData = async () => {
            setIsLoading(true);

            // Use sane defaults if profile is not complete for some reason
            const passion = userProfile?.passion || 'Biotech, Life Science VC';
            const story = userProfile?.story || 'Become a Technical Advisor for a VC firm';
            const rituals = userProfile?.rituals || 'Physical conditioning for 1 hour';

            // 1. Mock raw data fetching, now more dynamic
            const now = new Date();
            const mockEvents = [
                { summary: 'Biomechanics Midterm', start: new Date(now).setHours(9, 0, 0), end: new Date(now).setHours(11, 0, 0), source: 'Canvas' },
                { summary: 'Sync with Dr. Evans', start: new Date(now).setHours(13, 0, 0), end: new Date(now).setHours(13, 30, 0), source: 'Google Calendar' },
                { summary: 'Materials Lab Report Prep', start: new Date(now).setHours(15, 0, 0), end: new Date(now).setHours(17, 0, 0), source: 'Todoist' },
            ];

            // Generate events from rituals
            const ritualEvents: {summary: string, start: number, end: number, source: string}[] = [];
            if (rituals.toLowerCase().includes('conditioning')) {
                ritualEvents.push({ summary: 'Physical Conditioning', start: new Date(now).setHours(7, 0, 0), end: new Date(now).setHours(8, 0, 0), source: 'Ritual' });
            }
            if (rituals.toLowerCase().includes('data ingest') || rituals.toLowerCase().includes('read')) {
                 ritualEvents.push({ summary: 'Data Ingest', start: new Date(now).setHours(8, 0, 0), end: new Date(now).setHours(8, 30, 0), source: 'Ritual' });
            }
            const allEvents = [...ritualEvents, ...mockEvents].sort((a,b) => a.start - b.start);


            let mockArticles: {title: string, source: string, url: string}[] = [];
            const lowerPassion = passion.toLowerCase();
            if (lowerPassion.includes('biotech') || lowerPassion.includes('life science')) {
                mockArticles = [
                    { title: 'Bio-Signal Processing Startup Raises $50M Series A', source: 'TechCrunch', url: '#' },
                    { title: 'Top 5 Life Science VC Firms to Watch in 2024', source: 'VentureBeat', url: '#' },
                    { title: 'New CRISPR Technique Shows Promise in Gene Editing', source: 'ScienceDaily', url: '#' },
                ];
            } else if (lowerPassion.includes('game design') || lowerPassion.includes('riot')) {
                 mockArticles = [
                    { title: 'Unity Announces New AI-Powered Tooling for Developers', source: 'Gamasutra', url: '#' },
                    { title: '"Project L", Riot\'s Fighting Game, Begins Player Testing', source: 'IGN', url: '#' },
                    { title: 'The Art of World-Building in Modern RPGs', source: 'Polygon', url: '#' },
                ];
            } else {
                 mockArticles = [
                    { title: 'The Future of AI in Creative Industries', source: 'Wired', url: '#' },
                    { title: 'Navigating Your First Tech Internship', source: 'Medium', url: '#' },
                    { title: 'Generative AI Market to Hit $100 Billion by 2026', source: 'Forbes', url: '#' },
                ];
            }


            // 2. Simulate Gemini API processing call after a delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Gemini Simulation
            const briefingSummary = `Operator, your directives are aligned with your goal: "${story.substring(0, 50)}...". You have ${allEvents.length} events scheduled. Your rituals are integrated for peak performance.`;

            const processedArticles = mockArticles.map(article => {
                let relevance = "General industry awareness.";
                const passionKeywords = passion.split(' ')[0].toLowerCase();
                if (passionKeywords && article.title.toLowerCase().includes(passionKeywords)) {
                    relevance = `Directly impacts your domain focus on '${passion}'. This development could influence future project directions.`;
                } else if (story.toLowerCase().includes('vc') && article.title.toLowerCase().includes('vc')) {
                     relevance = `Crucial intel for your objective: '${story}'. Monitor key players and funding trends.`;
                } else if (story.toLowerCase().includes('riot') && article.title.toLowerCase().includes('riot')) {
                     relevance = `Directly relevant to your target: '${story}'. Provides insight into company culture and projects.`;
                }
                return { ...article, relevance };
            });

            // 3. Update state
            setDailyBriefing({ summary: briefingSummary, events: allEvents });
            setNewsArticles(processedArticles);
            setIsLoading(false);
        };

        fetchAndProcessData();
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
                    <DailyBriefing summary={dailyBriefing.summary} events={dailyBriefing.events} isLoading={isLoading} />
                </div>
                <div>
                    <NewsFeed articles={newsArticles} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
};