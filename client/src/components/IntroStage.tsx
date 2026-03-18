import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import knowledgeGraphImage from '@assets/Screenshot_2026-01-13_at_12.04.14_PM_1768334709830.png';

interface IntroStageProps {
  onComplete: () => void;
}

const bullets = [
  "AI-powered learning adapts to your skill level and provides personalized feedback",
  "Practice real-world scenarios in a safe environment before applying skills on the job",
  "Build confidence through iterative learning with immediate, constructive guidance",
  "Earn skill credits that demonstrate your competency to employers and colleagues"
];

function YinYangIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2" fill="white"/>
      <path d="M50,98 A48,48 0 0,1 50,2 A24,24 0 0,1 50,50 A24,24 0 0,0 50,98" fill="currentColor"/>
      <circle cx="50" cy="74" r="7" fill="white"/>
      <circle cx="50" cy="26" r="7" fill="currentColor"/>
    </svg>
  );
}

export function IntroStage({ onComplete }: IntroStageProps) {
  const [step, setStep] = useState(0);
  const showYinYang = step >= 0;
  const showWhiteCallout = step >= 1;
  const showBlackCallout = step >= 2;
  const showBullets = step >= 3;
  const currentBullet = step - 3;

  const handleNext = () => {
    if (step < bullets.length + 2) {
      setStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const isLastBullet = step === bullets.length + 2;
  const canGoBack = step > -1;

  const handleBack = () => {
    if (step > -1) {
      setStep(prev => prev - 1);
    }
  };

  // Auto-advance from step 1 (white callout) to step 2 (black callout)
  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => {
        setStep(2);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a66c2] to-[#004182] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="relative w-full max-w-5xl mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="text-center mb-6">
              <h1 className="text-white font-bold text-7xl mb-3" style={{ fontFamily: "'Source Serif Pro', serif" }}>SKILL BUILDER</h1>
              <p className="text-white/80 text-3xl" style={{ fontFamily: "'Source Serif Pro', serif" }}>AI tutoring agent for hands-on practice and skill growth</p>
            </div>
            <div className="h-80 rounded-xl flex items-center justify-center relative overflow-hidden">
              <img 
                src={knowledgeGraphImage} 
                alt="LinkedIn Knowledge Graph" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              <AnimatePresence>
                {showYinYang && (
                  <motion.div
                    initial={{ y: 160, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="relative z-10"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="relative"
                    >
                      <YinYangIcon className="w-[10rem] h-[10rem] text-[#0a66c2] drop-shadow-2xl" />
                      
                      <AnimatePresence>
                        {showWhiteCallout && (
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute right-[60%] top-1/4 -translate-y-1/2 flex items-center"
                          >
                            <div className="bg-white rounded-lg px-5 py-3 shadow-lg whitespace-nowrap">
                              <p className="text-[#0a66c2] font-semibold text-2xl" style={{ fontFamily: "'Source Serif Pro', serif" }}>Enhance What We Have</p>
                            </div>
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: 48 }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                              className="h-0.5 bg-[#70c4e8]" 
                            />
                            <motion.svg 
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.6 }}
                              className="w-5 h-5 text-[#70c4e8]" 
                              viewBox="0 0 24 24" 
                              fill="currentColor"
                            >
                              <path d="M12 0L13.5 6.5L18 3L14.5 7.5L21 6L14.5 9L21 12L14.5 12L21 18L14.5 14.5L18 21L13.5 14.5L12 21L10.5 14.5L6 21L9.5 14.5L3 18L9.5 12L3 12L9.5 9L3 6L9.5 7.5L6 3L10.5 6.5L12 0Z"/>
                            </motion.svg>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      <AnimatePresence>
                        {showBlackCallout && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute left-[60%] bottom-1/4 translate-y-1/2 flex items-center"
                          >
                            <motion.svg 
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.6 }}
                              className="w-5 h-5 text-[#70c4e8]" 
                              viewBox="0 0 24 24" 
                              fill="currentColor"
                            >
                              <path d="M12 0L13.5 6.5L18 3L14.5 7.5L21 6L14.5 9L21 12L14.5 12L21 18L14.5 14.5L18 21L13.5 14.5L12 21L10.5 14.5L6 21L9.5 14.5L3 18L9.5 12L3 12L9.5 9L3 6L9.5 7.5L6 3L10.5 6.5L12 0Z"/>
                            </motion.svg>
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: 48 }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                              className="h-0.5 bg-[#70c4e8]" 
                            />
                            <div className="bg-white rounded-lg px-5 py-3 shadow-lg whitespace-nowrap">
                              <p className="text-[#0a66c2] font-semibold text-2xl" style={{ fontFamily: "'Source Serif Pro', serif" }}>Build for the Future</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="w-full max-w-2xl">
          <div className="h-[140px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {showBullets && currentBullet >= 0 && (
                <motion.div
                  key={currentBullet}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 w-full flex items-center"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold">{currentBullet + 1}</span>
                    </div>
                    <p className="text-white text-xl leading-relaxed" style={{ fontFamily: "'Source Serif Pro', serif" }}>{bullets[currentBullet]}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col items-center mt-6 gap-3">
            {showBullets && (
              <div className="flex gap-2">
                {bullets.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx <= currentBullet ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleBack}
                disabled={!canGoBack}
                className={`gap-2 ${canGoBack 
                  ? 'bg-white/20 text-white hover:bg-white/30 border border-white/30' 
                  : 'bg-white/10 text-white/40 border border-white/10 cursor-not-allowed'
                }`}
                data-testid="button-intro-back"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              <Button
                onClick={handleNext}
                disabled={isLastBullet}
                className={`gap-2 ${
                  isLastBullet 
                    ? 'bg-white/10 text-white/40 border border-white/10 cursor-not-allowed' 
                    : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                }`}
                data-testid="button-intro-next"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <button
              onClick={onComplete}
              className="text-white/70 hover:text-white text-sm underline underline-offset-2 transition-colors"
              data-testid="button-intro-demo"
            >
              Jump to Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
