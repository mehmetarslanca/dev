import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { api, ContributionDay } from "@/app/api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface YearContributions {
  year: number;
  total: number;
  days: ContributionDay[];
}

export function GithubContributions() {
  const [loading, setLoading] = useState(true);
  const [contributionsByYear, setContributionsByYear] = useState<YearContributions[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const data = await api.github.getContributions();

        // Check if we have valid data
        if (!data || !data.days || data.days.length === 0) {
          console.warn("No contribution data available");
          setError(true);
          setLoading(false);
          return;
        }

        // Group contributions by year
        const yearMap = new Map<number, ContributionDay[]>();

        data.days.forEach(day => {
          if (!day.date) return; // Skip invalid dates
          const year = new Date(day.date).getFullYear();
          if (!yearMap.has(year)) {
            yearMap.set(year, []);
          }
          yearMap.get(year)!.push(day);
        });

        // Convert to array and sort by year (newest first)
        const years = Array.from(yearMap.entries())
          .map(([year, days]) => ({
            year,
            total: days.reduce((sum, day) => sum + day.count, 0),
            days: days.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          }))
          .sort((a, b) => b.year - a.year);

        if (years.length === 0) {
          console.warn("No years with contributions found");
          setError(true);
        } else {
          setContributionsByYear(years);
          setSelectedYear(years[0]?.year || null);
        }
      } catch (error) {
        console.error("Failed to fetch contributions", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  const selectedYearData = useMemo(() => {
    return contributionsByYear.find(y => y.year === selectedYear);
  }, [contributionsByYear, selectedYear]);

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return "bg-muted/30";
      case 1: return "bg-green-900/50";
      case 2: return "bg-green-700/70";
      case 3: return "bg-green-500/80";
      case 4: return "bg-green-400";
      default: return "bg-muted/30";
    }
  };

  const getWeeksArray = (days: ContributionDay[]) => {
    if (!days || days.length === 0) return [];

    const weeks: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];

    try {
      // Fill from the first Sunday
      const firstDate = new Date(days[0].date);
      if (isNaN(firstDate.getTime())) {
        console.error("Invalid date in contributions data");
        return [];
      }

      const firstDay = firstDate.getDay(); // 0 = Sunday

      // Add empty days to start from Sunday
      for (let i = 0; i < firstDay; i++) {
        currentWeek.push({ date: '', count: 0, level: 0 });
      }

      days.forEach((day, index) => {
        if (!day.date) return; // Skip invalid entries

        currentWeek.push(day);

        const date = new Date(day.date);
        if (isNaN(date.getTime())) return; // Skip invalid dates

        const dayOfWeek = date.getDay();

        // Saturday (6) is the last day of the week
        if (dayOfWeek === 6 || index === days.length - 1) {
          // Fill remaining days if last week is incomplete
          while (currentWeek.length < 7 && index === days.length - 1) {
            currentWeek.push({ date: '', count: 0, level: 0 });
          }
          weeks.push([...currentWeek]);
          currentWeek = [];
        }
      });
    } catch (error) {
      console.error("Error building weeks array:", error);
      return [];
    }

    return weeks;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !contributionsByYear.length) {
    return null; // Silently hide component if no data
  }

  const weeks = selectedYearData ? getWeeksArray(selectedYearData.days) : [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate dynamic width based on number of weeks
  const containerWidth = weeks.length > 0
    ? `${weeks.length * 13 + 80}px` // 10px per cell + 3px gap = 13px per week, + 80px for labels
    : 'auto';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4 }}
      className="w-full"
    >
      <div className="w-full text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,1)]" />
            <h3 className="text-lg font-mono uppercase tracking-widest text-muted-foreground">
              GitHub Activity
            </h3>
          </div>
          <p className="text-sm text-muted-foreground/60 font-mono">
            Year-round contribution history
          </p>
        </div>

        {/* Year Selector */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {contributionsByYear.map((yearData) => (
            <button
              key={yearData.year}
              onClick={() => setSelectedYear(yearData.year)}
              className={`px-4 py-2 rounded-sm font-mono text-sm transition-all duration-200 border ${
                selectedYear === yearData.year
                  ? 'bg-primary/10 text-primary border-primary shadow-[0_0_15px_rgba(255,77,77,0.3)]'
                  : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:border-white/20'
              }`}
            >
              {yearData.year}
              <span className="ml-2 text-xs opacity-70">
                ({yearData.total})
              </span>
            </button>
          ))}
        </div>

        {selectedYearData && (
          <motion.div
            className="inline-block p-6 rounded-sm border border-white/10 bg-white/5 backdrop-blur-sm overflow-x-auto mx-auto"
            initial={{ width: 'auto', opacity: 0 }}
            animate={{ width: 'fit-content', opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ maxWidth: '100%' }}
          >
            <div
              className="flex items-start gap-2"
              style={{ width: containerWidth }}
            >
              {/* Day Labels */}
              <div className="flex flex-col gap-[3px] pt-5">
                {days.map((day, i) => (
                  <div
                    key={day}
                    className={`text-[10px] text-muted-foreground h-[10px] flex items-center ${
                      i % 2 === 0 ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Contribution Grid */}
              <div className="flex flex-col gap-1">
                {/* Month Labels */}
                <div className="flex gap-[3px] mb-1">
                  {weeks.map((week, weekIndex) => {
                    const firstDay = week.find(d => d.date);
                    if (!firstDay || !firstDay.date) return <div key={weekIndex} className="w-[10px]" />;

                    const date = new Date(firstDay.date);
                    const isFirstOfMonth = date.getDate() <= 7;

                    return (
                      <div key={weekIndex} className="w-[10px] text-[10px] text-muted-foreground">
                        {isFirstOfMonth ? months[date.getMonth()] : ''}
                      </div>
                    );
                  })}
                </div>

                {/* Grid */}
                <div className="flex gap-[3px]">
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-[3px]">
                      {week.map((day, dayIndex) => (
                        <div
                          key={`${weekIndex}-${dayIndex}`}
                          className={`w-[10px] h-[10px] rounded-sm transition-all duration-200 ${
                            day.date ? getLevelColor(day.level) : 'bg-transparent'
                          } ${day.count > 0 ? 'hover:ring-1 hover:ring-primary hover:scale-125' : ''}`}
                          title={day.date ? `${day.date}: ${day.count} contributions` : ''}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground">
              <span className="uppercase tracking-wider">Less</span>
              <div className={`w-3 h-3 rounded-sm ${getLevelColor(0)}`} />
              <div className={`w-3 h-3 rounded-sm ${getLevelColor(1)}`} />
              <div className={`w-3 h-3 rounded-sm ${getLevelColor(2)}`} />
              <div className={`w-3 h-3 rounded-sm ${getLevelColor(3)}`} />
              <div className={`w-3 h-3 rounded-sm ${getLevelColor(4)}`} />
              <span className="uppercase tracking-wider">More</span>
            </div>

            <div className="mt-4 text-center text-sm text-muted-foreground/80 font-mono">
              <span className="text-primary font-bold">{selectedYearData.total}</span> contributions in {selectedYearData.year}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
