import type { ReactNode } from 'react';
import { ThemeToggle } from './theme-toggle';

interface FooterLink {
  name: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  icon: ReactNode;
  href: string;
  label: string;
}

interface Logo {
  url: string;
  src: string;
  alt: string;
  title: string;
}

interface Footer7Props {
  logo: Logo;
  sections: FooterSection[];
  description: string;
  socialLinks: SocialLink[];
  copyright: string;
  legalLinks: FooterLink[];
}

export function Footer7({
  logo,
  sections,
  description,
  socialLinks,
  copyright,
  legalLinks,
}: Footer7Props) {
  return (
    <footer className="bg-[#0A142F] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <a href={logo.url} className="inline-block mb-4">
              <img src={logo.src} alt={logo.alt} className="h-10 w-10 rounded-full" />
            </a>
            <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-sm">
              {description}
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Sections */}
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm">{copyright}</p>
            <div className="flex items-center gap-6">
              {/* Theme Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-white/50 text-sm hidden sm:inline">Theme:</span>
                <ThemeToggle />
              </div>
              {legalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-white/50 hover:text-white transition-colors text-sm"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
