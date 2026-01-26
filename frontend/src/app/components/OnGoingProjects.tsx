import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Badge } from "@/app/components/ui/badge";
import { Github, Loader2, Layers } from "lucide-react";
import { api, PinnedProject } from "@/app/api";
import { Button } from "@/app/components/ui/button";

export function OnGoingProjects() {
  const [projects, setProjects] = useState<PinnedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await api.pinnedProjects.getAll();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch ongoing projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
       <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
       </div>
    );
  }

  if (projects.length === 0) return null;

  return (
    <div className="mb-20">
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mb-12"
      >
        <h2 className="text-2xl md:text-3xl tracking-tight mb-4 font-mono border-l-4 border-primary pl-4">
           Ongoing Projects
        </h2>
        <p className="text-muted-foreground pl-5">
           Active development & Pinned priorities.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative p-6 rounded-sm border border-border bg-card/50 hover:bg-card hover:border-primary/50 transition-all flex flex-col h-full overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 p-2 opacity-5">
                <Layers className="w-24 h-24 -mr-8 -mt-8 rotate-12" />
            </div>

            <div className="flex-1 mb-6 relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <h3 className="text-xl font-mono tracking-tight group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4 font-light">
                  {project.description}
                </p>
            </div>

            <div className="space-y-4 relative z-10">
                <div className="flex flex-wrap gap-2">
                  {project.tags && project.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full border border-border bg-muted/30 text-muted-foreground group-hover:border-primary/30 group-hover:text-primary/70 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border/50">
                    <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-[0.2em]">
                        {project.githubUrl ? "External Repo" : "System Internal"}
                    </span>
                    {project.githubUrl && (
                         <Button
                            size="sm"
                            variant="ghost"
                            className="gap-2 h-7 px-2 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 rounded-none transition-all"
                            asChild
                         >
                            <a href={project.githubUrl} target="_blank" rel="noreferrer">
                              <Github className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-mono font-bold tracking-widest">SOURCE</span>
                            </a>
                         </Button>
                    )}
                </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
