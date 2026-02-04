import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ArrowRight, ArrowLeft, Loader2, ListFilter } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { api, BlogPost as ApiBlogPost } from "@/app/api";
import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { toast } from "sonner";
import { ContentRenderer } from "./ContentRenderer";

interface BlogPost extends ApiBlogPost {
  category: string;
  excerpt: string;
  date: string;
}

export function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { role, welcomeShown, setWelcomeShown } = useUser();

  useEffect(() => {
    if (role === "learner" && !welcomeShown) {
      toast.message("Keep Going!", {
        description: "Learning is a journey. Here are some resources for you.",
        duration: 5000,
      });
      setWelcomeShown(true);
    }
  }, [role, welcomeShown, setWelcomeShown]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await api.blogs.getAll(currentPage, 10);
        setPosts(
          data.content.map((post) => ({
            ...post,
            category: post.category || "General",
            excerpt: post.content
              ? post.content.substring(0, 150) + "..."
              : "No preview available",
            date: post.createdDate,
          }))
        );
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Failed to fetch blog posts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.createdDate).getTime();
    const dateB = new Date(b.createdDate).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="min-h-screen pt-20">
      <section className="container mx-auto px-6 py-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-3xl md:text-5xl tracking-tight mb-4">
              Kernel Panic & Solutions
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Documenting the engineering process. Technical deep-dives, architectural
              decisions, and the continuous pursuit of clean code.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <ListFilter className="w-4 h-4 text-muted-foreground" />
            <Select
              value={sortOrder}
              onValueChange={(value: "newest" | "oldest") => setSortOrder(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Date - Newest</SelectItem>
                <SelectItem value="oldest">Date - Oldest</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Blog Posts List */}
            <div className="max-w-4xl space-y-6">
              {sortedPosts.length > 0 ? (
                sortedPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative p-8 glass-panel rounded-sm transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(255,77,77,0.1)] hover:-translate-x-[-10px] cursor-pointer"
                    onClick={() => setSelectedPost(post)}
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />

                    {/* Category Badge */}
                    <span className="inline-block px-3 py-1 rounded-sm border border-white/10 bg-white/5 text-[10px] text-muted-foreground uppercase tracking-widest mb-4 font-mono group-hover:text-primary group-hover:border-primary/30 transition-colors">
                      {post.category}
                    </span>

                    {/* Title */}
                    <h2 className="text-2xl font-bold uppercase tracking-tight mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-muted-foreground leading-relaxed mb-6 font-light line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* Meta Info & Read More */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground font-mono">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-xs uppercase tracking-wider">{post.date}</span>
                        </div>
                      </div>

                      <div
                        className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors"
                      >
                        Read Protocol
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.article>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground font-mono uppercase tracking-widest">
                  System Log Empty.
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="text-sm font-mono">
                  PAGE {currentPage} / {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Fullscreen Blog Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-background"
          >
            <div className="h-full overflow-y-auto w-full">
              <div className="max-w-4xl mx-auto px-6 py-24 relative">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="mb-12 border-b border-border pb-8">
                    <span className="inline-block px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground mb-6 uppercase tracking-widest">
                      {selectedPost.category}
                    </span>

                    <div className="flex items-start gap-4 md:gap-6 mb-8 group">
                      <Button
                        variant="ghost"
                        className="bg-black/30 backdrop-blur-md border border-white/10 text-white hover:bg-black/50 hover:text-white rounded-full p-2 h-10 w-10 md:h-14 md:w-14 flex items-center justify-center shadow-lg transition-all duration-300 shrink-0 mt-1 md:mt-2"
                        onClick={() => setSelectedPost(null)}
                      >
                        <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
                      </Button>
                      <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                        {selectedPost.title}
                      </h1>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                      <Calendar className="w-4 h-4" />
                      <span>PUBLISHED ON: {selectedPost.date}</span>
                    </div>
                  </div>

                  <ContentRenderer content={selectedPost.content} />

                  <div className="mt-24 pt-8 border-t border-border opacity-50 flex justify-between items-center text-xs font-mono">
                    <span>END_OF_TRANSMISSION</span>
                    <span>{selectedPost.id}</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
