import React from 'react';
import type { Node } from '../types';

interface ConnectionProps {
  source: Node;
  target: Node;
}

export const Connection: React.FC<ConnectionProps> = ({ source, target }) => {
  const nodeWidth = 250;
  const nodeHeight = 60;

  const [sx, sy] = source.position;
  const [tx, ty] = target.position;

  const startX = sx + nodeWidth;
  const startY = sy + nodeHeight / 2;
  const endX = tx;
  const endY = ty + nodeHeight / 2;

  const dx = Math.abs(startX - endX);
  const controlPointX1 = startX + dx * 0.5;
  const controlPointY1 = startY;
  const controlPointX2 = endX - dx * 0.5;
  const controlPointY2 = endY;

  const pathData = `M ${startX},${startY} C ${controlPointX1},${controlPointY1} ${controlPointX2},${controlPointY2} ${endX},${endY}`;

  const uniqueId = `grad-${source.id}-${target.id}`;

  return (
    <g style={{'--path-length': 1000}}>
      <defs>
        <linearGradient id={uniqueId} x1={startX} y1={startY} x2={endX} y2={endY} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
      </defs>
      <path
        d={pathData}
        className="stroke-gray-700/50"
        strokeWidth="6"
        fill="none"
      />
      <path
        d={pathData}
        stroke={`url(#${uniqueId})`}
        strokeWidth="1.5"
        fill="none"
        markerEnd="url(#arrowhead)"
        strokeDasharray="10 5"
        className="animate-flow"
      />
      <style>{`
        @keyframes flow {
          to {
            stroke-dashoffset: -20;
          }
        }
        .animate-flow {
          animation: flow 1s linear infinite;
        }
      `}</style>
    </g>
  );
};