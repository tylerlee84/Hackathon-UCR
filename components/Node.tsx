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

  const colorClasses: {[key: string]: { border: string, bg: string, text: string, shadow: string }} = {
    green: { border: 'border-green-400/50', bg: 'bg-green-900/30', text: 'text-green-300', shadow: 'hover:shadow-[0_0_15px_rgba(52,211,153,0.5)]' },
    blue: { border: 'border-blue-400/50', bg: 'bg-blue-900/30', text: 'text-blue-300', shadow: 'hover:shadow-[0_0_15px_rgba(96,165,250,0.5)]' },
    yellow: { border: 'border-yellow-400/50', bg: 'bg-yellow-900/30', text: 'text-yellow-300', shadow: 'hover:shadow-[0_0_15px_rgba(250,204,21,0.5)]' },
    purple: { border: 'border-purple-400/50', bg: 'bg-purple-900/30', text: 'text-purple-300', shadow: 'hover:shadow-[0_0_15px_rgba(192,132,252,0.5)]' },
    indigo: { border: 'border-indigo-400/50', bg: 'bg-indigo-900/30', text: 'text-indigo-300', shadow: 'hover:shadow-[0_0_15px_rgba(129,140,248,0.5)]' },
    cyan: { border: 'border-cyan-400/50', bg: 'bg-cyan-900/30', text: 'text-cyan-300', shadow: 'hover:shadow-[0_0_15px_rgba(34,211,238,0.5)]' },
    fuchsia: { border: 'border-fuchsia-400/50', bg: 'bg-fuchsia-900/30', text: 'text-fuchsia-300', shadow: 'hover:shadow-[0_0_15px_rgba(217,70,239,0.5)]' },
    gray: { border: 'border-gray-400/50', bg: 'bg-gray-900/30', text: 'text-gray-300', shadow: 'hover:shadow-[0_0_15px_rgba(156,163,175,0.5)]' },
  };

  const nodeColor = colorClasses[style.color] || colorClasses['gray'];

  return (
    <g transform={`translate(${x}, ${y})`}>
      <foreignObject width={nodeWidth} height={nodeHeight} className="overflow-visible">
        <div 
          className={`flex items-center w-full h-full p-3 rounded-lg border backdrop-blur-sm shadow-lg shadow-black/30 transition-all duration-300 hover:scale-105 hover:border-white/50 ${nodeColor.border} ${nodeColor.bg} ${nodeColor.shadow}`}
          style={{ animation: 'pulse-border 3s infinite', animationDelay: `${(x+y) % 1000}ms` }}
        >
          <div className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center mr-3 bg-black/30 ring-1 ring-white/10 ${nodeColor.text}`}>
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