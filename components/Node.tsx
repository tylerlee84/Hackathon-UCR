
import React from 'react';
import type { Node as WorkflowNode } from '../types';
import { NODE_STYLE_MAP } from '../constants';

interface NodeProps {
  node: WorkflowNode;
}

const nodeWidth = 250;
const nodeHeight = 60;

export const Node: React.FC<NodeProps> = ({ node }) => {
  const [x, y] = node.position;
  const style = NODE_STYLE_MAP[node.type] || NODE_STYLE_MAP['default'];
  const Icon = style.icon;

  const colorClasses: {[key: string]: string} = {
    green: 'border-green-500/50 bg-green-900/30 text-green-300',
    blue: 'border-blue-500/50 bg-blue-900/30 text-blue-300',
    yellow: 'border-yellow-500/50 bg-yellow-900/30 text-yellow-300',
    purple: 'border-purple-500/50 bg-purple-900/30 text-purple-300',
    indigo: 'border-indigo-500/50 bg-indigo-900/30 text-indigo-300',
    cyan: 'border-cyan-500/50 bg-cyan-900/30 text-cyan-300',
    fuchsia: 'border-fuchsia-500/50 bg-fuchsia-900/30 text-fuchsia-300',
    gray: 'border-gray-500/50 bg-gray-900/30 text-gray-300',
  };

  const nodeColorClass = colorClasses[style.color] || colorClasses['gray'];

  return (
    <g transform={`translate(${x}, ${y})`}>
      <foreignObject width={nodeWidth} height={nodeHeight}>
        <div className={`flex items-center w-full h-full p-3 rounded-lg border backdrop-blur-sm shadow-lg shadow-black/20 transition-all duration-200 hover:scale-105 hover:shadow-xl ${nodeColorClass}`}>
          <div className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center mr-3 bg-black/20`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{node.name}</p>
            <p className="text-xs text-gray-400 truncate">{node.type}</p>
          </div>
        </div>
      </foreignObject>
    </g>
  );
};
