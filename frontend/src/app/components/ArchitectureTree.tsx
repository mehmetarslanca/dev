import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Folder, FileCode, CheckCircle2, ChevronRight, ChevronDown, Lock, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface TreeNode {
  name: string;
  path: string;
  type: "folder" | "file";
  children?: TreeNode[];
  desc?: string;
  sha?: string;
}

interface GithubTreeItem {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
  url: string;
}

interface GithubTreeResponse {
  sha: string;
  url: string;
  tree: GithubTreeItem[];
  truncated: boolean;
}

const CACHE_KEY = "github_repo_tree_cache";
const CACHE_EXPIRY = 3600000; // 1 hour

const TARGET_ROOT = "src/main/java/com/arslanca/dev";

const TreeItem = ({ node, depth = 0, onFileClick }: { node: TreeNode; depth?: number; onFileClick: (node: TreeNode) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = node.type === "folder";

  // Auto-expand first level folders
  useEffect(() => {
    if (depth < 2) setIsOpen(true);
  }, [depth]);

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: depth * 0.1 }}
        className={`
          flex items-center gap-2 py-1 px-2 rounded-md cursor-pointer select-none
          hover:bg-primary/10 transition-colors
          ${depth === 0 ? "text-primary font-bold" : "text-foreground/80"}
        `}
        style={{ marginLeft: `${depth * 1.5}rem` }}
        onClick={() => {
            if (isFolder) {
                setIsOpen(!isOpen);
            } else {
                onFileClick(node);
            }
        }}
      >
        {isFolder ? (
            isOpen ? <ChevronDown size={14} className="text-primary" /> : <ChevronRight size={14} className="text-muted-foreground" />
        ) : <div className="w-[14px]" />}
        
        {isFolder ? (
          <Folder size={16} className={node.name === "src" || depth === 0 ? "text-primary" : "text-blue-400"} />
        ) : (
          <FileCode size={16} className="text-yellow-500" />
        )}
        
        <span className="font-mono text-sm tracking-wide truncate max-w-[200px] md:max-w-none">{node.name}</span>

        {node.desc && (
           <span className="text-[10px] text-muted-foreground ml-auto bg-muted px-1.5 py-0.5 rounded border border-border/40 hidden md:inline-block">
             {node.desc}
           </span>
        )}
      </motion.div>

      {isFolder && isOpen && node.children && (
        <div className="relative">
           {/* Vertical Guide Line */}
           <motion.div 
             initial={{ height: 0 }}
             animate={{ height: "100%" }}
             className="absolute left-[calc(1.5rem_*_var(--depth)_+_9px)] top-0 w-px bg-border/40"
             style={{ "--depth": depth } as React.CSSProperties} 
           />
           <div>
             {node.children.map((child, idx) => (
                <TreeItem key={idx} node={child} depth={depth + 1} onFileClick={onFileClick} />
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

export function ArchitectureTree() {
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<TreeNode | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [loadingFile, setLoadingFile] = useState(false);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_EXPIRY) {
                setNodes(data);
                setLoading(false);
                return;
            }
        }

        const response = await fetch("https://api.github.com/repos/postaldudegoespostal/dev/git/trees/master?recursive=1");
        if (!response.ok) throw new Error("Failed to fetch repo");
        const data: GithubTreeResponse = await response.json();

        const tree = buildTree(data.tree);
        setNodes(tree);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: tree, timestamp: Date.now() }));
      } catch (err) {
        console.error("Failed to load GitHub tree:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTree();
  }, []);

  const buildTree = (items: GithubTreeItem[]): TreeNode[] => {
      const root: TreeNode = { name: "src", type: "folder", path: TARGET_ROOT, children: [] };
      const map: Record<string, TreeNode> = { [TARGET_ROOT]: root };

      // Sort items by path length to ensure parents are created first
      const relevantItems = items
          .filter(item => item.path.startsWith(TARGET_ROOT))
          .sort((a, b) => a.path.length - b.path.length);

      relevantItems.forEach(item => {
          if (item.path === TARGET_ROOT) return; // Skip root itself if present

          const parts = item.path.split("/");
          const fileName = parts.pop() || "";
          const parentPath = parts.join("/");

          // Ensure parent exists (it should because of sort, but double check)
          if (map[parentPath]) {
             const newNode: TreeNode = {
                 name: fileName,
                 path: item.path,
                 type: item.type === "tree" ? "folder" : "file",
                 children: item.type === "tree" ? [] : undefined,
                 sha: item.sha
             };
             map[item.path] = newNode;
             map[parentPath].children?.push(newNode);
          }
      });

      // Sort: Folders first, then files
      const sortNodes = (nodes?: TreeNode[]) => {
          if(!nodes) return;
          nodes.sort((a,b) => {
              if (a.type === b.type) return a.name.localeCompare(b.name);
              return a.type === "folder" ? -1 : 1;
          });
          nodes.forEach(n => sortNodes(n.children));
      };

      sortNodes(root.children);
      return [root];
  };

  const getLanguage = (filename: string) => {
      if (!filename) return 'text';
      const ext = filename.split('.').pop()?.toLowerCase();
      switch (ext) {
          case 'java': return 'java';
          case 'ts': case 'tsx': return 'typescript';
          case 'js': case 'jsx': return 'javascript';
          case 'css': return 'css';
          case 'json': return 'json';
          case 'html': return 'html';
          case 'xml': return 'xml';
          case 'md': return 'markdown';
          case 'yml': case 'yaml': return 'yaml';
          default: return 'text';
      }
  };

  const handleFileClick = async (node: TreeNode) => {
      setSelectedFile(node);
      setLoadingFile(true);
      setFileContent(null);

      try {
          const res = await fetch(`https://api.github.com/repos/postaldudegoespostal/dev/git/blobs/${node.sha}`);
          const data = await res.json();
          // content is base64 encoded
          const decoded = atob(data.content.replace(/\n/g, ''));
          setFileContent(decoded);
      } catch (e) {
          console.error(e);
          setFileContent("// Failed to load content.");
      } finally {
          setLoadingFile(false);
      }
  };

  return (
    <>
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 rounded-xl border border-primary/20 bg-background/50 backdrop-blur-sm relative overflow-hidden h-[600px] flex flex-col"
    >
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
      <div className="absolute top-0 right-0 p-4 opacity-20">
        <Lock className="w-24 h-24 text-primary" />
      </div>

      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border shrink-0">
         <div className="h-8 w-1 bg-primary rounded-full" />
         <div>
            <h3 className="text-xl font-bold font-mono text-primary flex items-center gap-2">
               Access Granted <CheckCircle2 size={18} />
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
               {loading ? "CONNECTING TO MAINFRAME..." : "SYSTEM_INTERNALS_UNLOCKED // v4.0.1"}
            </p>
         </div>
      </div>
      
      <div className="space-y-1 overflow-y-auto flex-1 pr-2 custom-scrollbar">
        {loading ? (
             <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                 <Loader2 className="animate-spin" />
                 <span className="text-xs font-mono">Fetching repository data...</span>
             </div>
        ) : (
             nodes.map((node, i) => (
               <TreeItem key={i} node={node} onFileClick={handleFileClick} />
             ))
        )}
      </div>
    </motion.div>

    <Dialog open={!!selectedFile} onOpenChange={(val) => !val && setSelectedFile(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 gap-0 bg-black border-primary/20 sm:max-w-4xl overflow-hidden">
            <DialogHeader className="p-4 border-b border-white/10 shrink-0 bg-black text-white">
                <DialogTitle className="font-mono flex items-center gap-2 text-white">
                    <FileCode size={18} className="text-primary" />
                    {selectedFile?.name}
                </DialogTitle>
                <div className="text-xs text-gray-400 font-mono truncate">
                    {selectedFile?.path}
                </div>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto bg-black font-mono text-xs md:text-sm">
                {loadingFile ? (
                    <div className="flex items-center justify-center h-40">
                         <Loader2 className="animate-spin text-primary" size={24} />
                    </div>
                ) : (
                    <SyntaxHighlighter
                        language={getLanguage(selectedFile?.name || "")}
                        style={vscDarkPlus}
                        customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent', fontSize: '0.9rem' }}
                        showLineNumbers={true}
                        lineNumberStyle={{ minWidth: '2.5em', paddingRight: '1em', color: '#6e6e6e' }}
                        wrapLines={true}
                    >
                        {fileContent || ""}
                    </SyntaxHighlighter>
                )}
            </div>
        </DialogContent>
    </Dialog>
    </>
  );
}
