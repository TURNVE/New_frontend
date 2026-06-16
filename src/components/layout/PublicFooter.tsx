import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

import { Footer7 } from '../ui/footer-7';

const publicFooterSections = [
  {
    title: 'Product',
    links: [
      { name: 'Overview', href: '/' },
      { name: 'Services', href: '/services' },
      { name: 'Features', href: '/features' },
      { name: 'Program 2', href: '/program1' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About', href: '/about' },
      { name: 'Our Team', href: '/team' },
      { name: 'Company', href: '/business' },
      { name: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Contact Sales', href: '/organization' },
      { name: 'Testimonials', href: '/testimonial' },
      { name: 'Pricing', href: '/#pricing' },
      { name: 'Login', href: '/login' },
    ],
  },
];

export function PublicFooter() {
  return (
    <Footer7
      logo={{
        url: '/',
        src: '/turnve-logo-original.jpg',
        alt: 'TURNVE logo',
        title: '',
      }}
      sections={publicFooterSections}
      description="TURNVE helps Nigerian graduates, NYSC members, switchers, and junior talent build practical career proof employers can trust."
      socialLinks={[
        { icon: <Instagram className="size-5" />, href: '#', label: 'Instagram' },
        { icon: <Facebook className="size-5" />, href: '#', label: 'Facebook' },
        { icon: <Twitter className="size-5" />, href: '#', label: 'Twitter' },
        { icon: <Linkedin className="size-5" />, href: '#', label: 'LinkedIn' },
      ]}
      copyright="© 2026 TURNVE. All rights reserved."
      legalLinks={[
        { name: 'Terms and Conditions', href: '#' },
        { name: 'Privacy Policy', href: '#' },
      ]}
    />
  );
}

export default PublicFooter;
