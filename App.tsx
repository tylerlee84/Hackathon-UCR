
import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AgentViewer } from './components/AgentViewer';
import { OnboardingChat } from './components/OnboardingChat';
import { ToolRunner } from './components/ToolRunner';
import { WORKFLOWS } from './constants';
import type { Workflow, UserProfile } from './types';
import { LoadingSpinner } from './components/LoadingSpinner';

type View = 'dashboard' | 'workflow' | 'onboarding';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        // Validate the parsed object to ensure it conforms to the UserProfile type
        if (parsed && typeof parsed === 'object' && 'story' in parsed && 'passion' in parsed && 'ics' in parsed && 'rituals' in parsed) {
          return parsed as UserProfile;
        }
        // If data is malformed, clear it to prevent future errors
        console.warn("Malformed user profile in localStorage. Clearing it.");
        localStorage.removeItem('userProfile');
      }
      return null;
    } catch (error) {
      console.error("Failed to parse user profile from localStorage", error);
      // Clear corrupted data on parsing error as well
      localStorage.removeItem('userProfile');
      return null;
    }
  });

  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(() => {
    return localStorage.getItem('onboardingComplete') === 'true';
  });

  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<View>(isOnboardingComplete ? 'dashboard' : 'onboarding');
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching workflows from a cloud source
    setTimeout(() => {
      setWorkflows(WORKFLOWS);
      setIsLoading(false);
    }, 1500);
  }, []);

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
    return workflows.find(w => w.id === selectedWorkflowId) || null;
  }, [selectedWorkflowId, workflows]);

  const renderContent = () => {
    // Don't show the main loading screen if the user needs to onboard first.
    if (isLoading && currentView !== 'onboarding') {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <LoadingSpinner />
          <h3 className="text-xl font-bold text-white font-orbitron mt-6">Syncing with the Cosmos...</h3>
          <p className="text-gray-400">Compiling the latest sagas.</p>
        </div>
      );
    }
    
    // Add a key to the wrapping div to force re-mount and trigger animations on view change
    const contentKey = currentView === 'workflow' ? `${currentView}-${selectedWorkflowId}` : currentView;

    return (
        <div key={contentKey} className="fade-in-up">
            {(() => {
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
            })()}
        </div>
    );
  };

  return (
    <div className="flex h-screen bg-transparent text-gray-200">
      <Sidebar 
        workflows={workflows}
        isLoading={isLoading}
        onSelectWorkflow={handleSelectWorkflow}
        onSetView={handleSetView}
        currentView={currentView}
        selectedWorkflowId={selectedWorkflowId}
      />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
