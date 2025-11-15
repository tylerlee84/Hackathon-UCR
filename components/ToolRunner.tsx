
import React, { useState, useMemo } from 'react';
import type { Workflow } from '../types';
import { Cog6ToothIcon, PlayIcon, InformationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

interface ToolRunnerProps {
  workflow: Workflow;
}

interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  defaultValue?: string;
}

const InputField: React.FC<{
    field: FormField;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ field, value, onChange }) => (
    <div>
        <label htmlFor={field.name} className="block text-sm font-medium text-gray-300 mb-1">{field.label}</label>
        <input
            type={field.type}
            name={field.name}
            id={field.name}
            value={value}
            onChange={onChange}
            placeholder={field.placeholder}
            defaultValue={field.defaultValue}
            className="w-full bg-gray-900/70 border border-gray-600 rounded-lg p-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
        />
    </div>
);

export const ToolRunner: React.FC<ToolRunnerProps> = ({ workflow }) => {
    const getInitialState = (fields: FormField[]) => {
        const state: Record<string, string> = {};
        fields.forEach(field => {
            state[field.name] = field.defaultValue || '';
        });
        return state;
    };

    const toolFields = useMemo<FormField[]>(() => {
        switch (workflow.id) {
            case 'tool-research_agent':
            case 'tool-scribe-assistant':
                return [{ name: 'topic', label: 'Topic', type: 'text', placeholder: 'e.g., Synthetic Biology' }];
            case 'tool-create_calendar_event':
                const now = new Date();
                const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
                return [
                    { name: 'title', label: 'Event Title', type: 'text', placeholder: 'e.g., Midterm Study Session' },
                    { name: 'start_time_iso', label: 'Start Time', type: 'datetime-local', placeholder: '', defaultValue: now.toISOString().slice(0, 16) },
                    { name: 'end_time_iso', label: 'End Time', type: 'datetime-local', placeholder: '', defaultValue: oneHourLater.toISOString().slice(0, 16) },
                ];
            case 'tool-get_news':
                 return [{ name: 'query', label: 'News Query', type: 'text', placeholder: 'e.g., AI advancements' }];
            default:
                return [];
        }
    }, [workflow.id]);
    
    const [formData, setFormData] = useState<Record<string, string>>(getInitialState(toolFields));
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResult(null);

        // Simulate API call and tool execution
        setTimeout(() => {
            let mockResult = `Execution successful for tool: ${workflow.name}\n\n`;
            mockResult += `Inputs Provided:\n${JSON.stringify(formData, null, 2)}\n\n`;
            mockResult += `Mock Result:\n`;

            switch (workflow.id) {
                case 'tool-research_agent':
                    mockResult += `Knowledge Packet on '${formData.topic}' compiled.\nKey findings: ...\nSources analyzed: 5\nConfidence: 95%`;
                    break;
                case 'tool-create_calendar_event':
                    mockResult += `Event '${formData.title}' created successfully in Google Calendar.\nEvent ID: xyz123abc456`;
                    break;
                case 'tool-get_news':
                    mockResult += `Found 5 articles for query '${formData.query}':\n1. "New AI Model Shatters Benchmarks"\n2. "The Ethics of Advanced AI"\n3. ...`;
                    break;
                case 'tool-scribe-assistant':
                    mockResult += `Scroll of '${formData.topic}' summarized.\nThe papyrus reads: "..."`;
                    break;
                default:
                    mockResult += `Tool executed, but no specific mock result is configured for this tool.`;
            }

            setIsLoading(false);
            setResult(mockResult);
        }, 1500);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-white font-orbitron">Tool Invocation</h2>
                <p className="text-gray-400">Manually execute a workflow tool with specific inputs.</p>
            </header>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <div className="flex items-center mb-4 pb-4 border-b border-gray-700">
                     <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                         <Cog6ToothIcon className="w-6 h-6 text-white"/>
                     </div>
                     <div>
                        <h3 className="font-bold text-lg text-white font-orbitron">{workflow.name}</h3>
                        <p className="text-sm text-cyan-400">{workflow.meta?.description || 'No description available.'}</p>
                     </div>
                </div>

                {toolFields.length > 0 ? (
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {toolFields.map(field => (
                                <InputField key={field.name} field={field} value={formData[field.name]} onChange={handleInputChange} />
                            ))}
                        </div>
                         <button type="submit" disabled={isLoading} className="mt-6 w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500">
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Executing...
                                </>
                            ) : (
                                <>
                                    <PlayIcon className="w-5 h-5 mr-2" />
                                    Execute Tool
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-8 bg-gray-900/50 rounded-lg">
                        <InformationCircleIcon className="w-10 h-10 mx-auto text-blue-400 mb-2" />
                        <p className="text-gray-300">This tool is not configured for manual execution.</p>
                        <p className="text-xs text-gray-500">It is likely triggered by another agent or process.</p>
                    </div>
                )}
            </div>

            {(isLoading || result) && (
                 <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Execution Log</h3>
                    <div className="bg-gray-900/80 rounded-xl p-4 border border-gray-700/50 min-h-[100px]">
                        {isLoading && (
                            <div className="flex items-center text-gray-400">
                               <svg className="animate-spin mr-3 h-5 w-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Awaiting response from the forge...</span>
                            </div>
                        )}
                        {result && (
                            <div>
                                <div className="flex items-center text-green-400 mb-2">
                                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                                    <span className="font-bold">Execution Complete</span>
                                </div>
                                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{result}</pre>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
