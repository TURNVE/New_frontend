"use client";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const integrations = [
  { name: "Google", url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "LinkedIn", url: "https://cdn-icons-png.flaticon.com/512/174/174857.png" },
  { name: "Slack", url: "https://cdn-icons-png.flaticon.com/512/2111/2111615.png" },
  { name: "Microsoft", url: "https://cdn-icons-png.flaticon.com/512/174/174872.png" },
  { name: "Facebook", url: "https://cdn-icons-png.flaticon.com/512/733/733547.png" },
  { name: "Stripe", url: "https://cdn-icons-png.flaticon.com/512/5968/5968381.png" },
  { name: "Dropbox", url: "https://cdn-icons-png.flaticon.com/512/888/888853.png" },
  { name: "Jira", url: "https://cdn-icons-png.flaticon.com/512/906/906324.png" },
  { name: "Netflix", url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
  { name: "Square", url: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png" },
  { name: "Shopify", url: "https://cdn-icons-png.flaticon.com/512/732/732218.png" },
  { name: "Zapier", url: "https://cdn-icons-png.flaticon.com/512/5968/5968755.png" },
  { name: "Google Drive", url: "https://cdn-icons-png.flaticon.com/512/5968/5968520.png" },
  { name: "YouTube", url: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png" },
  { name: "Airtable", url: "https://cdn-icons-png.flaticon.com/512/5968/5968885.png" },
  { name: "Discord", url: "https://cdn-icons-png.flaticon.com/512/2111/2111370.png" },
];

export default function IntegrationsSection() {
  return (
    <section className="max-w-7xl mx-auto my-12 sm:my-16 lg:my-20 px-4 sm:px-6 lg:px-8">
      <div className="border border-gray-100 p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl sm:rounded-3xl bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          {/* Left Side */}
          <div className="text-center lg:text-left">
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-4 sm:mb-5">
              Learn from top organizations
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 leading-relaxed">
              Turnve provides AI-powered simulations that mirror real-world scenarios used by top companies. 
              Gain practical experience in project management, team collaboration, and strategic decision-making.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 sm:py-3 rounded-xl font-medium hover:bg-blue-700 transition-all whitespace-nowrap text-sm sm:text-base tap-target">
                <Link to="/start-simulation">Start Learning</Link>
              </Button>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto border-gray-200 px-6 py-2.5 sm:py-3 rounded-xl font-medium hover:bg-gray-50 transition-all whitespace-nowrap text-sm sm:text-base tap-target"
              >
                <Link to="/about">View Case Studies →</Link>
              </Button>
            </div>
          </div>

          {/* Right Side - Integration Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
            {integrations.map((integration, idx) => (
              <div
                key={idx}
                className="aspect-square p-2 sm:p-3 bg-gray-50 border border-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-md transition-all duration-300 tap-target"
                title={integration.name}
              >
                <img
                  src={integration.url}
                  alt={integration.name}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
