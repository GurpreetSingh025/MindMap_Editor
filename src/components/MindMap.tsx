import { useAppSelector } from '../store/hooks';
import { useFirebaseSync } from '../store/useFirebaseSync'; 
import NodeItem from './NodeItem';
import styled from 'styled-components';
import type { NodeType } from '../store/mindMapSlice';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: 100;
`;

const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const isVisible = (node: NodeType, nodes: NodeType[]): boolean => {
  let current = node;
  while (current.parentId) {
    const parent = nodes.find(n => n.id === current.parentId);
    if (!parent) break;
    if (parent.collapsed) return false;
    current = parent;
  }
  return true;
};

const MindMap = () => {
  const { loading } = useFirebaseSync(); 
  const nodes = useAppSelector(state => state.mindmap.nodes);
  const visibleNodes = nodes.filter(node => isVisible(node, nodes));

  if (loading) {
    return (
      <LoaderContainer>
        <Spinner />
      </LoaderContainer>
    );
  }

  return (
    <Container>
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
      >
        {visibleNodes.map(child => {
          if (!child.parentId) return null;

          const parent = nodes.find(n => n.id === child.parentId);
          if (!parent || !isVisible(parent, nodes)) return null;

          const parentX = parent.position.x + 75;
          const parentY = parent.position.y + 25;
          const childX = child.position.x + 75;
          const childY = child.position.y + 25;

          return (
            <line
              key={`${parent.id}-${child.id}`}
              x1={parentX}
              y1={parentY}
              x2={childX}
              y2={childY}
              stroke="#888"
              strokeWidth="2"
            />
          );
        })}
      </svg>

      {visibleNodes.map((node: NodeType) => (
        <NodeItem key={node.id} node={node} />
      ))}
    </Container>
  );
};

export default MindMap;