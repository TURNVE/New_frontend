import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function RouterDebug() {
  const location = useLocation();
  
  useEffect(() => {
    console.log('Current route:', location.pathname);
    console.log('Router state:', location.state);
  }, [location]);
  
  return null;
}
