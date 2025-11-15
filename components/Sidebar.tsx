
import React from 'react';
import type { Workflow } from '../types';
import { BookOpenIcon, ChatBubbleBottomCenterTextIcon, HomeIcon, BeakerIcon } from '@heroicons/react/24/solid';

interface SidebarProps {
  workflows: Workflow[];
  onSelectWorkflow: (id: string) => void;
  onSetView: (view: 'dashboard' | 'workflow' | 'onboarding') => void;
  currentView: 'dashboard' | 'workflow' | 'onboarding';
  selectedWorkflowId: string | null;
}

const NavItem: React.FC<{
    icon: React.ElementType;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium text-left rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-cyan-500/20 text-cyan-400'
        : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
    }`}
  >
    <Icon className="w-5 h-5 mr-3" />
    <span>{label}</span>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ workflows, onSelectWorkflow, onSetView, currentView, selectedWorkflowId }) => {
  return (
    <aside className="w-72 bg-gray-900/70 border-r border-gray-700/50 p-4 flex flex-col backdrop-blur-sm">
      <div className="flex items-center mb-6">
         <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-600 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
             <BeakerIcon className="w-6 h-6 text-white"/>
         </div>
        <h1 className="text-xl font-bold font-orbitron text-white">Dungeon.edu</h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        <h2 className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Main</h2>
        <NavItem 
            icon={HomeIcon} 
            label="Dashboard" 
            isActive={currentView === 'dashboard'} 
            onClick={() => onSetView('dashboard')} 
        />
        <NavItem 
            icon={ChatBubbleBottomCenterTextIcon} 
            label="Onboarding Agent" 
            isActive={currentView === 'onboarding'} 
            onClick={() => onSetView('onboarding')} 
        />
        
        <h2 className="px-4 pt-6 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Workflows</h2>
        <div className="space-y-1">
          {workflows.map(wf => (
            <button
              key={wf.id}
              onClick={() => onSelectWorkflow(wf.id)}
              className={`flex items-center w-full px-4 py-2.5 text-sm text-left rounded-md transition-colors duration-200 ${
                currentView === 'workflow' && selectedWorkflowId === wf.id
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
              }`}
            >
                <BookOpenIcon className="w-4 h-4 mr-3 text-gray-500" />
                <span className="truncate">{wf.name}</span>
            </button>
          ))}
        </div>
      </nav>
      
      <div className="mt-auto text-center text-xs text-gray-500">
        <p>Gemini Agent Visualizer v1.0</p>
      </div>
    </aside>
  );
};
