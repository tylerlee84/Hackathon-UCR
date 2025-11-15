
import React from 'react';
import type { Workflow, Node } from '../types';
import { CalendarDaysIcon, SparklesIcon, Cog6ToothIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';

interface AgentViewerProps {
  workflow: Workflow;
}

const getTrigger = (nodes: Node[]): Node | undefined => {
    return nodes.find(node => node.type.endsWith('Trigger') || node.type.endsWith('.cron'));
};

const getAgent = (nodes: Node[]): Node | undefined => {
    return nodes.find(node => node.type.endsWith('.agent'));
};

const getTools = (nodes: Node[]): Node[] => {
    return nodes.filter(node => node.type === 'n8n-nodes-base.executeWorkflow');
};

const InfoCard: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-gray-900/50 rounded-lg flex items-center justify-center mr-3">
                <Icon className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="font-bold text-lg text-white font-orbitron">{title}</h3>
        </div>
        <div className="pl-11 text-sm text-gray-300 space-y-2">
            {children}
        </div>
    </div>
);

export const AgentViewer: React.FC<AgentViewerProps> = ({ workflow }) => {
    const triggerNode = getTrigger(workflow.nodes);
    const agentNode = getAgent(workflow.nodes);
    const toolNodes = getTools(workflow.nodes);

    const renderTriggerDetails = () => {
        if (!triggerNode) return <p>No trigger defined.</p>;
        if (triggerNode.type === 'n8n-nodes-base.cron') {
            const time = triggerNode.parameters.triggerTimes?.[0];
            return <p>Runs on a schedule: Daily at {String(time?.hour).padStart(2, '0')}:{String(time?.minute).padStart(2, '0')}.</p>;
        }
        if (triggerNode.type.includes('Trigger')) {
            return <p>This agent is triggered by an external event or another workflow.</p>
        }
        return <p>Trigger type: {triggerNode.type}</p>;
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-white font-orbitron">{workflow.name}</h2>
                <p className="text-gray-400">A high-level overview of the agent's mandate and capabilities.</p>
            </header>

            <div className="space-y-6">
                <InfoCard icon={PaperAirplaneIcon} title="Trigger">
                    {renderTriggerDetails()}
                </InfoCard>

                {agentNode && (
                    <InfoCard icon={SparklesIcon} title="Core Logic">
                        <p className="font-semibold text-white">{agentNode.name}</p>
                        <p className="text-xs text-gray-400">Model: {agentNode.parameters.model}</p>
                        <p className="italic mt-2 text-gray-400">System Prompt: "{agentNode.parameters.systemMessage || 'A general-purpose assistant.'}"</p>
                    </InfoCard>
                )}

                {toolNodes.length > 0 && (
                     <InfoCard icon={Cog6ToothIcon} title="Tools Used">
                         <ul className="list-disc list-inside space-y-2">
                            {toolNodes.map(tool => (
                                <li key={tool.id} className="text-cyan-300">
                                    <span className="text-gray-300">{tool.name}</span>
                                </li>
                            ))}
                         </ul>
                    </InfoCard>
                )}
            </div>
        </div>
    );
};
