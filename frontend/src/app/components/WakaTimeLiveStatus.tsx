import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Code2, Clock, FileCode } from "lucide-react";
import { api, StatsResponse } from "@/app/api";

interface WakaTimeLiveStatusProps {
  isOnline?: boolean;
}

const parseDurationToSeconds = (durationStr: string): number => {
  if (!durationStr) return 0;
  let totalSeconds = 0;
  
  const hoursMatch = durationStr.match(/(\d+)\s*(hr|hrs)/);
  if (hoursMatch) totalSeconds += parseInt(hoursMatch[1]) * 3600;

  const minsMatch = durationStr.match(/(\d+)\s*(min|mins)/);
  if (minsMatch) totalSeconds += parseInt(minsMatch[1]) * 60;

  const secsMatch = durationStr.match(/(\d+)\s*(sec|secs)/);
  if (secsMatch) totalSeconds += parseInt(secsMatch[1]);
  
  return totalSeconds;
};

const formatSecondsToDuration = (totalSeconds: number, includeSeconds = true): string => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  const parts = [];
  if (h > 0) parts.push(`${h} ${h === 1 ? 'hr' : 'hrs'}`);
  if (m > 0) parts.push(`${m} ${m === 1 ? 'min' : 'mins'}`);
  
  if (includeSeconds) {
    if (s > 0 || parts.length === 0) parts.push(`${s} ${s === 1 ? 'sec' : 'secs'}`);
  } else if (parts.length === 0) {
    return "0 mins";
  }
  
  return parts.join(' ');
};

export function WakaTimeLiveStatus({ }: WakaTimeLiveStatusProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [dailySeconds, setDailySeconds] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.stats.getCurrent();
        setStats(data);
        setSessionSeconds(parseDurationToSeconds(data.totalSpentOnCurrentProject));
        setDailySeconds(parseDurationToSeconds(data.totalSpentOnAllProjects));
      } catch (error) {
        console.error("Failed to fetch wakatime stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Poll every 5 minutes to resync
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Live timer effect
  useEffect(() => {
    if (!stats?.isCodingNow) return;

    const timer = setInterval(() => {
      setSessionSeconds(prev => prev + 1);
      setDailySeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [stats?.isCodingNow]);

  // Determine if online based on API response
  const isOnline = stats?.isCodingNow ?? false;

  if (loading || !isOnline || !stats) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-border bg-card/50" style={{ fontFamily: 'var(--font-mono)' }}>
        <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
        <span className="text-sm text-muted-foreground">Offline</span>
      </div>
    );
  }

  const sessionDuration = formatSecondsToDuration(sessionSeconds, true);
  const dailyDuration = formatSecondsToDuration(dailySeconds, false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Main Status Bar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 px-3 py-1.5 rounded border border-border bg-card/50 hover:border-primary/30 transition-all cursor-pointer group"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {/* Pulsing Active Indicator - GREEN when online */}
        <motion.div
          className="relative"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500/30 animate-ping" />
        </motion.div>

        {/* Project Info - Hidden on mobile, shown on tablet/desktop */}
        <div className="hidden sm:flex items-center gap-2">
          <Code2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{stats.projectName}</span>
        </div>

        {/* Divider - Hidden on mobile */}
        <div className="hidden sm:block w-px h-4 bg-border" />

        {/* Session Time */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground tabular-nums">{sessionDuration}</span>
        </div>

        {/* Gradient Glow on Hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
      </motion.div>

      {/* Hover Tooltip with Detailed Stats */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 z-50 w-72"
          >
            <div className="rounded-lg border border-border bg-card shadow-2xl overflow-hidden">
              {/* Tooltip Header */}
              <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-green-500/10 to-transparent">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-green-500"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="font-medium text-sm">Live Coding Session</span>
                </div>
              </div>

              {/* Tooltip Content */}
              <div className="p-4 space-y-3">
                {/* Currently Editing */}
                <div className="flex items-start gap-3">
                  <FileCode className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">Currently Editing</p>
                    <p className="text-sm font-medium truncate" title={stats.currentlyEditingFile}>
                      {stats.currentlyEditingFile}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      in {stats.ideName}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-border" />

                {/* Time Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Session</p>
                    <p className="text-lg font-mono tabular-nums">{sessionDuration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Total (Today)</p>
                    <p className="text-lg font-mono tabular-nums">{dailyDuration}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}