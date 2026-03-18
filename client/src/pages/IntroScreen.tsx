import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { X, Sparkles } from 'lucide-react';
const comparisonData = [
  {
    skillBuilder: 'Hands-on and task-based scenarios',
    rolePlay: 'Conversational scenarios',
  },
  {
    skillBuilder: '- Software and tool training\n- Non-conversational business concepts\n- Technical walkthrough and conceptual\n- Screencap courses',
    rolePlay: '- Manager and leadership development\n- Customer-facing roles and soft skills\n- Interpersonal growth and career/job search\n- Business strategy and operations',
  },
  {
    skillBuilder: 'Focus on written responses and handouts',
    rolePlay: 'Focus on spoken conversational dynamics',
  },
  {
    skillBuilder: 'Feedback happens in stages',
    rolePlay: 'Feedback at conclusion',
  },
  {
    skillBuilder: 'AI evaluation of modified handouts (XLS files, etc)',
    rolePlay: '',
  },
];

function OverviewOverlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative w-[86vw] max-w-6xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/30 shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #312e81 0%, #1e3a8a 30%, #1d4ed8 60%, #7c3aed 100%)' }}
        onClick={(e) => e.stopPropagation()}
        data-testid="overlay-overview"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white"
          data-testid="button-close-overview"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-10 py-8">
          <h2
            className="text-amber-300 font-bold text-[38px] mb-3 tracking-wide text-left"
            style={{ fontFamily: "'Source Serif Pro', serif" }}
            data-testid="text-overview-title"
          >
            Overview
          </h2>
          <p className="text-white/80 text-xl leading-relaxed mb-4 text-left">
            Skill Builder is an AI-driven coach that encourages hands-on practice throughout the learning flow.
          </p>

          <p className="text-white/80 text-xl leading-relaxed mb-4 text-left">
            It presents scenario-based tasks, evaluates the user's responses with immediate feedback/scoring, and encourages the user to iteratively improve their thinking.
          </p>

          <p className="text-white/80 text-xl leading-relaxed mb-12 text-left">
            The end result is deeper understanding and measurable skill gains.
          </p>


          <h3
            className="text-amber-300 font-bold text-[38px] mt-12 mb-2 tracking-wide text-left"
            style={{ fontFamily: "'Source Serif Pro', serif" }}
          >
            Skill Builder vs Role Play
          </h3>
          <p className="text-white/80 text-xl leading-relaxed mb-5 text-left">
            Skill Builder works in tandem with Role Play to offer practice across the full spectrum of course content
          </p>

          <div className="mt-8 overflow-hidden rounded-xl border-2 border-amber-400/40 shadow-[0_0_30px_rgba(251,191,36,0.1)]">
            <table className="w-full" data-testid="table-comparison">
              <thead>
                <tr style={{ background: '#f59e0b' }}>
                  <th className="px-6 py-5 text-left text-indigo-950 font-bold text-xl tracking-wide w-1/2">
                    Skill Builder
                  </th>
                  <th className="px-6 py-5 text-left text-indigo-950 font-bold text-xl tracking-wide w-1/2 border-l border-amber-600/30">
                    Role Play
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-gray-200 bg-gray-150"
                    style={{ backgroundColor: '#e8e8e8' }}
                  >
                    <td className="px-6 py-4 text-gray-900 text-[19px] leading-relaxed align-top whitespace-pre-wrap">
                      {row.skillBuilder}
                    </td>
                    <td className="px-6 py-4 text-gray-900 text-[19px] leading-relaxed align-top border-l border-gray-200 whitespace-pre-wrap">
                      {row.rolePlay}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function IntroScreen() {
  const [, navigate] = useLocation();
  const [showOverview, setShowOverview] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          background: 'linear-gradient(135deg, #2d1b69 0%, #1e3a7a 25%, #0a66c2 50%, #2563eb 70%, #1e3a7a 85%, #2d1b69 100%)',
        }}
      />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-20 -left-20 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(120,60,200,0.35) 0%, transparent 65%)' }}
        />
        <div
          className="absolute -bottom-32 -right-20 w-[650px] h-[650px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(40,150,220,0.30) 0%, transparent 60%)' }}
        />
        <div
          className="absolute top-[30%] right-[5%] w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(80,120,220,0.25) 0%, transparent 55%)' }}
        />
      </div>
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center"
        >
          <p
            className="text-white/70 text-xl uppercase tracking-[0.25em] mb-8 font-medium"
            data-testid="text-brand-label"
          >
            LinkedIn Learning
          </p>

          <div className="flex items-center gap-4 mb-10">
            <Sparkles className="w-16 h-16 text-white" />
            <h1
              className="text-white font-bold text-7xl uppercase tracking-wide"
              style={{ fontFamily: "'Source Serif Pro', serif" }}
              data-testid="text-main-title"
            >
              Skill Builder <span className="text-3xl font-semibold text-white/70">(v2)</span>
            </h1>
          </div>

          <p className="text-white/80 text-2xl leading-relaxed mb-3" data-testid="text-tagline-1">
            in-the-flow AI coach
          </p>
          <p className="text-white/80 text-2xl leading-relaxed mb-14" data-testid="text-tagline-2">
            for hands-on practice and skill gain
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-5 mb-12"
          >
            {['Enhance learning interactivity to reduce churn', 'Allow enterprise to track skill gains and justify ROI'].map((label) => (
              <span
                key={label}
                className="px-6 py-2.5 rounded-full border border-white/30 text-white/90 text-lg font-medium bg-white/5"
                data-testid={`pill-${label.toLowerCase().replace(/\s/g, '-')}`}
              >
                {label}
              </span>
            ))}
          </motion.div>

          <p className="text-white/80 text-2xl mb-14" data-testid="text-credits">
            Presented by Matt Fishbach, Minyan He, and Lexie Li
          </p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center justify-center gap-6"
          >
            <button
              onClick={() => setShowOverview(true)}
              className="group relative px-9 py-3.5 rounded-md text-lg font-semibold tracking-wide transition-all duration-200 bg-white border border-white/80 text-indigo-900 hover:bg-amber-200 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              data-testid="button-overview"
            >
              Overview
            </button>
            <button
              onClick={() => navigate('/courses')}
              className="group relative px-9 py-3.5 rounded-md text-lg font-semibold tracking-wide transition-all duration-200 bg-white text-indigo-900 border border-white/80 hover:bg-amber-200 hover:border-amber-400 hover:shadow-[0_0_24px_rgba(255,255,255,0.3)] hover:scale-[1.03]"
              data-testid="button-try-courses"
            >
              Try in LIL Courses
            </button>
          </motion.div>
        </motion.div>
      </main>
      <AnimatePresence>
        {showOverview && <OverviewOverlay onClose={() => setShowOverview(false)} />}
      </AnimatePresence>
    </div>
  );
}
