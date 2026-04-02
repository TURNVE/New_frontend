import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const titles = useMemo(
    () => ["Practical", "Hands-on", "Real-world", "Industry-ready", "Professional"],
    []
  );

  useEffect(() => {
    const currentTitle = titles[titleNumber];
    let charIndex = 0;
    
    if (isTyping) {
      // Typing effect
      const typeInterval = setInterval(() => {
        if (charIndex <= currentTitle.length) {
          setDisplayedText(currentTitle.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
          // Wait before deleting
          setTimeout(() => {
            setIsTyping(true);
          }, 2000);
        }
      }, 100);
      
      return () => clearInterval(typeInterval);
    } else {
      // Deleting effect
      const deleteInterval = setInterval(() => {
        if (charIndex >= 0) {
          setDisplayedText(currentTitle.slice(0, charIndex));
          charIndex--;
        } else {
          clearInterval(deleteInterval);
          // Move to next title
          setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
          setIsTyping(true);
        }
      }, 50);
      
      return () => clearInterval(deleteInterval);
    }
  }, [titleNumber, titles, isTyping]);

  return (
    <div className="w-full bg-white">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex gap-6 sm:gap-8 py-12 sm:py-16 lg:py-20 xl:py-24 items-center justify-center flex-col">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button variant="secondary" size="sm" className="gap-2 text-xs sm:text-sm h-8 sm:h-9">
              <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-blue-500"></span>
              </span>
              <span className="hidden sm:inline">New: AI Career Coach</span>
              <span className="sm:hidden">AI Coach</span>
            </Button>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-center font-bold text-gray-900 leading-none">
              <div className="flex flex-col items-center justify-center">
                {/* Responsive font sizes */}
                <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-1 sm:mb-2">
                  Build
                </span>
                <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-blue-600 mb-1 sm:mb-2 min-h-[1.2em]">
                  {displayedText}
                  <span className="animate-pulse">|</span>
                </span>
                <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                  Career Experience
                </span>
              </div>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-center text-gray-600 max-w-2xl mx-auto px-4 text-sm sm:text-base lg:text-lg"
          >
            Master real-world management skills through AI-powered simulations. 
            Build your portfolio and accelerate your career.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto px-4 sm:px-0"
          >
            <Button 
              size="lg" 
              className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base tap-target" 
              onClick={() => window.location.href = '/register'}
            >
              Start Free Trial
              <MoveRight className="w-4 h-4" />
            </Button>
            <Button 
              size="lg" 
              className="w-full sm:w-auto gap-2 font-semibold h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base tap-target" 
              variant="outline" 
              onClick={() => window.location.href = '/about'}
            >
              <Play className="w-4 h-4" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500 pt-2 sm:pt-4 px-4"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0" />
              <span className="whitespace-nowrap">No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0" />
              <span className="whitespace-nowrap">14-day free trial</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0" />
              <span className="whitespace-nowrap">Cancel anytime</span>
            </div>
          </motion.div>

          {/* Stats or Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 pt-4 sm:pt-6 border-t border-gray-100 mt-4 sm:mt-6 px-4"
          >
            <div className="text-center">
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">50K+</p>
              <p className="text-xs sm:text-sm text-gray-500">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">4.9</p>
              <p className="text-xs sm:text-sm text-gray-500">User Rating</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">200+</p>
              <p className="text-xs sm:text-sm text-gray-500">Simulations</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
