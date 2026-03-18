import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, SkipBack, Settings, Captions, ThumbsUp, Bookmark, RotateCcw, RotateCw, Check } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import courseThumbnail from '@assets/generated_images/project_management_course_thumbnail.png';
import { splitTranscriptIntoSegments, findCurrentSegment } from '@/lib/transcriptSegments';

interface CoursePlayerProps {
  title?: string;
  courseTitle?: string;
  videoUrl?: string | null;
  durationSeconds?: number;
  posterUrl?: string | null;
  transcript?: string;
}

const VIDEO_THUMBNAILS: Record<string, string> = {
  'Empower your organization': '/thumbnails/nist/5233273_en_US_00_01_empower_VT.jpg',
  'Core functions': '/thumbnails/nist/5233273_en_US_01_01_function_VT.jpg',
  'Key framework updates': '/thumbnails/nist/5233273_en_US_01_02_update_VT.jpg',
  'Asset management': '/thumbnails/nist/5233273_en_US_02_01_asset_VT.jpg',
  'Risk assessment': '/thumbnails/nist/5233273_en_US_02_02_data_VT.jpg',
  'Governance and risk': '/thumbnails/nist/5233273_en_US_02_03_govern_VT.jpg',
  'Identity and access': '/thumbnails/nist/5233273_en_US_03_01_access_VT.jpg',
  'Data security': '/thumbnails/nist/5233273_en_US_03_02_data_VT.jpg',
  'Security awareness': '/thumbnails/nist/5233273_en_US_03_03_training_VT.jpg',
  'Protective tech': '/thumbnails/nist/5233273_en_US_03_04_tech_VT.jpg',
  'Detecting threats': '/thumbnails/nist/5233273_en_US_04_01_threat_VT.jpg',
  'Incident response': '/thumbnails/nist/5233273_en_US_04_02_respond_VT.jpg',
  'Recovery from': '/thumbnails/nist/5233273_en_US_04_03_recover_VT.jpg',
  'Customizing for': '/thumbnails/nist/5233273_en_US_05_01_custom_VT.jpg',
  'Measuring success': '/thumbnails/nist/5233273_en_US_05_02_measure_VT.jpg',
  'continuous journey': '/thumbnails/nist/5233273_en_US_06_01_next_VT.jpg',
  'benefits of emotional intelligence': '/thumbnails/eq/3272143_en_US_00_01_WL30.jpg',
  'What is emotional intelligence': '/thumbnails/eq/3272143_en_US_01_01_MM30.jpg',
  'emotions in EQ': '/thumbnails/eq/3272143_en_US_01_02_MM30.jpg',
  'Managing emotional reactions': '/thumbnails/eq/3272143_en_US_01_03_MM30.jpg',
  'Understanding your personal EQ': '/thumbnails/eq/3272143_en_US_02_01_MM30.jpg',
  'Managing your mindset': '/thumbnails/eq/3272143_en_US_02_02_MM30.jpg',
  'Finding your flow': '/thumbnails/eq/3272143_en_US_02_03_MM30.jpg',
  'Thoughts and emotional': '/thumbnails/eq/3272143_en_US_03_01_MM30.jpg',
  'Dealing with stressful': '/thumbnails/eq/3272143_en_US_03_02_MM30.jpg',
  'Shift perspective': '/thumbnails/eq/3272143_en_US_03_03_MM30.jpg',
  'Developing social awareness': '/thumbnails/eq/3272143_en_US_04_01_MM30.jpg',
  'Connecting with empathy': '/thumbnails/eq/3272143_en_US_04_02_MM30.jpg',
  'Communication and social': '/thumbnails/eq/3272143_en_US_04_03_MM30.jpg',
  'Play to your personal': '/thumbnails/eq/3272143_en_US_05_01_MM30.jpg',
  'Collect feedback': '/thumbnails/eq/3272143_en_US_05_02_MM30.jpg',
  'Communicate intention': '/thumbnails/eq/3272143_en_US_05_03_MM30.jpg',
};

const speedOptions = ['0.5x', '0.75x', '1x', '1.25x', '1.5x', '1.75x', '2x'];

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function CoursePlayer({ title = "Video", courseTitle = "NIST CSF 2.0", videoUrl, durationSeconds = 0, posterUrl, transcript }: CoursePlayerProps) {
  // Find matching thumbnail based on title
  const getThumbnail = () => {
    if (posterUrl) return posterUrl;
    for (const [keyword, url] of Object.entries(VIDEO_THUMBNAILS)) {
      if (title.includes(keyword) || keyword.includes(title)) {
        return url;
      }
    }
    return null;
  };
  const thumbnail = getThumbnail();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationSeconds);
  const [progress, setProgress] = useState(0);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1x');
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [resolvedVideoUrl, setResolvedVideoUrl] = useState<string | null>(null);
  const [showTranscript, setShowTranscript] = useState(true);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const transcriptSegments = useMemo(
    () => transcript && duration > 0 ? splitTranscriptIntoSegments(transcript, duration) : [],
    [transcript, duration]
  );

  const currentSegment = findCurrentSegment(transcriptSegments, currentTime);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = parseFloat(playbackSpeed);
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
      videoRef.current.muted = false;
    }
  }, [volume, isMuted, resolvedVideoUrl]);

  useEffect(() => {
    setIsPlaying(false);
    setIsBuffering(false);
    setCurrentTime(0);
    setProgress(0);
    setResolvedVideoUrl(null);
    if (videoRef.current) {
      videoRef.current.pause();
    }

    if (!videoUrl) return;

    if (videoUrl.startsWith('/videos/')) {
      setResolvedVideoUrl(videoUrl);
    } else {
      const filename = videoUrl.split('/').pop();
      if (!filename) return;

      fetch(`/api/video-url/${filename}`)
        .then(res => res.json())
        .then(data => {
          if (data.url) {
            setResolvedVideoUrl(data.url);
          }
        })
        .catch(err => {
          console.error('Failed to get signed video URL:', err);
          setResolvedVideoUrl(videoUrl);
        });
    }
  }, [videoUrl]);

  const handlePlayPause = () => {
    if (!videoUrl) return;
    const video = videoRef.current;
    if (!video) {
      console.error('Video ref is null');
      return;
    }
    console.log('handlePlayPause called, isPlaying:', isPlaying, 'readyState:', video.readyState, 'networkState:', video.networkState, 'src:', video.src);
    if (isPlaying) {
      video.pause();
    } else {
      setIsBuffering(true);
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('Play resolved successfully');
        }).catch((err) => {
          console.error('Play failed:', err.name, err.message);
          setIsPlaying(false);
          setIsBuffering(false);
        });
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const dur = videoRef.current.duration || durationSeconds;
      setCurrentTime(current);
      setDuration(dur);
      setProgress((current / dur) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      videoRef.current.volume = isMuted ? 0 : volume;
      videoRef.current.muted = false;
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoUrl || !videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * 100;
    const newTime = (newProgress / 100) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(newProgress);
  };

  const handleSpeedChange = (speed: string) => {
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);
    if (videoRef.current) {
      videoRef.current.playbackRate = parseFloat(speed);
    }
  };

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    }
  };

  const handleFullscreen = () => {
    const container = videoRef.current?.parentElement?.parentElement;
    if (container) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        container.requestFullscreen();
      }
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="relative w-full h-[60vh] min-h-[340px] bg-black overflow-hidden group">
      {videoUrl && resolvedVideoUrl ? (
        <video
          ref={videoRef}
          src={resolvedVideoUrl}
          poster={thumbnail || undefined}
          className="w-full h-full object-contain"
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleVideoEnded}
          onPlay={() => { setIsPlaying(true); setIsBuffering(false); }}
          onPause={() => setIsPlaying(false)}
          onWaiting={() => setIsBuffering(true)}
          onCanPlay={() => setIsBuffering(false)}
          onError={(e) => {
            const video = e.currentTarget;
            const err = video.error;
            console.error(`Video load error: code=${err?.code}, message=${err?.message}, src=${videoUrl}`);
            setIsBuffering(false);
            setIsPlaying(false);
          }}
          playsInline
        />
      ) : (
        <img 
          src={thumbnail || courseThumbnail} 
          alt="Course Content" 
          className="w-full h-full object-cover"
        />
      )}
      
      <div className="absolute top-0 left-0 right-0 px-4 py-3 bg-black/80">
        <p className="text-white text-sm font-semibold">{courseTitle}</p>
        <p className="text-white/70 text-sm">{title}</p>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-4">
        <div className="flex items-center gap-3 text-white/80">
          <button className="flex items-center gap-1 hover:text-white transition-colors" data-testid="button-like">
            <ThumbsUp className="w-4 h-4" />
            <span className="text-xs">71</span>
          </button>
          <button className="flex items-center gap-1 hover:text-white transition-colors" data-testid="button-bookmark">
            <Bookmark className="w-4 h-4" />
            <span className="text-xs">2,618</span>
          </button>
        </div>
        <div className="flex items-center gap-2 bg-black/60 rounded-full px-3 py-1.5">
          <div className="flex -space-x-1">
            <div className="w-5 h-5 rounded-full bg-red-500 border border-black/50 flex items-center justify-center text-[8px] text-white font-bold">R</div>
            <div className="w-5 h-5 rounded-full bg-yellow-500 border border-black/50 flex items-center justify-center text-[8px] text-white font-bold">M</div>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-white text-xs font-medium">157 active</span>
        </div>
      </div>
      
      {isBuffering && isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-white/30 border-t-white animate-spin" />
        </div>
      )}

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button 
            onClick={handlePlayPause}
            className={`w-20 h-20 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-2xl ${!videoUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
            data-testid="button-play-main"
            disabled={!videoUrl || isBuffering}
          >
            {isBuffering ? (
              <div className="w-8 h-8 rounded-full border-3 border-gray-400 border-t-gray-800 animate-spin" />
            ) : (
              <Play className="w-8 h-8 text-[#1b1f23] fill-[#1b1f23] ml-1" />
            )}
          </button>
        </div>
      )}

      {!videoUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <div className="text-center">
            <p className="text-white text-lg font-medium mb-2">Video Not Available</p>
            <p className="text-white/70 text-sm">Upload video file to enable playback</p>
          </div>
        </div>
      )}

      {videoUrl && !resolvedVideoUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="w-8 h-8 rounded-full border-3 border-gray-400 border-t-white animate-spin" />
        </div>
      )}

      {showTranscript && transcript && videoUrl && currentSegment && (
        <div 
          ref={transcriptRef}
          className="absolute left-0 right-0 bottom-16 flex justify-center pointer-events-none px-8"
          data-testid="transcript-overlay"
        >
          <div className="bg-black/80 rounded px-5 py-2.5 max-w-[80%]">
            <p className="text-white text-base leading-relaxed text-center">{currentSegment.text}</p>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-16">
        <div 
          className="w-full h-1 bg-white/30 cursor-pointer group/progress" 
          data-testid="progress-bar"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-white relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="flex items-center justify-between text-white px-3 py-2">
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePlayPause} 
              className={`hover:text-white/80 transition-colors p-1 ${!videoUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
              data-testid="button-play-controls"
              disabled={!videoUrl}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
            </button>
            <button 
              onClick={() => handleSkip(-10)} 
              className={`hover:text-white/80 transition-colors p-1 ${!videoUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
              data-testid="button-rewind"
              disabled={!videoUrl}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleSkip(-5)}
              className={`hover:text-white/80 transition-colors p-1 ${!videoUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
              data-testid="button-skip-back"
              disabled={!videoUrl}
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleSkip(5)}
              className={`hover:text-white/80 transition-colors p-1 ${!videoUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
              data-testid="button-skip-forward"
              disabled={!videoUrl}
            >
              <SkipForward className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2 relative">
            <button 
              onClick={() => { setShowSpeedMenu(!showSpeedMenu); setShowSettingsMenu(false); }}
              className="text-sm font-medium hover:text-white/80 transition-colors px-2 py-1"
              data-testid="button-speed"
            >
              {playbackSpeed}
            </button>
            
            {showSpeedMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-[#1a1a1a] rounded-lg shadow-xl border border-white/10 py-1 min-w-[80px] z-50">
                {speedOptions.map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={`w-full px-4 py-1.5 text-sm text-left flex items-center justify-between hover:bg-white/10 transition-colors ${
                      speed === playbackSpeed ? 'text-white' : 'text-white/70'
                    }`}
                    data-testid={`speed-option-${speed}`}
                  >
                    {speed === playbackSpeed && <Check className="w-3 h-3 mr-2" />}
                    <span className={speed === playbackSpeed ? '' : 'ml-5'}>{speed}</span>
                  </button>
                ))}
              </div>
            )}
            
            <div className="relative">
              <button 
                onClick={() => { setShowSettingsMenu(!showSettingsMenu); setShowSpeedMenu(false); }}
                className="hover:text-white/80 transition-colors p-1" 
                data-testid="button-settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              {showSettingsMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-[#1a1a1a] rounded-lg shadow-xl border border-white/10 py-1 min-w-[180px] z-50">
                  <button
                    onClick={() => { setShowTranscript(!showTranscript); setShowSettingsMenu(false); }}
                    className="w-full px-4 py-2 text-sm text-left flex items-center justify-between hover:bg-white/10 transition-colors text-white/90"
                    data-testid="settings-transcript-toggle"
                  >
                    <span>Transcript</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${showTranscript ? 'bg-white/20 text-white' : 'bg-white/5 text-white/40'}`}>
                      {showTranscript ? 'ON' : 'OFF'}
                    </span>
                  </button>
                </div>
              )}
            </div>
            <button 
              onClick={() => setShowTranscript(!showTranscript)}
              className={`hover:text-white/80 transition-colors p-1 ${showTranscript && transcript ? 'text-white' : 'text-white/40'}`} 
              data-testid="button-captions"
              title={showTranscript ? 'Hide transcript' : 'Show transcript'}
            >
              <Captions className="w-5 h-5" />
            </button>
            <div 
              className="relative"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="hover:text-white/80 transition-colors p-1" 
                data-testid="button-volume"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              {showVolumeSlider && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#1a1a1a] rounded-lg shadow-xl border border-white/10 p-2 z-50">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      setIsMuted(false);
                    }}
                    className="w-20 h-1 accent-white"
                    data-testid="volume-slider"
                  />
                </div>
              )}
            </div>
            <button 
              onClick={handleFullscreen}
              className="hover:text-white/80 transition-colors p-1" 
              data-testid="button-fullscreen"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
