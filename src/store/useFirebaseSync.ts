import { useEffect, useState } from 'react';
import { useAppDispatch } from './hooks';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase'; 
import { setNodes } from './mindMapSlice';
import type { NodeType } from './mindMapSlice';

export const useFirebaseSync = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const nodesRef = ref(db, 'nodes');

    const unsubscribe = onValue(nodesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const nodesArray = Array.isArray(data) ? data : Object.values(data);
        dispatch(setNodes(nodesArray as NodeType[]));
      } else {
        dispatch(setNodes([
          {
            id: 'root',
            parentId: null,
            label: 'Root',
            collapsed: false,
            position: { x: 300, y: 50 },
          },
        ]));
      }
      setLoading(false); 
    }, {
      onlyOnce: false 
    });

    return () => unsubscribe();
  }, [dispatch]);

  return { loading }; 
};