import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Hook
 * 
 * Automatically scrolls the window to the top whenever the route changes.
 * Use this in your main App component or layout to ensure all pages
 * start from the top when navigated to.
 */
export function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Use 'instant' for immediate scroll, or 'smooth' for animated
    });
  }, [pathname]);
}

/**
 * ScrollToTop Component
 * 
 * A component version that can be placed in the router or layout.
 * This is useful when you can't use hooks directly.
 */
export function ScrollToTop() {
  useScrollToTop();
  return null;
}
