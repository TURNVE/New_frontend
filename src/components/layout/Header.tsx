import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { TurnveLogo } from '../brand/TurnveLogo';

const menuItems = [
  { name: 'Features', href: '/features' },
  { name: 'Programs', href: '/programs' },
  { name: 'Companies', href: '/company/start' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
];

export function Header() {
  const [menuState, setMenuState] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className={`transition-all duration-300 ${
        scrolled ? 'bg-background/90 backdrop-blur-xl border-b border-border' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="/" className="flex h-10 items-center group" aria-label="TURNVE home">
              <TurnveLogo className="h-8 w-auto max-w-[132px] transition-transform group-hover:scale-105 sm:h-9" />
            </a>

            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
              <ul className="flex items-center gap-1">
                {menuItems.map((item) => (
                  <li key={item.name}>
<a
                       href={item.href}
                       className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Desktop Actions - Show on tablet (md) and up */}
            <div className="hidden md:flex items-center gap-3">
              {/* Login */}
              <a
                href="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                Login
              </a>

              {/* CTA Button */}
              <a
                href="/sign-up"
                className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 whitespace-nowrap"
              >
                Get Started
              </a>
            </div>

            {/* Mobile Menu Button - Only on small screens */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setMenuState(!menuState)}
                className="p-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {menuState ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {menuState && (
            <div className="md:hidden absolute top-full left-0 right-0 border-b border-border shadow-2xl bg-background/100 backdrop-blur-none">
              <div className="px-6 py-6 space-y-4">
                {/* Nav Links */}
                <ul className="space-y-2">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        onClick={() => setMenuState(false)}
                        className="block px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>

                {/* Divider */}
                <div className="border-t border-border" />

                {/* Auth Buttons */}
                <div className="space-y-3 pt-4">
                  <a
                    href="/login"
                    className="block w-full text-center px-4 py-3 rounded-xl font-medium border border-border text-foreground hover:bg-secondary transition-colors"
                  >
                    Login
                  </a>
                  <a
                    href="/sign-up"
                    className="block w-full text-center px-4 py-3 rounded-xl font-semibold text-primary-foreground bg-primary hover:opacity-90 transition-all shadow-lg shadow-primary/25"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
