import { useState } from 'react';
import { Linkedin, Award, BookOpen, FileText } from 'lucide-react';

interface VideoDetailsProps {
  instructorName?: string;
  instructorTitle?: string;
  instructorImage?: string;
  courseDuration?: string;
  courseLevel?: string;
  releaseDate?: string;
  rating?: number;
  ratingCount?: number;
  transcript?: string;
}

export function VideoDetails({
  instructorName = "Nicole Dove",
  instructorTitle = "Cybersecurity Leader, Podcast Producer, and University Lecturer",
  instructorImage = "",
  courseDuration = "44m",
  courseLevel = "Beginner",
  releaseDate = "12/18/2025",
  rating = 4.8,
  ratingCount = 40,
  transcript = ""
}: VideoDetailsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'notebook' | 'transcript'>('overview');

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BookOpen },
    { id: 'notebook' as const, label: 'Notebook', icon: FileText },
    { id: 'transcript' as const, label: 'Transcript', icon: FileText },
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return stars;
  };

  const relatedCourses = [
    {
      title: "Implementing the NIST Risk Management Framework",
      duration: "1h 46m",
      learners: "4,303 learners",
      image: "/api/placeholder/80/50"
    },
    {
      title: "Google Security Operations: Deep Dive by...",
      duration: "1h 55m", 
      learners: "",
      image: "/api/placeholder/80/50"
    }
  ];

  return (
    <div className="bg-white border-t border-gray-200">
      <div className="flex justify-center border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'text-gray-900 border-gray-900'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
            data-testid={`tab-${tab.id}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xs text-gray-500 uppercase tracking-wide mb-3">Instructor</h4>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-semibold text-lg overflow-hidden flex-shrink-0">
                  {instructorImage ? (
                    <img src={instructorImage} alt={instructorName} className="w-full h-full object-cover" />
                  ) : (
                    instructorName.split(' ').map(n => n[0]).join('')
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{instructorName}</p>
                  <p className="text-sm text-gray-500 leading-tight">{instructorTitle}</p>
                  <button 
                    className="mt-2 flex items-center gap-1.5 text-sm text-[#0a66c2] border border-[#0a66c2] rounded-full px-3 py-1 hover:bg-[#0a66c2]/5 transition-colors"
                    data-testid="button-follow-linkedin"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    Follow on LinkedIn
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-xs text-gray-500 uppercase tracking-wide mb-2">Course details</h4>
                <p className="text-sm text-gray-700">
                  {courseDuration} · {courseLevel} · Released: {releaseDate}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm font-medium text-gray-900">{rating}</span>
                  <div className="flex">{renderStars(rating)}</div>
                  <span className="text-sm text-gray-500">({ratingCount})</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs text-gray-500 uppercase tracking-wide mb-3">Related to this course</h4>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Certificates</span>
                <span className="text-gray-300">·</span>
                <button className="text-sm text-[#0a66c2] hover:underline" data-testid="link-show-all">
                  Show all
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Related courses</h4>
              <div className="space-y-3">
                {relatedCourses.map((course, idx) => (
                  <div key={idx} className="flex gap-3 group cursor-pointer" data-testid={`related-course-${idx}`}>
                    <div className="w-20 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                      <span className="text-white text-xs font-medium bg-black/50 px-1.5 py-0.5 rounded absolute bottom-1 left-1">
                        {course.duration}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Course</p>
                      <p className="text-sm font-medium text-gray-900 group-hover:text-[#0a66c2] transition-colors truncate">
                        {course.title}
                      </p>
                      {course.learners && (
                        <p className="text-xs text-gray-500">{course.learners}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notebook' && (
        <div className="p-6">
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Your notes will appear here</p>
            <p className="text-sm">Take notes while watching to save them to your notebook</p>
          </div>
        </div>
      )}

      {activeTab === 'transcript' && (
        <div className="p-6 overflow-y-auto">
          {transcript ? (
            <div className="prose prose-sm max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {transcript}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Transcript</p>
              <p className="text-sm">No transcript available for this video</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
