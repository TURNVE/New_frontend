import { ReactNode } from 'react';
import Header from './Header';
import { PublicFooter } from './PublicFooter';
import { ScrollReveal } from '../ui/scroll-reveal';

interface MainLayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

export function MainLayout({ children, hideFooter }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main>
        <ScrollReveal>{children}</ScrollReveal>
      </main>
      {!hideFooter && <PublicFooter />}
    </div>
  );
}
