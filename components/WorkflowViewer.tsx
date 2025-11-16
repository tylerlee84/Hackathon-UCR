import React, { useState, useRef, useEffect, useCallback } from 'react';
// Fix: Import Connections type to correctly type connection data.
import type { Workflow, Node as WorkflowNode, Connections, ConnectionNode } from '../types';
import { Node } from './Node';
import { Connection } from './Connection';

interface WorkflowViewerProps {
  workflow: Workflow;
}

export const WorkflowViewer: React.FC<WorkflowViewerProps> = ({ workflow }) => {
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 1600, h: 1200 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const nodeMap = new Map(workflow.nodes.map(node => [node.name, node]));
  const nodeIdMap = new Map(workflow.nodes.map(node => [node.id, node]));

  const calculateBounds = useCallback(() => {
    if (workflow.nodes.length === 0) return { minX: 0, minY: 0, maxX: 1600, maxY: 1200 };
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    workflow.nodes.forEach(node => {
      minX = Math.min(minX, node.position[0]);
      minY = Math.min(minY, node.position[1]);
      maxX = Math.max(maxX, node.position[0] + 250); // node width
      maxY = Math.max(maxY, node.position[1] + 60); // node height
    });
    return { minX, minY, maxX, maxY };
  }, [workflow.nodes]);

  useEffect(() => {
    const bounds = calculateBounds();
    const padding = 200;
    setViewBox({
        x: bounds.minX - padding / 2,
        y: bounds.minY - padding / 2,
        w: (bounds.maxX - bounds.minX) + padding,
        h: (bounds.maxY - bounds.minY) + padding,
    });
  }, [workflow, calculateBounds]);

  const onMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    setStartPoint({ x: e.clientX, y: e.clientY });
  };

  const onMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging || !svgRef.current) return;
    const CTM = svgRef.current.getScreenCTM();
    if (!CTM) return;
    const dx = (e.clientX - startPoint.x) / CTM.a;
    const dy = (e.clientY - startPoint.y) / CTM.d;
    setViewBox(prev => ({ ...prev, x: prev.x - dx, y: prev.y - dy }));
    setStartPoint({ x: e.clientX, y: e.clientY });
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };
  
  const onWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    e.preventDefault();
    const CTM = svgRef.current.getScreenCTM();
    if (!CTM) return;

    const mx = e.clientX;
    const my = e.clientY;
    
    const point = svgRef.current.createSVGPoint();
    point.x = mx;
    point.y = my;
    const svgPoint = point.matrixTransform(CTM.inverse());
    
    const scale = e.deltaY < 0 ? 0.9 : 1.1;
    
    const newW = viewBox.w * scale;
    const newH = viewBox.h * scale;
    const newX = viewBox.x - (svgPoint.x - viewBox.x) * (scale - 1);
    const newY = viewBox.y - (svgPoint.y - viewBox.y) * (scale - 1);
    
    setViewBox({ x: newX, y: newY, w: newW, h: newH });
  };

  return (
    <div className="w-full h-full overflow-hidden bg-transparent relative">
      <div className="absolute top-4 left-4 glass-pane p-3 rounded-lg z-10">
        <h2 className="text-xl font-bold font-orbitron text-white">{workflow.name}</h2>
        <p className="text-sm text-gray-400">Nodes: {workflow.nodes.length}</p>
      </div>
      <svg
        ref={svgRef}
        className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
      >
        <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" className="fill-current text-purple-400" />
            </marker>
        </defs>
        {/* Fix: Use Object.keys to iterate over connections to ensure connData is correctly typed. */}
        {Object.keys(workflow.connections).map((sourceName) => {
          const sourceNode = nodeMap.get(sourceName);
          if (!sourceNode) return null;
          
          const connData = workflow.connections[sourceName];
          // FIX: The original `reduce` logic to flatten connections can be tricky for TypeScript's type inference, leading to an `unknown` type. Using `.flat()` is more modern and has better type support.
          const allConnections = [...(connData.main || []), ...(connData.tool || [])].flat();

          // FIX: Explicitly type `target` as `ConnectionNode` to correct type inference issues with `.flat()` that can lead to an `unknown` type.
          return allConnections.map((target: ConnectionNode, index) => {
            const targetNode = nodeMap.get(target.node);
            if (!targetNode) return null;
            return (
              <Connection key={`${sourceNode.id}-${targetNode.id}-${index}`} source={sourceNode} target={targetNode} />
            );
          });
        })}

        {workflow.nodes.map(node => (
          <Node key={node.id} node={node} />
        ))}
      </svg>
    </div>
  );
};
