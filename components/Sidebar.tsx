import React from 'react';
import type { Workflow } from '../types';
import { BookOpenIcon, ChatBubbleBottomCenterTextIcon, HomeIcon } from '@heroicons/react/24/solid';
import { SagaLogo } from './SagaLogo';

interface SidebarProps {
  workflows: Workflow[];
  isLoading: boolean;
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
    className={`group flex items-center w-full px-4 py-3 text-sm font-medium text-left rounded-lg transition-all duration-300 relative overflow-hidden ${
      isActive
        ? 'bg-cyan-500/10 text-cyan-300 shadow-inner shadow-cyan-500/10'
        : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
    }`}
  >
    <div className={`absolute left-0 top-0 h-full w-1 bg-cyan-400 transition-transform duration-300 ease-in-out ${isActive ? 'scale-y-100' : 'scale-y-0'}`}></div>
    <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
    <span className="z-10">{label}</span>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ workflows, isLoading, onSelectWorkflow, onSetView, currentView, selectedWorkflowId }) => {
  return (
    <aside className="w-72 glass-pane p-4 flex flex-col">
      <div className="flex items-center mb-8">
         <SagaLogo className="w-10 h-10 mr-3" />
        <h1 className="text-xl font-bold font-orbitron text-white">Saga AI<span className="text-cyan-400">.edu</span></h1>
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
        <div className="space-y-1 min-h-[120px] pr-2 overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-500 animate-pulse">Loading sagas...</div>
          ) : (
            workflows.map(wf => (
              <button
                key={wf.id}
                onClick={() => onSelectWorkflow(wf.id)}
                className={`group flex items-center w-full px-4 py-2.5 text-sm text-left rounded-md transition-all duration-200 ${
                  currentView === 'workflow' && selectedWorkflowId === wf.id
                    ? 'bg-cyan-500/10 text-cyan-300'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
              >
                  <div className={`w-1 h-4 rounded-full mr-3 transition-colors ${currentView === 'workflow' && selectedWorkflowId === wf.id ? 'bg-cyan-400' : 'bg-gray-600 group-hover:bg-gray-500'}`}></div>
                  <span className="truncate">{wf.name}</span>
              </button>
            ))
          )}
        </div>
      </nav>
      
      <div className="mt-auto text-center text-xs text-gray-500">
        <p>Saga AI Visualizer v2.0</p>
      </div>
    </aside>
  );
};