import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, Trophy } from 'lucide-react';

const takeaways = [
  "Skill Builders help learners practice applying concepts in realistic scenarios",
  "AI-powered feedback provides immediate, personalized guidance without instructor delay",
  "The 1-5 skill scoring system gives clear, actionable insight into competency levels",
  "Iterative practice with revision opportunities reinforces learning and builds confidence"
];

export function ConclusionStage() {
  const [currentTakeaway, setCurrentTakeaway] = useState(0);

  const handleNext = () => {
    if (currentTakeaway < takeaways.length - 1) {
      setCurrentTakeaway(prev => prev + 1);
    }
  };

  const isLastTakeaway = currentTakeaway === takeaways.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a66c2] to-[#004182] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Source Serif Pro', serif" }}>Takeaways</h1>
          <p className="text-white/70 text-lg" style={{ fontFamily: "'Source Serif Pro', serif" }}>Key insights from this demonstration</p>
        </div>

        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTakeaway}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 min-h-[120px] flex items-center"
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">{currentTakeaway + 1}</span>
                </div>
                <p className="text-white text-xl leading-relaxed" style={{ fontFamily: "'Source Serif Pro', serif" }}>{takeaways[currentTakeaway]}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-2">
              {takeaways.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx <= currentTakeaway ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>

            {!isLastTakeaway && (
              <Button
                onClick={handleNext}
                className="bg-white/20 text-white hover:bg-white/30 border border-white/30 gap-2"
                data-testid="button-takeaway-next"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}

            {isLastTakeaway && (
              <div className="text-white/70 text-sm">
                Thank you for exploring the Skill Builder demo
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
