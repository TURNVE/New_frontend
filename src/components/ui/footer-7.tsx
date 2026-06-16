import React from "react";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

import { ScrollReveal } from "./scroll-reveal";

interface Footer7Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title?: string;
  };
  sections?: Array<{
    title: string;
    links: Array<{ name: string; href: string }>;
  }>;
  description?: string;
  socialLinks?: Array<{
    icon: React.ReactElement;
    href: string;
    label: string;
  }>;
  copyright?: string;
  legalLinks?: Array<{
    name: string;
    href: string;
  }>;
}

const defaultSections = [
  {
    title: "Product",
    links: [
      { name: "Overview", href: "#" },
      { name: "Pricing", href: "#" },
      { name: "Marketplace", href: "#" },
      { name: "Features", href: "/features" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Our Team", href: "/team" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/business" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Help", href: "#" },
      { name: "Sales", href: "#" },
      { name: "Advertise", href: "#" },
      { name: "Privacy", href: "#" },
    ],
  },
  {
    title: "For Organizations",
    links: [
      { name: "Create Organization", href: "/org/create" },
      { name: "Organization Dashboard", href: "/org/dashboard" },
      { name: "Manage Simulations", href: "/org/simulations" },
      { name: "Invite Clients", href: "/org/clients" },
    ],
  },
];

const defaultSocialLinks = [
  { icon: <Instagram className="size-5" />, href: "#", label: "Instagram" },
  { icon: <Facebook className="size-5" />, href: "#", label: "Facebook" },
  { icon: <Twitter className="size-5" />, href: "#", label: "Twitter" },
  { icon: <Linkedin className="size-5" />, href: "#", label: "LinkedIn" },
];

const defaultLegalLinks = [
  { name: "Terms and Conditions", href: "#" },
  { name: "Privacy Policy", href: "#" },
];

export const Footer7 = ({
  logo = {
    url: "/",
    src: "/turnve-logo-original.jpg",
    alt: "Turnve logo",
    title: "",
  },
  sections = defaultSections,
  description = "A practical career platform for entry-level and transitioning professionals.",
  socialLinks = defaultSocialLinks,
  copyright = "© 2025 Turnve. All rights reserved.",
  legalLinks = defaultLegalLinks,
}: Footer7Props) => {
  return (
    <footer className="relative overflow-hidden bg-[linear-gradient(115deg,#f5f7ff_0%,#fff8f2_52%,#ffffff_100%)] px-5 py-24 text-[#0a142f]">
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(#0a142f0f_1px,transparent_1px),linear-gradient(90deg,#0a142f0f_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="container relative mx-auto">
        <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
          <ScrollReveal className="flex w-full flex-col justify-between gap-6 lg:items-start">
            <div className="flex items-center gap-2 lg:justify-start">
              <a href={logo.url}>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  title={logo.title}
                  className="h-10 w-auto"
                />
              </a>
              {logo.title ? <h2 className="text-xl font-black">{logo.title}</h2> : null}
            </div>
            <p className="max-w-sm text-sm font-medium leading-6 text-slate-600">
              {description}
            </p>
            <ul className="flex items-center space-x-3 text-slate-600">
              {socialLinks.map((social) => (
                <li key={social.label} className="font-medium hover:text-primary">
                  <a
                    href={social.href}
                    aria-label={social.label}
                    className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm transition hover:-translate-y-0.5 hover:text-[#0b6bff]"
                  >
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </ScrollReveal>
          <ScrollReveal direction="left" className="grid w-full gap-6 md:grid-cols-3 lg:gap-20">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-4 font-black">{section.title}</h3>
                <ul className="space-y-3 text-sm text-slate-600">
                  {section.links.map((link) => (
                    <li
                      key={link.name}
                    className="font-semibold hover:text-[#0b6bff]"
                    >
                      <a href={link.href}>{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </ScrollReveal>
        </div>
        <ScrollReveal direction="up" className="mt-12 flex flex-col justify-between gap-4 border-t border-[#0a142f14] py-8 text-xs font-semibold text-slate-500 md:flex-row md:items-center md:text-left">
          <p className="order-2 lg:order-1">{copyright}</p>
          <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row">
            {legalLinks.map((link) => (
              <li key={link.name} className="hover:text-primary">
                <a href={link.href}> {link.name}</a>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </footer>
  );
};
