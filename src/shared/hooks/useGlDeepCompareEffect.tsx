import { useEffect, useRef } from 'react';
import { isEqual } from 'lodash'; 

export function useGlDeepCompareEffect(callback: () => void, dependencies: any[]) {
  const currentDependenciesRef = useRef<any[]>();

  if (!currentDependenciesRef.current || !isEqual(currentDependenciesRef.current, dependencies)) {
    currentDependenciesRef.current = dependencies;
  }

  useEffect(callback, [currentDependenciesRef.current]);
}
