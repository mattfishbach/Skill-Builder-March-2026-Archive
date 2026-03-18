import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { BookOpen, Code, ChevronRight } from 'lucide-react';
import eqInstructorImg from '@assets/image_1771310176796.png';
import nistCourseImg from '@assets/image_1771310266910.png';

const courses = [
  {
    id: 'nist-csf',
    title: 'NIST CSF 2.0: Empower Your Organization to Navigate the Modern Cybersecurity Threat Landscape',
    sbSummary: 'Scenario-based practice for technical skills and knowledge',
    image: nistCourseImg,
    imageStyle: { objectPosition: '75% center' },
    active: true,
    route: '/course/nist-csf',
  },
  {
    id: 'emotional-intelligence',
    title: 'Developing Your Emotional Intelligence',
    sbSummary: 'Scenario-based practice for interpersonal skills',
    image: eqInstructorImg,
    active: true,
    route: '/course/emotional-intelligence',
  },
  {
    id: 'excel-formulas',
    title: 'Excel: Advanced Formulas and Functions',
    sbSummary: 'Practice Excel formulas and functions directly within downloadable XLS files, then reupload for feedback.',
    customIcon: true,
    active: true,
    route: '/course/excel-formulas',
  },
] as const;

function ExcelIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="3" fill="#217346" />
      <rect x="5" y="5" width="14" height="14" rx="1" fill="#fff" fillOpacity="0.15" />
      <rect x="12" y="5" width="1" height="14" fill="#fff" fillOpacity="0.25" />
      <rect x="5" y="9" width="14" height="1" fill="#fff" fillOpacity="0.25" />
      <rect x="5" y="14" width="14" height="1" fill="#fff" fillOpacity="0.25" />
      <text x="8.5" y="13.5" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="8" fill="white">X</text>
    </svg>
  );
}

export default function CourseSelection() {
  const [, navigate] = useLocation();

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #2d1b69 0%, #1e3a7a 30%, #0a66c2 55%, #2980b9 75%, #1a5ea8 100%)',
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-20 -left-20 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(120,60,200,0.35) 0%, transparent 65%)' }}
        />
        <div
          className="absolute -bottom-32 -right-20 w-[650px] h-[650px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(40,150,220,0.30) 0%, transparent 60%)' }}
        />

        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <div className="absolute top-20 left-[15%] w-32 h-32 border border-white/[0.07] rounded-2xl rotate-12" />
        <div className="absolute top-40 right-[10%] w-24 h-24 border border-white/[0.05] rounded-full" />
        <div className="absolute bottom-32 left-[20%] w-20 h-20 border border-white/[0.06] rounded-xl -rotate-6" />
        <div className="absolute bottom-20 right-[25%] w-16 h-16 border border-amber-400/[0.08] rounded-lg rotate-45" />
        <div className="absolute top-[60%] left-[8%] w-12 h-12 border border-white/[0.05] rounded-full" />
        <div className="absolute top-[25%] right-[20%] w-28 h-28 border border-white/[0.04] rounded-2xl rotate-[20deg]" />
      </div>

      <header className="relative z-10 px-8 pt-8 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-2xl">in</span>
          <span className="font-semibold text-white text-xl">Learning</span>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-start pt-[12vh] px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-5xl"
        >
          <h1
            className="text-amber-400 font-bold text-5xl mb-2 text-center uppercase tracking-wide"
            style={{ fontFamily: "'Source Serif Pro', serif" }}
            data-testid="text-page-title"
          >
            Skill Builder Course Menu
          </h1>
          <p className="text-white/60 text-center text-2xl mb-10">
            LIL courses with AI-powered Skill Builder exercises
          </p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden"
          >
            <table className="w-full" data-testid="table-course-list">
              <tbody>
                {courses.map((course, idx) => {
                  const Icon = course.icon;
                  return (
                    <motion.tr
                      key={course.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
                      onClick={() => course.active && course.route && navigate(course.route)}
                      className={`border-b border-white/10 last:border-b-0 transition-all ${
                        course.active
                          ? 'hover:bg-white/10 cursor-pointer group'
                          : 'opacity-50 cursor-default'
                      }`}
                      data-testid={`row-course-${course.id}`}
                    >
                      <td className="px-7 py-7">
                        <div className="flex items-center gap-5">
                          {course.image ? (
                            <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/20 flex-shrink-0">
                              <img src={course.image} alt="" className="w-full h-full object-cover" style={course.imageStyle} />
                            </div>
                          ) : 'customIcon' in course && course.customIcon ? (
                            <div className="w-14 h-14 rounded-lg overflow-hidden ring-2 ring-white/20 flex-shrink-0">
                              <ExcelIcon className="w-full h-full" />
                            </div>
                          ) : (
                            <div className={`p-3 rounded-lg ${course.active ? 'bg-white/20' : 'bg-white/10'}`}>
                              {Icon && <Icon className="w-7 h-7 text-white" />}
                            </div>
                          )}
                          <div>
                            <p className={`text-[20px] font-medium leading-snug ${
                              course.active ? 'text-amber-300 group-hover:text-yellow-200 transition-colors' : 'text-amber-300/50'
                            }`}>
                              {course.title}
                            </p>
                            {!course.active && (
                              <span className="text-base text-white/40 mt-1 inline-block">Coming soon</span>
                            )}
                          </div>
                          {course.active && (
                            <ChevronRight className="w-7 h-7 text-white/40 group-hover:text-yellow-200 group-hover:translate-x-1 transition-all ml-auto flex-shrink-0" />
                          )}
                        </div>
                      </td>
                      <td className="px-7 py-7">
                        <p className={`text-[20px] ${course.active ? 'text-white/80' : 'text-white/50'}`}>
                          {course.sbSummary}
                        </p>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
