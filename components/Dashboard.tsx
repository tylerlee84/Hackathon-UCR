
import React from 'react';
import { UserCircleIcon, FireIcon, ShieldCheckIcon, BookOpenIcon, SparklesIcon } from '@heroicons/react/24/solid';

const UserProfile = () => (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 flex items-center space-x-4">
        <div className="relative">
            <UserCircleIcon className="w-16 h-16 text-cyan-400" />
            <span className="absolute bottom-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-gray-800">1</span>
        </div>
        <div>
            <h3 className="font-bold text-lg text-white font-orbitron">Adventurer</h3>
            <p className="text-sm text-cyan-400">Adept of the Biotech, Life Science VC</p>
            <p className="text-xs text-gray-400 mt-1">Quadrant: Hyper-Specific</p>
        </div>
    </div>
);

const BountyBoard = () => (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
        <h3 className="font-bold text-lg mb-4 text-white font-orbitron flex items-center"><ShieldCheckIcon className="w-5 h-5 mr-2 text-yellow-400" />Bounty Board</h3>
        <div className="space-y-3">
            <div className="bg-gray-900/50 p-4 rounded-lg border border-red-500/50">
                <p className="font-semibold text-red-400 text-sm">Main Quest</p>
                <h4 className="text-white">Slay the 'Biomechanics Midterm' Beast</h4>
                <p className="text-xs text-gray-400 mt-1">Source: Canvas | Due: in 3 days</p>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg border border-yellow-500/50">
                <p className="font-semibold text-yellow-400 text-sm">Main Quest</p>
                <h4 className="text-white">Forge the 'Materials Lab Report' Artifact</h4>
                <p className="text-xs text-gray-400 mt-1">Source: Canvas | Due: in 5 days</p>
            </div>
        </div>
    </div>
);

const LoreFragments = () => (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
        <h3 className="font-bold text-lg mb-4 text-white font-orbitron flex items-center"><BookOpenIcon className="w-5 h-5 mr-2 text-blue-400" />Lore Fragments</h3>
        <div className="space-y-3">
            <div className="bg-gray-900/50 p-4 rounded-lg group hover:bg-gray-700/50 transition-colors">
                 <p className="font-semibold text-blue-400 text-sm">Industry News</p>
                 <a href="#" className="text-white group-hover:text-cyan-400 transition-colors">Rune Schematic: 'VC Life Sciences'</a>
                 <p className="text-xs text-gray-400 mt-1">New intel from 'TechCrunch' reveals 'Synthetic Biology' funding is at an all-time high...</p>
            </div>
        </div>
    </div>
);

const OraclesRiddle = () => (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-fuchsia-500/50 text-center">
        <h3 className="font-bold text-lg mb-2 text-white font-orbitron flex items-center justify-center"><SparklesIcon className="w-5 h-5 mr-2 text-fuchsia-400" />The Oracle's Weekly Riddle</h3>
        <p className="text-gray-300 italic">"As you battle your 'Midterm' Quest, ponder this: How does this deep knowledge forge the key to your great 'medium' of 'Help as many people as possible on a wide-scale level'?"</p>
    </div>
);

export const Dashboard: React.FC = () => {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-white font-orbitron">Daily Briefing</h2>
                <p className="text-gray-400">Your quests and lore for today, Adventurer.</p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3">
                    <UserProfile />
                </div>
                <div className="lg:col-span-2">
                    <BountyBoard />
                </div>
                <div>
                    <LoreFragments />
                </div>
                 <div className="lg:col-span-3">
                    <OraclesRiddle />
                </div>
            </div>
        </div>
    );
};
