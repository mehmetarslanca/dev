import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Badge } from "@/app/components/ui/badge";
import { Github, Loader2, Layers } from "lucide-react";
import { api, PinnedProject } from "@/app/api";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { ContentRenderer } from "@/app/components/ContentRenderer";

export function OnGoingProjects() {
  const [projects, setProjects] = useState<PinnedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<PinnedProject | null>(null);

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
    <div className="mb-20 animate-fade-in-up">
      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-3xl h-[85vh] md:h-[80vh] flex flex-col p-0 glass-panel shadow-[0_0_50px_rgba(255,77,77,0.1)]">
            <DialogHeader className="p-8 pb-4 text-left border-b border-white/10 bg-white/5 shrink-0">
                <DialogTitle className="text-2xl md:text-4xl font-bold tracking-tighter text-foreground uppercase group text-gradient">
                    <span className="text-primary mr-2 opacity-50 font-light font-mono">//</span>
                    {selectedProject?.title}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground font-mono text-xs mt-2 uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Project Protocol & Documentation
                </DialogDescription>
            </DialogHeader>

            <ScrollArea className="flex-1 min-h-0 bg-black/40">
                <div className="p-8 space-y-8 pb-4">
                    <div className="prose-zinc dark:prose-invert">
                        {selectedProject?.longDescription ? (
                            <ContentRenderer content={selectedProject.longDescription} />
                        ) : (
                            <p className="text-lg leading-relaxed text-zinc-400 font-light italic">
                                {selectedProject?.description}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-8 border-t border-white/10">
                        {selectedProject?.tags && selectedProject.tags.map(tag => (
                            <span key={tag} className="text-[10px] uppercase tracking-[0.2em] font-mono px-3 py-1 rounded-sm border border-primary/30 bg-primary/5 text-primary shadow-[0_0_10px_rgba(255,77,77,0.2)]">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </ScrollArea>

            <div className="p-6 px-8 border-t border-white/10 bg-white/5 flex justify-between items-center shrink-0">
                <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">
                        System Status
                    </span>
                    <span className="text-xs font-mono text-primary flex items-center gap-2 drop-shadow-[0_0_5px_rgba(255,77,77,0.6)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(255,77,77,1)]" />
                        ACTIVE_DEPLOYMENT
                    </span>
                </div>
                {selectedProject?.githubUrl && (
                    <Button
                        size="sm"
                        className="gap-3 h-10 px-6 font-mono font-bold tracking-[0.2em] rounded-sm bg-primary hover:bg-primary/90 transition-all group shadow-[0_0_20px_rgba(255,77,77,0.4)]"
                        asChild
                    >
                        <a href={selectedProject.githubUrl} target="_blank" rel="noreferrer">
                            <Github className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                            <span>ACCESS_SOURCE</span>
                        </a>
                    </Button>
                )}
            </div>
        </DialogContent>
      </Dialog>

      <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-12"
      >
        <h2 className="text-2xl md:text-3xl tracking-wide w-fit uppercase font-mono border-l-4 border-primary pl-4 mb-4 text-foreground/80">
           Ongoing Projects
        </h2>
        <p className="text-muted-foreground pl-5 font-light">
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
            onClick={() => setSelectedProject(project)}
            className="group relative p-6 rounded-sm glass-panel transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_25px_rgba(255,77,77,0.15)] hover:-translate-y-1 flex flex-col h-full overflow-hidden cursor-pointer"
          >
            {/* Red Indicator Sync */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300 z-20" />

            {/* Background Accent */}
            <div className="absolute top-0 right-0 p-2 opacity-5">
                <Layers className="w-24 h-24 -mr-8 -mt-8 rotate-12" />
            </div>

            <div className="flex-1 mb-6 relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(255,77,77,1)] animate-pulse" />
                    <h3 className="text-xl font-bold uppercase tracking-tight group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4 font-light font-mono">
                  {project.description}
                </p>
            </div>

            <div className="space-y-4 relative z-10">
                <div className="flex flex-wrap gap-2">
                  {project.tags && project.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-sm border border-white/10 bg-white/5 text-muted-foreground group-hover:border-primary/30 group-hover:text-white transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-[0.2em]">
                        {project.githubUrl ? "External Repo" : "System Internal"}
                    </span>
                    {project.githubUrl && (
                         <Button
                            size="sm"
                            variant="ghost"
                            className="gap-2 h-7 px-2 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 rounded-sm transition-all shadow-none hover:shadow-[0_0_10px_rgba(255,77,77,0.2)]"
                            asChild
                            onClick={(e) => e.stopPropagation()}
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
