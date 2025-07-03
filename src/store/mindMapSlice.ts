import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ref, set } from 'firebase/database';
import { db } from '../firebase'; 

export interface NodeType {
  id: string;
  parentId: string | null;
  label: string;
  collapsed: boolean;
  position: { x: number; y: number };
}

interface MindMapState {
  nodes: NodeType[];
}

const initialState: MindMapState = {
  nodes: [
    {
      id: 'root',
      parentId: null,
      label: 'Root',
      collapsed: false,
      position: { x: 300, y: 50 },
    },
  ],
};

const mindMapSlice = createSlice({
  name: 'mindmap',
  initialState,
  reducers: {
    setNodes: (state, action: PayloadAction<NodeType[]>) => {
      state.nodes = action.payload;
    },
    addNode: (state, action: PayloadAction<{ parentId: string }>) => {
      const parent = state.nodes.find(n => n.id === action.payload.parentId);
      const id = Date.now().toString(); 
      const offset = 50;

      const newNode: NodeType = {
        id,
        parentId: action.payload.parentId,
        label: 'New Node',
        collapsed: false,
        position: {
          x: (parent?.position.x ?? 100) + offset,
          y: (parent?.position.y ?? 100) + offset,
        },
      };

      state.nodes.push(newNode);

      const nodesRef = ref(db, 'nodes');
      set(nodesRef, state.nodes);
    },
    updatePosition: (state, action: PayloadAction<{ id: string; x: number; y: number }>) => {
      const node = state.nodes.find(n => n.id === action.payload.id);
      if (node) {
        node.position = { x: action.payload.x, y: action.payload.y };

        const nodesRef = ref(db, 'nodes');
        set(nodesRef, state.nodes);
      }
    },
    toggleCollapse: (state, action: PayloadAction<string>) => {
      const node = state.nodes.find(n => n.id === action.payload);
      if (node) {
        node.collapsed = !node.collapsed;

        const nodesRef = ref(db, 'nodes');
        set(nodesRef, state.nodes);
      }
    },
    renameNode: (state, action: PayloadAction<{ id: string; label: string }>) => {
      const node = state.nodes.find(n => n.id === action.payload.id);
      if (node) {
        node.label = action.payload.label;
  
        const nodesRef = ref(db, 'nodes');
        set(nodesRef, state.nodes);
      }
    },
  },
});

export const { setNodes, addNode, updatePosition, toggleCollapse, renameNode } = mindMapSlice.actions;
export default mindMapSlice.reducer;