import { Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ScrollReveal } from '../ui/scroll-reveal';

const missionItems = [
  {
    title: 'Our mission',
    text: 'Help Nigerian talent experience real workplace tasks, get clear feedback, and build proof employers can trust.',
    tone: 'bg-[#d9ecff]',
  },
  {
    title: 'Our vision',
    text: 'A job market where graduates, NYSC members, switchers, and junior talent can show skill before they get hired.',
    tone: 'bg-[#dde5f7]',
  },
  {
    title: 'Our goal',
    text: 'Make practical career proof simple, affordable, and useful for learners, teams, and hiring managers.',
    tone: 'bg-[#e4eff7]',
  },
];

export function MissionPanel() {
  return (
    <section className="bg-white px-5 py-20 text-[#222b4b] sm:py-24">
      <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[0.78fr_1fr] lg:gap-20">
        <ScrollReveal className="lg:pr-8">
          <span className="inline-flex rounded-md bg-[#c2d6ec] px-4 py-2 text-sm font-medium text-[#4f6680]">
            Serving since 2025
          </span>
          <h2 className="mt-7 max-w-[430px] text-[34px] font-normal leading-[1.08] tracking-[-0.035em] sm:text-[44px]">
            Building proof for real careers
          </h2>

          <div className="mt-14 flex items-center gap-5">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-[#222b4b] text-white">
              <Headphones className="h-8 w-8" strokeWidth={2.5} />
            </span>
            <div>
              <p className="text-sm font-medium text-[#667b92]">Talk to us anytime</p>
              <Link to="/organization" className="text-[23px] font-normal tracking-[-0.02em] text-[#222b4b]">
                Contact Sales
              </Link>
            </div>
          </div>
        </ScrollReveal>

        <div className="space-y-6">
          {missionItems.map((item, index) => (
            <ScrollReveal
              key={item.title}
              as="article"
              delay={index * 0.08}
              className={`rounded-[9px] p-8 shadow-[0_22px_74px_-58px_rgba(9,35,67,0.75)] sm:p-9 ${item.tone}`}
            >
              <h3 className="text-[26px] font-normal tracking-[-0.025em] text-[#222b4b]">{item.title}</h3>
              <p className="mt-4 max-w-2xl text-[16px] font-medium leading-7 text-[#60758c]">
                {item.text}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MissionPanel;
