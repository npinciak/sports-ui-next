'use client';

import { MobileNav } from '@/components/ui/mobile-nav';
import Link from 'next/link';

const navItems = [
  { href: '/baseball', label: 'Baseball' },
  { href: '/football', label: 'Football' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block">Sports UI</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center text-sm font-medium transition-colors hover:text-foreground/80"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <MobileNav items={navItems} />
        </div>
      </div>
    </header>
  );
}
