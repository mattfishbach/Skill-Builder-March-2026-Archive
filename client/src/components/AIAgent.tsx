import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X, CheckCircle, AlertCircle, ChevronRight, BrainCircuit, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

interface AIAgentProps {
  isOpen: boolean;
  onClose: () => void;
  triggerContext?: string;
}

type AgentStep = 'intro' | 'input' | 'analyzing' | 'feedback' | 'wrapup';

interface FeedbackData {
  score: number;
  message: string;
  strengths: string[];
  improvements: string[];
}

const MODULE_CONFIG = {
  id: 'project_stakeholders',
  prompt: `The project manager needs the authority and support from the sponsor to work with project stakeholders to deliver the following objective from the scope statement:

Objective 1: Decrease rescheduling procedures by 75%

Who do you believe the stakeholders are and why are those stakeholders critical to the project?`,
  idealAnswer: `To ensure rescheduling procedures are decreased, facilities must be available to meet patient demand. This may require changing the available hours for procedure rooms and ensuring they are appropriately staffed during those hours.

Nicholas Anderson (VP General Services) and David Moore (Facilities) are the owners of the procedure rooms, so they will need to be consulted about availability, facility capacity, and the equipment used during procedures.

If staffing shortages cause reschedules, Dr. Samuel Tan (Physician Services) and Christina Garcia (Director of Nursing) would be needed to ensure the technicians, doctors, and nurses are available to reduce the rescheduling times and meet this project objective.`
};

export function AIAgent({ isOpen, onClose, triggerContext }: AIAgentProps) {
  const [step, setStep] = useState<AgentStep>('intro');
  const [input, setInput] = useState('');
  const [attempt, setAttempt] = useState(1);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [history, setHistory] = useState<{ input: string; feedback: FeedbackData }[]>([]);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  
  useEffect(() => {
    if (isOpen) {
      setStep('intro');
      setAttempt(1);
      setInput('');
      setFeedback(null);
      setHistory([]);
      setFinalScore(0);
    }
  }, [isOpen]);

  const handleStart = () => {
    setStep('input');
  };

  const handleSubmit = async () => {
    if (!input.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    setStep('analyzing');
    
    try {
      const response = await fetch('/api/submit-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          moduleId: MODULE_CONFIG.id,
          attemptNumber: attempt,
          userResponse: input,
          prompt: MODULE_CONFIG.prompt,
          idealAnswer: MODULE_CONFIG.idealAnswer,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit response');
      }

      const attemptData = await response.json();
      
      const newFeedback: FeedbackData = {
        score: attemptData.score,
        message: attemptData.feedback,
        strengths: attemptData.strengths,
        improvements: attemptData.improvements,
      };
      
      setFeedback(newFeedback);
      setHistory(prev => [...prev, { input, feedback: newFeedback }]);
      setFinalScore(newFeedback.score);
      
      // If score is 4 or 5, or this is the second attempt, go to wrap-up
      if (newFeedback.score >= 4 || attempt >= 2) {
        setStep('wrapup');
      } else {
        setStep('feedback');
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Failed to get feedback. Please try again.');
      setStep('input');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevise = () => {
    setAttempt(2);
    setStep('input');
  };

  const getSkillLabel = (score: number) => {
    switch(score) {
      case 1: return 'Novice';
      case 2: return 'Basic';
      case 3: return 'Competent';
      case 4: return 'Proficient';
      case 5: return 'Expert';
      default: return 'Competent';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            data-testid="agent-backdrop"
          />
          
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-lg bg-background border-l shadow-2xl z-50 flex flex-col overflow-hidden"
            data-testid="agent-panel"
          >
            <div className="flex items-center justify-between p-6 border-b bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-lg leading-tight">Skill Builder</h2>
                  <p className="text-xs text-muted-foreground">Project Stakeholders Module</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted" data-testid="button-close">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto relative bg-slate-50/50 dark:bg-slate-900/20">
              {/* Step: Intro */}
              {step === 'intro' && (
                <div className="p-8 flex flex-col items-center justify-center h-full text-center space-y-6">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-accent/20 to-blue-500/20 flex items-center justify-center mb-4"
                  >
                    <BrainCircuit className="w-12 h-12 text-accent" />
                  </motion.div>
                  
                  <div className="space-y-4 max-w-md mx-auto">
                    <div className="p-4 bg-background border rounded-lg shadow-sm text-left space-y-4">
                      <p className="text-sm italic text-muted-foreground">
                        SKILL BUILDER: This 5-6 minute activity allows you to express understanding in your own words, then refine your thinking based on immediate feedback. Start by reviewing the question below and typing out a response.
                      </p>
                      
                      <div className="space-y-2">
                         <p className="text-sm">
                           The project manager needs the authority and support from the sponsor to work with project stakeholders to deliver the following objective from the scope statement:
                         </p>
                         <p className="text-sm font-medium pl-4 border-l-2 border-accent/50">
                           Objective 1: Decrease rescheduling procedures by 75%
                         </p>
                         <p className="text-sm font-bold text-foreground">
                           Who do you believe the stakeholders are and why are those stakeholders critical to the project?
                         </p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleStart} 
                    className="w-full max-w-md bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20"
                    data-testid="button-start"
                  >
                    Start Exercise
                  </Button>
                </div>
              )}

              {/* Step: Input */}
              {step === 'input' && (
                <div className="p-6 h-full flex flex-col">
                  <div className="mb-6 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-muted-foreground">
                        {attempt === 1 ? 'Initial Response' : 'Revision'}
                      </span>
                      {history.length > 0 && (
                         <span className="text-accent font-medium" data-testid="text-previous-score">
                           Previous: {getSkillLabel(history[history.length-1].feedback.score)} ({history[history.length-1].feedback.score}/5)
                         </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <div className={`h-1.5 flex-1 rounded-full ${attempt >= 1 ? 'bg-accent' : 'bg-muted'}`} />
                      <div className={`h-1.5 flex-1 rounded-full ${attempt >= 2 ? 'bg-accent' : 'bg-muted'}`} />
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-4">
                    <Card className="p-4 bg-muted/30 border-dashed">
                      <p className="text-sm font-medium text-foreground/80">
                        Prompt: Who do you believe the stakeholders are for "Decreasing rescheduling procedures by 75%" and why are they critical?
                      </p>
                    </Card>
                    
                    <Textarea 
                      placeholder="Type your response here..." 
                      className="flex-1 resize-none p-4 text-base leading-relaxed bg-background shadow-sm focus-visible:ring-accent"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      autoFocus
                      data-testid="input-response"
                    />
                  </div>

                  <div className="pt-6 mt-auto">
                    <Button 
                      onClick={handleSubmit} 
                      disabled={!input.trim() || isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 gap-2"
                      data-testid="button-submit"
                    >
                      <Send className="w-4 h-4" /> Submit Response
                    </Button>
                  </div>
                </div>
              )}

              {/* Step: Analyzing */}
              {step === 'analyzing' && (
                <div className="h-full flex flex-col items-center justify-center space-y-8 p-8 text-center">
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="w-20 h-20 rounded-full border-4 border-muted border-t-accent"
                    />
                    <motion.div
                      animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-accent/10 rounded-full blur-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Analyzing your response...</h3>
                    <p className="text-sm text-muted-foreground">Comparing with key stakeholders and roles.</p>
                  </div>
                </div>
              )}

              {/* Step: Feedback (shown only when score is 1-3 on first attempt) */}
              {step === 'feedback' && feedback && (
                <div className="p-6 space-y-6">
                  <div className="bg-background p-4 rounded-xl border shadow-sm">
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-3">Skill Level</p>
                    
                    <div className="flex gap-2 mb-3">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <motion.div
                          key={level}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: level * 0.1 }}
                          className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-bold text-sm ${
                            level <= feedback.score
                              ? feedback.score >= 4 ? 'bg-emerald-500 border-emerald-500 text-white' 
                                : feedback.score >= 3 ? 'bg-[#0a66c2] border-[#0a66c2] text-white'
                                : 'bg-amber-500 border-amber-500 text-white'
                              : 'bg-muted/30 border-muted text-muted-foreground/30'
                          }`}
                          data-testid={`box-level-${level}`}
                        >
                          {level}
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="flex items-baseline gap-2" data-testid="text-score">
                      <span className={`text-xl font-bold ${
                        feedback.score >= 4 ? 'text-emerald-600' : 
                        feedback.score >= 3 ? 'text-[#0a66c2]' : 'text-amber-500'
                      }`}>
                        {getSkillLabel(feedback.score)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({feedback.score}/5)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-accent" /> AI Feedback
                    </h4>
                    <p className="text-sm leading-relaxed text-foreground/90 bg-accent/5 p-4 rounded-lg border border-accent/10" data-testid="text-feedback">
                      {feedback.message}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {feedback.strengths.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-semibold text-muted-foreground uppercase">What you did well</h5>
                        <ul className="space-y-1">
                          {feedback.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {feedback.improvements.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-semibold text-muted-foreground uppercase">Areas to improve</h5>
                        <ul className="space-y-1">
                          {feedback.improvements.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase">Your Answer</h5>
                    <div className="bg-muted/30 p-3 rounded-md text-sm text-muted-foreground italic line-clamp-3">
                      "{input}"
                    </div>
                  </div>
                  
                  <div className="p-4 bg-background border rounded-lg text-sm text-center">
                    <button 
                      onClick={handleRevise}
                      className="text-[#0a66c2] hover:underline font-medium"
                      data-testid="link-revise"
                    >
                      Click here to revise one more time for a final boost to your skill score.
                    </button>
                  </div>
                </div>
              )}

              {/* Step: Wrap Up */}
              {step === 'wrapup' && (
                <div className="p-8 flex flex-col items-center justify-center h-full text-center space-y-6">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: 'spring' }}
                    className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
                      finalScore >= 4 ? 'bg-gradient-to-br from-emerald-400/30 to-emerald-600/30' : 'bg-gradient-to-br from-[#0a66c2]/20 to-blue-500/20'
                    }`}
                  >
                    <Trophy className={`w-12 h-12 ${finalScore >= 4 ? 'text-emerald-500' : 'text-[#0a66c2]'}`} />
                  </motion.div>
                  
                  <div className="space-y-4 max-w-md mx-auto">
                    <h3 className="text-2xl font-bold">Activity Complete!</h3>
                    
                    <div className="bg-background p-6 rounded-xl border shadow-sm">
                      <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-4">Your Final Skill Level</p>
                      
                      <div className="flex gap-2 justify-center mb-4">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <motion.div
                            key={level}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: level * 0.15 }}
                            className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-bold ${
                              level <= finalScore
                                ? finalScore >= 4 ? 'bg-emerald-500 border-emerald-500 text-white' 
                                  : finalScore >= 3 ? 'bg-[#0a66c2] border-[#0a66c2] text-white'
                                  : 'bg-amber-500 border-amber-500 text-white'
                                : 'bg-muted/30 border-muted text-muted-foreground/30'
                            }`}
                          >
                            {level}
                          </motion.div>
                        ))}
                      </div>
                      
                      <div className="text-center">
                        <span className={`text-2xl font-bold ${
                          finalScore >= 4 ? 'text-emerald-600' : 
                          finalScore >= 3 ? 'text-[#0a66c2]' : 'text-amber-500'
                        }`}>
                          {getSkillLabel(finalScore)}
                        </span>
                        <span className="text-lg text-muted-foreground ml-2">
                          ({finalScore}/5)
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      This skill value will be added to your <span className="font-semibold text-foreground">Skill Credits</span> shown at the end of the course.
                    </p>
                  </div>

                  <Button 
                    onClick={onClose} 
                    className="w-full max-w-md bg-accent hover:bg-accent/90 text-white"
                    data-testid="button-continue-course"
                  >
                    Continue Course <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
