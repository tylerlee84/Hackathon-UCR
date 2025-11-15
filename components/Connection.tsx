
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

  return (
    <g>
      <path
        d={pathData}
        className="stroke-gray-600 stroke-2 fill-none"
      />
      <path
        d={pathData}
        className="stroke-gray-700/50 stroke-[8px] fill-none"
      />
      <path
        d={pathData}
        markerEnd="url(#arrowhead)"
        className="stroke-gray-500 stroke-2 fill-none"
      />
    </g>
  );
};
