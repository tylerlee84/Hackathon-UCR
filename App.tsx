
import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { WorkflowViewer } from './components/WorkflowViewer';
import { OnboardingChat } from './components/OnboardingChat';
import { WORKFLOWS } from './constants';
import type { Workflow } from './types';

type View = 'dashboard' | 'workflow' | 'onboarding';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);

  const handleSelectWorkflow = (id: string) => {
    setSelectedWorkflowId(id);
    setCurrentView('workflow');
  };

  const selectedWorkflow = useMemo(() => {
    return WORKFLOWS.find(w => w.id === selectedWorkflowId) || null;
  }, [selectedWorkflowId]);

  const renderContent = () => {
    switch (currentView) {
      case 'workflow':
        return selectedWorkflow ? <WorkflowViewer workflow={selectedWorkflow} /> : <div className="p-8 text-center">Select a workflow to view.</div>;
      case 'onboarding':
        return <OnboardingChat />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 overflow-hidden">
      <Sidebar 
        workflows={WORKFLOWS}
        onSelectWorkflow={handleSelectWorkflow}
        onSetView={setCurrentView}
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
