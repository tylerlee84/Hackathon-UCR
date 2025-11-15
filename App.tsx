
import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AgentViewer } from './components/AgentViewer';
import { OnboardingChat } from './components/OnboardingChat';
import { ToolRunner } from './components/ToolRunner';
import { WORKFLOWS } from './constants';
import type { Workflow, UserProfile } from './types';

type View = 'dashboard' | 'workflow' | 'onboarding';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      return savedProfile ? JSON.parse(savedProfile) : null;
    } catch (error) {
      console.error("Failed to parse user profile from localStorage", error);
      return null;
    }
  });

  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(() => {
    return localStorage.getItem('onboardingComplete') === 'true';
  });

  const [currentView, setCurrentView] = useState<View>(isOnboardingComplete ? 'dashboard' : 'onboarding');
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);

  const handleSelectWorkflow = (id: string) => {
    setSelectedWorkflowId(id);
    setCurrentView('workflow');
  };
  
  const handleSetView = (view: View) => {
    if (!isOnboardingComplete && view !== 'onboarding') {
      // Keep user in onboarding if not complete, but allow them to re-select it
      setCurrentView('onboarding');
      return;
    }
    setCurrentView(view);
  }

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setIsOnboardingComplete(true);
    localStorage.setItem('onboardingComplete', 'true');
    setCurrentView('dashboard');
  };

  const selectedWorkflow = useMemo(() => {
    return WORKFLOWS.find(w => w.id === selectedWorkflowId) || null;
  }, [selectedWorkflowId]);

  const renderContent = () => {
    switch (currentView) {
      case 'workflow':
        if (selectedWorkflow) {
          if (selectedWorkflow.id.startsWith('tool-')) {
            return <ToolRunner workflow={selectedWorkflow} />;
          }
          return <AgentViewer workflow={selectedWorkflow} />;
        }
        return <div className="p-8 text-center">Select a workflow to view.</div>;
      case 'onboarding':
        return <OnboardingChat onOnboardingComplete={handleOnboardingComplete} />;
      case 'dashboard':
      default:
        return <Dashboard userProfile={userProfile} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 overflow-hidden">
      <Sidebar 
        workflows={WORKFLOWS}
        onSelectWorkflow={handleSelectWorkflow}
        onSetView={handleSetView}
        currentView={currentView}
        selectedWorkflowId={selectedWorkflowId}
      />
      <main className="flex-1 overflow-auto bg-gray-800/50" style={{ backgroundImage: 'radial-gradient(circle at top right, rgba(29, 78, 216, 0.15), transparent 40%), radial-gradient(circle at bottom left, rgba(134, 25, 143, 0.15), transparent 50%)' }}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
