import React, { useState, useEffect } from 'react';
import { cn } from '../../../lib/organization/utils';
import { CommandPalette, useCommandPalette } from '../shared/CommandPalette';
import { ToastProvider } from '../shared/Toast';
import { OnboardingTour, WelcomeModal, HelpButton } from '../shared/OnboardingTour';
import { ScrollReveal } from '../../ui/scroll-reveal';

interface OrgLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  header: React.ReactNode;
}

export function OrgLayout({ children, sidebar, header }: OrgLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile
  const { isOpen: isCommandOpen, setIsOpen: setIsCommandOpen } = useCommandPalette();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [tourCompleted, setTourCompleted] = useState(false);

  // Check if first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('org-has-visited');
    const hasCompletedTour = localStorage.getItem('org-tour-completed');
    const completed = hasCompletedTour === 'true';
    setTourCompleted(completed);
    
    if (!hasVisited) {
      setShowWelcome(true);
      localStorage.setItem('org-has-visited', 'true');
    } else if (!completed) {
      setShowTour(true);
    }
  }, []);

  // Listen for sidebar toggle event from keyboard shortcuts
  useEffect(() => {
    const handleToggleSidebar = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(!sidebarOpen);
      } else {
        setSidebarCollapsed(!sidebarCollapsed);
      }
    };

    window.addEventListener('toggle-sidebar', handleToggleSidebar);
    return () => window.removeEventListener('toggle-sidebar', handleToggleSidebar);
  }, [sidebarCollapsed, sidebarOpen]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStartTour = () => {
    setShowWelcome(false);
    setTimeout(() => setShowTour(true), 300);
  };

  const handleSkipWelcome = () => {
    setShowWelcome(false);
    setTourCompleted(true);
    localStorage.setItem('org-tour-completed', 'true');
  };

  return (
    <>
      {/* Toast Provider */}
      <ToastProvider />

      <div className="min-h-screen bg-gray-50">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            'fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out',
            // Desktop
            'hidden lg:block',
            sidebarCollapsed ? 'lg:w-16' : 'lg:w-64',
            // Mobile
            sidebarOpen ? 'block w-64' : 'hidden'
          )}
          data-tour="sidebar"
        >
          {sidebar}
        </aside>

        {/* Main Content Area */}
        <div
          className={cn(
            'transition-all duration-300 ease-in-out min-h-screen flex flex-col',
            // Desktop
            sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
          )}
        >
          {/* Header */}
          <header 
            className="sticky top-0 z-20 bg-white border-b border-gray-200"
            data-tour="header"
          >
            {header}
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 lg:p-6" data-tour="dashboard">
            <ScrollReveal>{children}</ScrollReveal>
          </main>
        </div>

        {/* Command Palette */}
        <CommandPalette 
          isOpen={isCommandOpen} 
          onClose={() => setIsCommandOpen(false)} 
        />

        {/* Onboarding Tour */}
        {showTour && (
          <OnboardingTour
            onComplete={() => {
              setShowTour(false);
              setTourCompleted(true);
              localStorage.setItem('org-tour-completed', 'true');
            }}
            onSkip={() => {
              setShowTour(false);
              setTourCompleted(true);
              localStorage.setItem('org-tour-completed', 'true');
            }}
          />
        )}

        {/* Welcome Modal */}
        <WelcomeModal
          isOpen={showWelcome}
          onClose={handleSkipWelcome}
          onStartTour={handleStartTour}
        />

        {/* Help Button (only show after tour completed) */}
        {tourCompleted && (
          <HelpButton onClick={() => setShowTour(true)} />
        )}
      </div>
    </>
  );
}

// Simple layout without sidebar for auth pages
export function SimpleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8 px-4">
        <ScrollReveal>{children}</ScrollReveal>
      </main>
    </div>
  );
}
