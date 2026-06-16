import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const menuItems = [
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Services', href: '/services' },
  { name: 'Company', href: '/business' },
  { name: 'Team', href: '/team' },
  { name: 'Features', href: '/features' },
];

interface HeaderProps {
  variant?: 'light' | 'dark';
}

export function Header({ variant = 'light' }: HeaderProps) {
  void variant;
  const [menuState, setMenuState] = useState(false);
  const navigate = useNavigate();
  const navClass = 'border-b border-slate-200/80 bg-white text-[#0a142f]';
  const logoClass = 'h-8 w-auto max-w-[132px] object-contain lg:h-9';
  const menuListClass = 'flex items-center gap-0.5 rounded-full border border-slate-200 bg-white px-2 py-1';
  const navItemClass = 'rounded-full px-3 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950';
  const desktopLoginClass = 'hidden rounded-full px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950 lg:inline-flex';
  const desktopCtaClass = 'rounded-full border border-[#0b6bff] bg-[#0b6bff] px-5 py-2.5 text-sm text-white transition-all hover:bg-[#0758d8]';
  const menuButtonClass = 'rounded-lg p-2 text-slate-800 transition-colors hover:bg-slate-100 lg:hidden';
  const mobileNavClass = 'md:hidden absolute top-full left-0 right-0 border-b border-gray-200 bg-white';
  const mobileLinkClass = 'block rounded-lg px-4 py-3 text-base text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900';
  const mobileLoginClass = 'block w-full rounded-xl border border-gray-300 px-4 py-3 text-center text-gray-700 transition-colors hover:bg-gray-50';
  const mobileCtaClass = 'block w-full rounded-xl bg-blue-600 px-4 py-3 text-center text-white transition-all hover:bg-blue-700';

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor || anchor.target && anchor.target !== '_self') return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      const url = new URL(anchor.href, window.location.origin);
      if (url.origin !== window.location.origin) return;

      event.preventDefault();
      navigate(`${url.pathname}${url.search}${url.hash}`);
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [navigate]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className={navClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-[72px]">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src="/turnve-logo-original.jpg"
                alt="TURNVE"
                className={logoClass}
              />
            </Link>

            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
              <ul className={menuListClass}>
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={navItemClass}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Login */}
              <Link
                to="/login"
                className={desktopLoginClass}
              >
                Login
              </Link>

              {/* CTA Button */}
              <Link
                to="/sign-up"
                className={desktopCtaClass}
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuState(!menuState)}
              className={menuButtonClass}
              aria-label="Toggle menu"
            >
              {menuState ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {menuState && (
            <div className={mobileNavClass}>
              <div className="px-6 py-6 space-y-4">
                {/* Nav Links */}
                <ul className="space-y-2">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        onClick={() => setMenuState(false)}
                        className={mobileLinkClass}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Divider */}
                <div className="border-t border-gray-200" />

                {/* Auth Buttons */}
                <div className="space-y-3 pt-4">
                  <Link
                    to="/login"
                    className={mobileLoginClass}
                  >
                    Login
                  </Link>
                  <Link
                    to="/sign-up"
                    className={mobileCtaClass}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
