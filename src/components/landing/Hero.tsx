import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { AnimatedGroup } from '../ui/animated-group';
import { cn } from '../../lib/utils';
import { ChevronRight, Menu, X } from 'lucide-react';

const menuItems = [
  { name: 'Features', href: '#features' },
  { name: 'Organization', href: '/organization' },
  { name: 'Solution', href: '#solution' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'About', href: '#about' },
];

const Logo = ({ className }: { className?: string }) => (
  <div className={cn('flex items-center', className)}>
    <img
      src="/turnve-logo-original.jpg"
      alt="TURNVE"
      className="h-9 w-auto object-contain"
    />
  </div>
);

function HeroHeader() {
  const [menuState, setMenuState] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header>
      <nav className={cn('group fixed z-20 w-full border-b transition-colors duration-150', scrolled && 'bg-white/80 backdrop-blur-3xl')}>
        <div className="mx-auto max-w-5xl px-6 transition-all duration-300">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <a href="/" aria-label="home" className="flex items-center space-x-2">
                <Logo />
              </a>
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className={cn('m-auto size-6 duration-200', menuState && 'rotate-180 scale-0 opacity-0')} aria-hidden="true" />
                <X className={cn('absolute inset-0 m-auto size-6 duration-200', !menuState && '-rotate-180 scale-0 opacity-0')} aria-hidden="true" />
              </button>
              <div className="hidden lg:block">
                <ul className="flex gap-8 text-sm">
                  {menuItems.map((item, index) => (
                    <li key={index}><a href={item.href} className="text-gray-600 hover:text-gray-900 block duration-150">{item.name}</a></li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={cn('mb-6 w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none', menuState ? 'flex' : 'hidden lg:flex')}>
              {menuState && (
                <div className="lg:hidden w-full">
                  <ul className="space-y-6 text-base">
                    {menuItems.map((item, index) => (
                      <li key={index}><a href={item.href} className="text-gray-600 hover:text-gray-900 block duration-150">{item.name}</a></li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button asChild variant="outline" size="sm"><a href="/login">Login</a></Button>
                <Button asChild size="sm"><a href="/login">Sign Up</a></Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export function Hero() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden pt-16">
        <section>
          <div className="relative pt-24">
            <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"></div>
            <div className="mx-auto max-w-5xl px-6">
              <div className="sm:mx-auto lg:mr-auto">
                <AnimatedGroup preset="fade">
                  <h1 className="mt-8 max-w-2xl text-balance text-5xl font-bold md:text-6xl lg:mt-16 text-gray-900">
                    Build and Ship 10x faster with TURNVE
                  </h1>
                  <p className="mt-8 max-w-2xl text-pretty text-lg text-gray-600">
                    AI-powered practical career platform helping professionals gain management experience, build portfolios, and land managerial roles.
                  </p>
                  <div className="mt-12 flex items-center gap-2">
                    <div className="bg-gray-900/10 rounded-[14px] border p-0.5">
                      <Button asChild size="lg" className="rounded-xl px-5 text-base">
                        <a href="/program1">Start Building</a>
                      </Button>
                    </div>
                    <Button asChild size="lg" variant="ghost" className="h-[42px] rounded-xl px-5 text-base">
                      <a href="#demo">Request a demo</a>
                    </Button>
                  </div>
                </AnimatedGroup>
              </div>
            </div>
            <AnimatedGroup preset="slide">
              <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                <div aria-hidden className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%" />
                <div className="inset-shadow-2xs ring-background bg-background relative mx-auto max-w-5xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                  <img
                    className="aspect-15/8 relative rounded-2xl border"
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop"
                    alt="TURNVE dashboard"
                    width="1200"
                    height="630"
                  />
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>
        <section className="pb-16 pt-16 md:pb-32">
          <div className="group relative m-auto max-w-5xl px-6">
            <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
              <a href="#customers" className="block text-sm duration-150 hover:opacity-75 text-gray-700">
                <span> Meet Our Customers</span>
                <ChevronRight className="ml-1 inline-block size-3" />
              </a>
            </div>
            <div className="group-hover:blur-xs mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14">
              <div className="flex"><img className="mx-auto h-5 w-fit" src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" height="20" width="auto" /></div>
              <div className="flex"><img className="mx-auto h-4 w-fit" src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn" height="16" width="auto" /></div>
              <div className="flex"><img className="mx-auto h-4 w-fit" src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" height="16" width="auto" /></div>
              <div className="flex"><img className="mx-auto h-5 w-fit" src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" alt="Nike" height="20" width="auto" /></div>
              <div className="flex"><img className="mx-auto h-5 w-fit" src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" height="20" width="auto" /></div>
              <div className="flex"><img className="mx-auto h-4 w-fit" src="https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" alt="Meta" height="16" width="auto" /></div>
              <div className="flex"><img className="mx-auto h-7 w-fit" src="https://upload.wikimedia.org/wikipedia/commons/5/51/Microsoft_logo.svg" alt="Microsoft" height="28" width="auto" /></div>
              <div className="flex"><img className="mx-auto h-6 w-fit" src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_Office_365_%282019%E2%80%93present%29.svg" alt="Office 365" height="24" width="auto" /></div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
