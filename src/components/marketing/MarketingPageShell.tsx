import type { ReactNode } from 'react';

import Header from '../layout/Header';
import { PublicFooter } from '../layout/PublicFooter';

interface MarketingPageShellProps {
  children: ReactNode;
  hideFooter?: boolean;
  headerVariant?: 'light' | 'dark';
  className?: string;
  id?: string;
}

export function MarketingPageShell({
  children,
  hideFooter,
  headerVariant = 'light',
  className = 'bg-white',
  id,
}: MarketingPageShellProps) {
  return (
    <div id={id} className={`marketing-page min-h-screen ${className}`}>
      <Header variant={headerVariant} />
      {children}
      {!hideFooter && <PublicFooter />}
    </div>
  );
}

export default MarketingPageShell;
