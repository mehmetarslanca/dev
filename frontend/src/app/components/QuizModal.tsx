import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { useUser } from "@/app/context/UserContext";
import { Terminal, ShieldAlert, Loader2 } from "lucide-react";
import { api, SimulationScenarioResponse } from "@/app/api";

interface QuizModalProps {
  onNavigate: (page: string) => void;
}

export function QuizModal({ onNavigate }: QuizModalProps) {
  const { role, hasTakenQuiz, completeQuiz } = useUser();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scenario, setScenario] = useState<SimulationScenarioResponse | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const fetchScenario = async () => {
        try {
            const data = await api.simulation.getRandom();
            setScenario(data);
        } catch (err) {
            console.log("Failed to load scenario, defaulting visitor");
            // If backend fails, fallback gracefully - do not show modal
            setOpen(false);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const isProtectedPage = window.location.pathname.startsWith("/admin");
    if (!hasTakenQuiz && !role && !isProtectedPage) {
        // Fetch question before showing
        fetchScenario();
    } else {
        // User has already taken quiz or has a role, don't show modal
        setLoading(false);
    }
  }, [hasTakenQuiz, role]);

  // Show modal once loaded
  useEffect(() => {
     if (scenario && !hasTakenQuiz && !role) {
         setOpen(true);
     }
  }, [scenario, hasTakenQuiz, role]);

  const handleOptionSelect = async (optionId: string) => {
    setSelectedOptionId(optionId);
    setVerifying(true);

    try {
        if (!scenario) return;

        const result = await api.simulation.verify({
            scenarioId: scenario.id,
            selectedOptionId: optionId
        });

        // Small delay for UI feedback
        setTimeout(() => {
            setOpen(false);
            if (result.userLevel === "SENIOR") {
                completeQuiz("master");
                onNavigate("home");
            } else if (result.userLevel === "MID" || result.userLevel === "JUNIOR") {
                completeQuiz("learner");
                onNavigate("blog");
            } else {
                completeQuiz("visitor");
                onNavigate("home");
            }
        }, 800);

    } catch (error) {
        console.error("Verification failed", error);
        setOpen(false);
        completeQuiz("visitor");
    }
  };

  const handleSkip = () => {
    setOpen(false);
    completeQuiz("visitor");
    onNavigate("home");
  };

  if(!scenario) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleSkip()}>
       <DialogContent className="sm:max-w-xl p-0 gap-0 border-zinc-800 bg-[#0a0a0a] shadow-2xl shadow-black/50 overflow-hidden">
           <DialogHeader className="p-6 pb-2 border-b border-zinc-900 bg-[#0a0a0a]">
                <DialogTitle className="flex items-center gap-2 text-primary/90 font-mono tracking-tighter text-base">
                   <Terminal className="w-4 h-4" /> SYSTEM_DIAGNOSTIC_REQUIRED
                </DialogTitle>
                <DialogDescription className="font-mono text-xs text-zinc-500 pt-1">
                   Incident Report: <span className="text-zinc-300">{scenario.title}</span>
                </DialogDescription>
           </DialogHeader>

           <div className="p-6 space-y-6">
               <div className="bg-black p-5 rounded-lg border border-zinc-800 font-mono text-sm leading-relaxed text-zinc-100 shadow-sm relative overflow-hidden">
                  {/* Decorative status bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary/20 to-transparent opacity-50" />
                  
                  {/* System State Header */}
                  <div className="flex gap-4 text-[10px] uppercase tracking-wider mb-4 text-zinc-500 font-semibold select-none">
                      <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500/80 animate-pulse" /> CPU: {scenario.systemState.cpuLoad}%</span>
                      <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500/80" /> LATENCY: {scenario.systemState.latency}ms</span>
                      <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500/80" /> MEM: {scenario.systemState.memoryUsage}MB</span>
                  </div>
                  
                  <p className="text-white/90 font-medium">
                    {scenario.description}
                  </p>
               </div>

               <div className="grid gap-3">
                   {scenario.options.map((opt, i) => (
                       <Button
                           key={opt.id}
                           disabled={verifying}
                           variant={"outline"}
                           className={`justify-start h-auto py-4 px-5 font-mono text-sm border transition-all text-left whitespace-normal relative overflow-hidden
                               ${selectedOptionId === opt.id 
                                ? "bg-primary/10 border-primary text-primary hover:bg-primary/20 hover:text-primary active:scale-[0.99] shadow-[0_0_15px_rgba(220,38,38,0.15)]" 
                                : "bg-[#111] border-zinc-800 text-zinc-100 hover:bg-[#161616] hover:border-zinc-700 hover:text-white"
                               }
                           `}
                           onClick={() => handleOptionSelect(opt.id)}
                       >
                           <span className={`mr-4 text-xs font-bold shrink-0 mt-0.5 ${selectedOptionId === opt.id ? "text-primary" : "text-zinc-600 group-hover:text-zinc-500"}`}>
                             0{i+1}
                           </span>
                           <div className="flex flex-col items-start gap-1.5 w-full">
                               <span className="font-bold tracking-tight text-[13px]">{opt.title}</span>
                               <span className={`text-[11px] leading-relaxed ${selectedOptionId === opt.id ? "text-primary/80" : "text-zinc-500"}`}>
                                 {opt.description}
                               </span>
                           </div>
                           {selectedOptionId === opt.id && verifying && (
                             <div className="absolute right-4 top-1/2 -translate-y-1/2">
                               <Loader2 className="w-4 h-4 animate-spin text-primary" />
                             </div>
                           )}
                       </Button>
                   ))}
               </div>
           </div>

           <DialogFooter className="p-4 border-t border-zinc-900 bg-[#0c0c0c] flex flex-row items-center justify-between sm:justify-between sm:gap-0">
                <div className="flex items-center text-[10px] text-zinc-600 gap-1.5 font-mono uppercase tracking-wider">
                    <ShieldAlert className="w-3 h-3 text-red-900/80" /> Root Access Required
                </div>
                <Button 
                    variant="ghost" 
                    onClick={handleSkip}
                    disabled={verifying}
                    className="h-8 text-[10px] text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 font-mono tracking-wider uppercase"
                >
                    System Override (Skip) →
                </Button>
           </DialogFooter>
       </DialogContent>
    </Dialog>
  );
}
