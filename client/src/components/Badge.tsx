import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, Star, Zap, Target, Map, TrendingUp, Award, Crown,
  Trophy, Medal, Sparkles, CheckCircle2
} from "lucide-react";
import type { Badge as BadgeType } from "@shared/schema";

const iconMap: Record<string, React.ComponentType<any>> = {
  Rocket, Star, Zap, Target, Map, TrendingUp, Award, Crown, Trophy, Medal, Sparkles, CheckCircle2
};

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  blue: { bg: "bg-blue-500", border: "border-blue-400", text: "text-blue-100", glow: "shadow-blue-500/50" },
  gold: { bg: "bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600", border: "border-yellow-300", text: "text-yellow-100", glow: "shadow-yellow-500/50" },
  purple: { bg: "bg-purple-500", border: "border-purple-400", text: "text-purple-100", glow: "shadow-purple-500/50" },
  green: { bg: "bg-emerald-500", border: "border-emerald-400", text: "text-emerald-100", glow: "shadow-emerald-500/50" },
  teal: { bg: "bg-teal-500", border: "border-teal-400", text: "text-teal-100", glow: "shadow-teal-500/50" },
  orange: { bg: "bg-orange-500", border: "border-orange-400", text: "text-orange-100", glow: "shadow-orange-500/50" },
  red: { bg: "bg-red-500", border: "border-red-400", text: "text-red-100", glow: "shadow-red-500/50" },
  amber: { bg: "bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600", border: "border-amber-300", text: "text-amber-100", glow: "shadow-amber-500/50" },
};

interface BadgeDisplayProps {
  badge: BadgeType;
  earned?: boolean;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
  animate?: boolean;
}

export function BadgeDisplay({ badge, earned = false, size = "md", showDetails = true, animate = false }: BadgeDisplayProps) {
  const Icon = iconMap[badge.icon] || Star;
  const colors = colorMap[badge.color] || colorMap.blue;
  
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };
  
  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <motion.div
      initial={animate ? { scale: 0, rotate: -180 } : false}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="flex flex-col items-center gap-2"
    >
      <div className={`relative ${sizeClasses[size]}`}>
        {earned && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            className={`absolute inset-0 rounded-full ${colors.bg} blur-md opacity-50`}
          />
        )}
        <div 
          className={`
            relative ${sizeClasses[size]} rounded-full flex items-center justify-center
            ${earned ? colors.bg : "bg-gray-300"}
            ${earned ? colors.border : "border-gray-400"}
            border-2 shadow-lg
            ${earned ? `shadow-lg ${colors.glow}` : ""}
            transition-all duration-300
          `}
        >
          <Icon className={`${iconSizes[size]} ${earned ? "text-white" : "text-gray-500"}`} />
          {!earned && (
            <div className="absolute inset-0 rounded-full bg-gray-500/30 flex items-center justify-center">
              <div className="w-full h-0.5 bg-gray-500 rotate-45" />
            </div>
          )}
        </div>
        {earned && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white"
          >
            <CheckCircle2 className="w-3 h-3 text-white" />
          </motion.div>
        )}
      </div>
      {showDetails && (
        <div className="text-center">
          <p className={`font-semibold text-sm ${earned ? "text-gray-800" : "text-gray-500"}`}>
            {badge.name}
          </p>
          {size !== "sm" && (
            <p className="text-xs text-gray-500 max-w-[120px]">{badge.requirement}</p>
          )}
          {earned && badge.points && (
            <p className="text-xs font-medium text-amber-600">+{badge.points} pts</p>
          )}
        </div>
      )}
    </motion.div>
  );
}

interface BadgeUnlockNotificationProps {
  badge: BadgeType;
  onClose: () => void;
}

export function BadgeUnlockNotification({ badge, onClose }: BadgeUnlockNotificationProps) {
  const Icon = iconMap[badge.icon] || Star;
  const colors = colorMap[badge.color] || colorMap.blue;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -100, opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100]"
      >
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: 3 }}
            className={`absolute inset-0 rounded-2xl ${colors.bg} blur-xl opacity-40`}
          />
          <div className={`relative ${colors.bg} rounded-2xl p-6 shadow-2xl border-2 ${colors.border}`}>
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-white/70 hover:text-white"
              data-testid="button-close-badge-notification"
            >
              ×
            </button>
            
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="relative"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-4 border-dashed border-white/30"
                />
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                  <Icon className="w-10 h-10 text-white" />
                </div>
              </motion.div>
              
              <div className="text-white">
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-medium uppercase tracking-wider opacity-80">Badge Unlocked!</span>
                </motion.div>
                <motion.h3
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold"
                >
                  {badge.name}
                </motion.h3>
                <motion.p
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm opacity-80"
                >
                  {badge.description}
                </motion.p>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="mt-2 inline-block bg-white/20 rounded-full px-3 py-1"
                >
                  <span className="text-yellow-200 font-bold">+{badge.points} points</span>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

interface BadgesShowcaseProps {
  allBadges: BadgeType[];
  earnedBadgeIds: string[];
  onBadgeClick?: (badge: BadgeType) => void;
}

export function BadgesShowcase({ allBadges, earnedBadgeIds, onBadgeClick }: BadgesShowcaseProps) {
  const categories = ["milestone", "challenge", "mastery"];
  const categoryLabels: Record<string, string> = {
    milestone: "Learning Milestones",
    challenge: "Challenges",
    mastery: "Mastery Achievements",
  };

  return (
    <div className="space-y-6">
      {categories.map(category => {
        const categoryBadges = allBadges.filter(b => b.category === category);
        if (categoryBadges.length === 0) return null;
        
        return (
          <div key={category}>
            <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
              {categoryLabels[category]}
            </h4>
            <div className="flex flex-wrap gap-4">
              {categoryBadges.map(badge => (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onBadgeClick?.(badge)}
                  className="cursor-pointer"
                  data-testid={`badge-${badge.id}`}
                >
                  <BadgeDisplay
                    badge={badge}
                    earned={earnedBadgeIds.includes(badge.id)}
                    size="md"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
      
      <div className="mt-4 p-3 bg-gray-100 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-semibold text-gray-800">
            {earnedBadgeIds.length} / {allBadges.length} badges earned
          </span>
        </div>
        <div className="mt-2 h-2 bg-gray-300 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(earnedBadgeIds.length / allBadges.length) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          />
        </div>
      </div>
    </div>
  );
}
