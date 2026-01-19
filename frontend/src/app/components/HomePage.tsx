import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Button } from "@/app/components/ui/button";
import { WakaTimeModal } from "@/app/components/WakaTimeModal";
import { BarChart3, Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { useUser } from "@/app/context/UserContext";
import { toast } from "sonner";
import { api } from "@/app/api";

export function HomePage() {
  const [showWakaTime, setShowWakaTime] = useState(false);
  const { role } = useUser();
  const hasWelcomedVisitor = useRef(false);
  const [isCoding, setIsCoding] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const stats = await api.stats.getCurrent();
        setIsCoding(stats.isCodingNow);
      } catch (e) {
        setIsCoding(false);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
      // Only show if explicitly set to visitor recently (could check time too, but simple for now)
      if (role === 'visitor' && !hasWelcomedVisitor.current) {
          toast.message("Welcome", { 
             description: "Enjoy the simplified view.",
             position: 'top-center'
          });
          hasWelcomedVisitor.current = true;
      }
  }, [role]);

  const techStack = {
    learning: ["Kotlin", "AWS", "PostgreSQL", "MySQL"],
    current: [
      "Java",
      "Spring Boot",
      "Python",
      "Docker",
      "Git",
    ],
  };

  return (
    <div className="min-h-screen pt-20 relative z-10">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="flex flex-col items-center gap-3 mb-6 md:mb-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded border border-border bg-card/80 backdrop-blur-sm text-sm text-muted-foreground"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <span className="text-primary">{'>'}_</span>
              <span>Backend Developer</span>
            </motion.div>

            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.3 }}
               className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-card/50 text-xs font-mono"
            >
                 <div className={`w-2 h-2 rounded-full ${isCoding ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500/50"}`} />
                 <span className="text-muted-foreground">
                    {isCoding ? "Live Session: Coding" : "Live Session: Offline"}
                 </span>
            </motion.div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl tracking-tight mb-6" style={{ fontFamily: 'var(--font-sans)' }}>
            Software must breathe.
            <br />
            <span className="text-muted-foreground inline-flex items-center">
              Like you, and me.
              <motion.span
                className="inline-block ml-1 text-primary"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              >
                |
              </motion.span>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed">
            I breathe. I make it survive. I design resilient backend systems that handle scale, minimize latency, and maintain data integrity.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              size="lg"
              className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all rounded-sm relative overflow-hidden group"
              style={{ fontFamily: 'var(--font-mono)' }}
              asChild
            >
              <a href="https://www.linkedin.com/in/mehmet-arslanca-5618b32a6/" target="_blank" rel="noopener noreferrer">
                  {/* Inner glow effect */}
                  <div className="absolute inset-[2px] bg-gradient-to-b from-white/10 to-transparent rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <Linkedin className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">LinkedIn</span>
              </a>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2 border-border hover:border-primary/50 hover:text-primary transition-all rounded-sm"
              style={{ fontFamily: 'var(--font-mono)' }}
              asChild
            >
              <a href="https://github.com/postaldudegoespostal" target="_blank" rel="noopener noreferrer">
                <Github className="w-5 h-5" />
                GitHub Profile
              </a>
            </Button>
          </div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-4 mt-12"
          >
            <a
              href="https://github.com/postaldudegoespostal"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-muted transition-colors hover:text-primary"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/mehmet-arslanca-5618b32a6/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-muted transition-colors hover:text-primary"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:mehmetarslancamehmet@gmail.com"
              className="p-2 rounded-lg hover:bg-muted transition-colors hover:text-primary"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Tech Stack Section */}
      <section className="container mx-auto px-6 py-24 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl tracking-tight mb-4">
              Forever Learning
            </h2>
            <p className="text-muted-foreground">
              Constantly expanding my toolkit and exploring new technologies
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Current Stack */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(220,38,38,0.6)]" />
                <h3 className="text-lg">Current Stack</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.current.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm hover:border-primary/40 hover:shadow-[0_0_12px_rgba(220,38,38,0.15)] transition-all"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Learning */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse" />
                <h3 className="text-lg">Advancing In</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.learning.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm hover:border-blue-500/40 hover:shadow-[0_0_12px_rgba(59,130,246,0.15)] transition-all"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Quote Section */}
      <section className="container mx-auto px-6 py-24">
        <motion.blockquote
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-2xl md:text-3xl text-muted-foreground italic tracking-tight">
            "Working does not mean tiring oneself and sweating in vain. It is essential to utilize science, technology, and every civilized invention to the fullest extent, in accordance with the requirements of the age."
          </p>
          <footer className="mt-4 text-sm text-muted-foreground">— Mustafa Kemal Atatürk</footer>
        </motion.blockquote>
      </section>

      {/* WakaTime Modal */}
      <WakaTimeModal isOpen={showWakaTime} onClose={() => setShowWakaTime(false)} />
    </div>
  );
}