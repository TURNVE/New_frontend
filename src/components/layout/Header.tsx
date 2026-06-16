import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

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
  const [menuState, setMenuState] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isDark = variant === 'dark';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="border-b border-transparent bg-transparent transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-[72px]">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <span className="rounded-sm bg-white/58 px-2 py-1 backdrop-blur-sm">
                <img src="/turnve-logo-original.jpg" alt="TURNVE" className="h-8 w-auto transition-transform lg:h-9" />
              </span>
            </a>

            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
              <ul className={`flex items-center gap-0.5 rounded-full border px-2 py-1 backdrop-blur-md ${
                isDark && !scrolled ? 'border-white/15 bg-white/8' : 'border-slate-200/70 bg-white/12'
              }`}>
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                        isDark && !scrolled
                          ? 'text-white/72 hover:bg-white/12 hover:text-white'
                          : 'text-slate-600 hover:bg-white/70 hover:text-slate-950'
                      }`}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Login */}
              <a
                href="/login"
                className={`hidden lg:inline-flex rounded-full px-4 py-2 text-sm transition-colors ${
                  isDark && !scrolled
                    ? 'text-white/72 hover:bg-white/12 hover:text-white'
                    : 'text-slate-600 hover:bg-white/70 hover:text-slate-950'
                }`}
              >
                Login
              </a>

              {/* CTA Button */}
              <a
                href="/sign-up"
                className="rounded-full border border-[#0b6bff] bg-[#0b6bff] px-5 py-2.5 text-sm text-white transition-all hover:bg-[#0758d8]"
              >
                Get Started
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuState(!menuState)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isDark && !scrolled ? 'text-white hover:bg-white/12' : 'text-slate-700 hover:bg-white/70'
              }`}
              aria-label="Toggle menu"
            >
              {menuState ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {menuState && (
            <div className="md:hidden absolute top-full left-0 right-0 border-b border-gray-200 bg-white">
              <div className="px-6 py-6 space-y-4">
                {/* Nav Links */}
                <ul className="space-y-2">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        onClick={() => setMenuState(false)}
                        className="block rounded-lg px-4 py-3 text-base text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>

                {/* Divider */}
                <div className="border-t border-gray-200" />

                {/* Auth Buttons */}
                <div className="space-y-3 pt-4">
                  <a
                    href="/login"
                    className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-center text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Login
                  </a>
                  <a
                    href="/sign-up"
                    className="block w-full rounded-xl bg-blue-600 px-4 py-3 text-center text-white transition-all hover:bg-blue-700"
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

export default Header;
