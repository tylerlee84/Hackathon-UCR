
export interface NodeParameterValue {
  name: string;
  value: any;
}

export interface NodeParameters {
  [key: string]: any;
}

export interface Node {
  parameters: NodeParameters;
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  notes?: string;
}

export interface ConnectionNode {
  node: string;
  type: string;
  index: number;
}

export interface Connections {
  [nodeName: string]: {
    main: ConnectionNode[][];
    tool?: ConnectionNode[][];
  };
}

export interface Workflow {
  name: string;
  id: string;
  nodes: Node[];
  connections: Connections;
  active?: boolean;
  settings?: object;
  pinData?: object;
  meta?: object;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
}
